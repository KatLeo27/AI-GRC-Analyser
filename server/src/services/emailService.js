'use strict';

const nodemailer = require('nodemailer');
const config = require('../config');
const logger = require('../utils/logger');

let _transporter = null;

async function getTransporter() {
  if (_transporter) return _transporter;

  if (config.SMTP_USER) {
    // Production: use configured SMTP (Gmail, Outlook, etc.)
    _transporter = nodemailer.createTransport({
      host:   config.SMTP_HOST,
      port:   parseInt(config.SMTP_PORT || '587', 10),
      secure: config.SMTP_SECURE === 'true',
      auth:   { user: config.SMTP_USER, pass: config.SMTP_PASS },
    });
    logger.info('Email: using configured SMTP', { host: config.SMTP_HOST, user: config.SMTP_USER });
  } else {
    // Development: Ethereal auto-account — no setup needed
    const testAccount = await nodemailer.createTestAccount();
    _transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
    logger.info('Email: using Ethereal test account (development)', { user: testAccount.user });
  }

  return _transporter;
}

async function send(to, subject, html, text) {
  const transporter = await getTransporter();
  const from = config.EMAIL_FROM || 'Fortress <noreply@fortress.local>';

  try {
    const info = await transporter.sendMail({ from, to, subject, html, text });
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      logger.info('Email sent (Ethereal preview)', { to, subject, preview: previewUrl });
    } else {
      logger.info('Email sent', { to, subject, messageId: info.messageId });
    }
  } catch (err) {
    logger.error('Email send failed', { to, subject, error: err.message });
    // Don't throw — email failure should not break the processing pipeline
  }
}

async function sendVendorConfirmation(vendorData) {
  const { contactName, contactEmail, companyName } = vendorData;

  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px;color:#1e293b">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:24px">
        <span style="font-size:20px;font-weight:700;letter-spacing:-0.5px">🔒 FORTRESS</span>
      </div>
      <h2 style="font-size:18px;font-weight:600;margin:0 0 16px">Submission Received</h2>
      <p style="margin:0 0 12px;line-height:1.6;color:#475569">Dear ${contactName},</p>
      <p style="margin:0 0 12px;line-height:1.6;color:#475569">
        Thank you for submitting the compliance documentation for <strong>${companyName}</strong>.
        Your files have been successfully registered to our secure intake repository.
      </p>
      <p style="margin:0 0 12px;line-height:1.6;color:#475569">
        No further action is required at this time. Our vendor management team will review
        your profile against our standard compliance guidelines and reach out to your account
        executive within the next few business days.
      </p>
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin:24px 0">
        <p style="margin:0;font-size:13px;color:#64748b">
          <strong>Reference:</strong> ${companyName}<br>
          <strong>Contact:</strong> ${contactName} (${contactEmail})<br>
          <strong>Status:</strong> Documentation Ingested — Under Review
        </p>
      </div>
      <p style="margin:0;line-height:1.6;color:#94a3b8;font-size:13px">
        Fortress Vendor Compliance Portal · This is an automated message, please do not reply.
      </p>
    </div>
  `;

  const text = `Dear ${contactName},\n\nYour compliance documentation for ${companyName} has been received.\n\nOur vendor management team will review your profile and reach out within the next few business days.\n\nFortress Vendor Compliance Portal`;

  await send(contactEmail, 'Your compliance submission has been received — Fortress', html, text);
}

async function sendAdminNotification(vendorData, aiResult) {
  const adminEmail = config.ADMIN_EMAIL;
  if (!adminEmail) {
    logger.debug('Email: ADMIN_EMAIL not set, skipping admin notification');
    return;
  }

  const { companyName, contactName, contactEmail, jobTitle, hqLocation } = vendorData;
  const { security_score, risk_status, ai_audit_summary } = aiResult;

  const scoreColour = security_score >= 80 ? '#10b981' : '#f59e0b';
  const statusColour = risk_status === 'Approved' ? '#10b981' : '#f59e0b';

  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px;color:#1e293b">
      <div style="margin-bottom:24px">
        <span style="font-size:20px;font-weight:700;letter-spacing:-0.5px">🔒 FORTRESS</span>
        <span style="margin-left:8px;font-size:13px;color:#64748b">Internal Notification</span>
      </div>
      <h2 style="font-size:18px;font-weight:600;margin:0 0 16px">New Compliance Review</h2>

      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin-bottom:20px">
        <p style="margin:0 0 4px;font-size:16px;font-weight:600">${companyName}</p>
        <p style="margin:0;font-size:13px;color:#64748b">${contactName} · ${jobTitle} · ${hqLocation}</p>
        <p style="margin:4px 0 0;font-size:13px;color:#64748b">${contactEmail}</p>
      </div>

      <div style="display:flex;gap:12px;margin-bottom:20px">
        <div style="flex:1;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px;text-align:center">
          <p style="margin:0;font-size:28px;font-weight:700;color:${scoreColour}">${security_score}</p>
          <p style="margin:4px 0 0;font-size:12px;color:#64748b">Security Score</p>
        </div>
        <div style="flex:2;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px;display:flex;align-items:center">
          <span style="font-size:13px;font-weight:600;color:${statusColour}">${risk_status}</span>
        </div>
      </div>

      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px">
        <p style="margin:0 0 8px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:#94a3b8">AI Audit Summary</p>
        <p style="margin:0;font-size:13px;line-height:1.6;color:#475569">${ai_audit_summary}</p>
      </div>
    </div>
  `;

  const text = `New Compliance Review\n\nCompany: ${companyName}\nContact: ${contactName} (${contactEmail})\nScore: ${security_score}/100\nStatus: ${risk_status}\n\nSummary:\n${ai_audit_summary}`;

  await send(adminEmail, `[Fortress] New review: ${companyName} — Score ${security_score}/100`, html, text);
}

module.exports = { sendVendorConfirmation, sendAdminNotification };
