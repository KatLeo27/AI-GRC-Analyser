'use strict';

const { extractText }           = require('./textExtractor');
const { analyzeCompliance }     = require('./openaiService');
const { syncToSalesforce }      = require('./salesforceService');
const { sendVendorConfirmation, sendAdminNotification } = require('./emailService');
const { loadPolicies }          = require('./policiesService');
const { REGIONAL_FRAMEWORKS }   = require('./regionalFrameworks');
const logger                    = require('../utils/logger');

async function processSubmission(vendorData, file) {
  const { companyName, hqLocation } = vendorData;

  try {
    logger.info('Processing started', { company: companyName });

    // Step 1 — Send vendor confirmation email immediately (before AI, it's fast)
    await sendVendorConfirmation(vendorData);

    // Step 2 — Extract text from document
    const text = await extractText(file);
    logger.info('Text extracted', { company: companyName, chars: text.length });

    // Step 3 — Load active policies
    const storedConfig = loadPolicies();
    const region = hqLocation || storedConfig.region || 'Global';
    const policies = {
      regionalFrameworks: REGIONAL_FRAMEWORKS[region] || REGIONAL_FRAMEWORKS['Global'],
      customPolicies:     storedConfig.customPolicies,
    };

    // Step 4 — Run AI analysis
    const aiResult = await analyzeCompliance(text, policies);
    logger.info('AI analysis complete', {
      company: companyName,
      score:   aiResult.security_score,
      status:  aiResult.risk_status,
      policies: aiResult.policy_results?.length ?? 0,
    });

    // Step 5 — Sync to Salesforce (skipped if not configured)
    const sfResult = await syncToSalesforce(vendorData, aiResult);
    if (sfResult) {
      logger.info('Salesforce sync complete', { company: companyName, ...sfResult });
    }

    // Step 6 — Notify admin
    await sendAdminNotification(vendorData, aiResult);

    logger.info('Processing complete', { company: companyName });

  } catch (err) {
    // Never throw — vendor already received 202
    logger.error('Processing failed', {
      company: companyName,
      error:   err.message,
      code:    err.code || 'UNKNOWN',
    });
  }
}

module.exports = { processSubmission };
