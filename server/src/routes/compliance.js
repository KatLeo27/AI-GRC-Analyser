'use strict';

const express = require('express');
const upload = require('../middleware/upload');
const { processSubmission } = require('../services/complianceProcessor');
const logger = require('../utils/logger');

const router = express.Router();

const FREE_EMAIL_DOMAINS = new Set([
  'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.in', 'yahoo.co.uk',
  'hotmail.com', 'outlook.com', 'live.com', 'msn.com',
  'icloud.com', 'me.com', 'mac.com',
  'aol.com', 'protonmail.com', 'proton.me',
  'mail.com', 'ymail.com', 'rocketmail.com',
  'rediffmail.com', 'zoho.com', 'tutanota.com',
  'mailinator.com', 'tempmail.com', '10minutemail.com',
]);

function isFreeEmail(email) {
  const domain = email.split('@')[1]?.toLowerCase();
  return domain ? FREE_EMAIL_DOMAINS.has(domain) : true;
}

router.post('/', upload.single('file'), (req, res, next) => {
  try {
    const { companyName, website, hqLocation, contactName, contactEmail, jobTitle } = req.body;

    // Validate required fields
    const missing = ['companyName', 'website', 'hqLocation', 'contactName', 'contactEmail', 'jobTitle']
      .filter(f => !req.body[f]?.trim());

    if (missing.length) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_FIELDS', message: `Missing required fields: ${missing.join(', ')}` },
      });
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Please enter a valid email address.' },
      });
    }

    // Block free email providers (bypass with ALLOW_FREE_EMAILS=true for testing)
    if (!process.env.ALLOW_FREE_EMAILS && isFreeEmail(contactEmail)) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Please use a corporate email address. Personal email providers (Gmail, Yahoo, etc.) are not accepted.' },
      });
    }

    // Validate file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_FIELDS', message: 'A compliance document (.pdf, .txt, or .docx) is required.' },
      });
    }

    logger.info('Submission received', { company: companyName, contact: contactEmail });

    // Respond 202 immediately — vendor does not wait for AI processing
    res.status(202).json({
      success: true,
      message: 'Your documentation has been received. A confirmation will be sent to your registered email.',
    });

    // Fire-and-forget background processing
    const vendorData = { companyName, website, hqLocation, contactName, contactEmail, jobTitle };
    processSubmission(vendorData, req.file);

  } catch (err) {
    next(err);
  }
});

module.exports = router;
