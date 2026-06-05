'use strict';

const axios = require('axios');
const config = require('../config');
const logger = require('../utils/logger');

// Token cache — avoids re-authenticating on every request
let tokenCache = { access_token: null, instance_url: null, expires_at: 0 };

async function getSFToken() {
  if (tokenCache.access_token && Date.now() < tokenCache.expires_at) {
    logger.debug('Salesforce: using cached token');
    return tokenCache;
  }

  logger.info('Salesforce: fetching new access token');
  try {
    const params = new URLSearchParams({
      grant_type:    'password',
      client_id:     config.SF_CLIENT_ID,
      client_secret: config.SF_CLIENT_SECRET,
      username:      config.SF_USERNAME,
      password:      `${config.SF_PASSWORD}${config.SF_SECURITY_TOKEN || ''}`,
    });

    const res = await axios.post(`${config.SF_LOGIN_URL}/services/oauth2/token`, params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    tokenCache = {
      access_token: res.data.access_token,
      instance_url: res.data.instance_url,
      expires_at:   Date.now() + 110 * 60 * 1000, // 110 minutes
    };
    logger.info('Salesforce: token acquired', { instance: tokenCache.instance_url });
    return tokenCache;
  } catch (e) {
    const err = new Error(`Salesforce auth failed: ${e.response?.data?.error_description || e.message}`);
    err.code = 'SALESFORCE_AUTH_ERROR';
    throw err;
  }
}

async function sfPost(access_token, instance_url, path, data) {
  try {
    const res = await axios.post(`${instance_url}/services/data/v60.0${path}`, data, {
      headers: {
        Authorization:  `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  } catch (e) {
    const detail = e.response?.data?.[0]?.message || e.message;
    const err = new Error(`Salesforce POST ${path} failed: ${detail}`);
    err.code = 'SALESFORCE_ERROR';
    throw err;
  }
}

async function sfQuery(access_token, instance_url, soql) {
  try {
    const res = await axios.get(`${instance_url}/services/data/v60.0/query`, {
      headers: { Authorization: `Bearer ${access_token}` },
      params: { q: soql },
    });
    return res.data;
  } catch (e) {
    const err = new Error(`Salesforce query failed: ${e.message}`);
    err.code = 'SALESFORCE_ERROR';
    throw err;
  }
}

// Call 2 — Upsert Account by Website to prevent duplicates
async function upsertAccount(access_token, instance_url, { companyName, website, hqLocation }) {
  const query = await sfQuery(
    access_token, instance_url,
    `SELECT Id FROM Account WHERE Website = '${website.replace(/'/g, "\\'")}' LIMIT 1`
  );

  if (query.records.length > 0) {
    const id = query.records[0].Id;
    logger.info('Salesforce: existing Account found', { accountId: id, website });
    return id;
  }

  const result = await sfPost(access_token, instance_url, '/sobjects/Account', {
    Name:           companyName,
    Website:        website,
    BillingCountry: hqLocation || null,
  });
  logger.info('Salesforce: Account created', { accountId: result.id });
  return result.id;
}

// Call 3 — Upsert Contact by Email to prevent duplicates
async function upsertContact(access_token, instance_url, { accountId, contactName, contactEmail, jobTitle }) {
  const query = await sfQuery(
    access_token, instance_url,
    `SELECT Id FROM Contact WHERE Email = '${contactEmail.replace(/'/g, "\\'")}' LIMIT 1`
  );

  if (query.records.length > 0) {
    const id = query.records[0].Id;
    logger.info('Salesforce: existing Contact found', { contactId: id, email: contactEmail });
    return id;
  }

  const result = await sfPost(access_token, instance_url, '/sobjects/Contact', {
    LastName:  contactName,
    Email:     contactEmail,
    Title:     jobTitle || null,
    AccountId: accountId,
  });
  logger.info('Salesforce: Contact created', { contactId: result.id });
  return result.id;
}

// Call 4 — Create Compliance_Review__c child record
async function createComplianceReview(access_token, instance_url, { accountId, contactEmail, aiResult }) {
  const result = await sfPost(access_token, instance_url, '/sobjects/Compliance_Review__c', {
    Account__c:          accountId,
    Security_Score__c:   aiResult.security_score,
    Risk_Status__c:      aiResult.risk_status,
    AI_Audit_Summary__c: aiResult.ai_audit_summary,
    Contact_Email__c:    contactEmail,
  });
  logger.info('Salesforce: Compliance_Review__c created', { reviewId: result.id });
  return result.id;
}

async function syncToSalesforce(vendorData, aiResult) {
  if (!config.SALESFORCE_ENABLED) {
    logger.info('Salesforce: skipped — credentials not configured');
    return null;
  }

  const { companyName, website, hqLocation, contactName, contactEmail, jobTitle } = vendorData;
  const { access_token, instance_url } = await getSFToken();

  const accountId  = await upsertAccount(access_token, instance_url, { companyName, website, hqLocation });
  const contactId  = await upsertContact(access_token, instance_url, { accountId, contactName, contactEmail, jobTitle });
  const reviewId   = await createComplianceReview(access_token, instance_url, { accountId, contactEmail, aiResult });

  return { accountId, contactId, reviewId };
}

module.exports = { syncToSalesforce };
