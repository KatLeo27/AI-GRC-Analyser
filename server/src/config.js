'use strict';

require('dotenv').config();

const AI_PROVIDER = process.env.AI_PROVIDER || 'ollama';

const DEFAULT_MODELS = {
  openai: 'gpt-4o',
  groq:   'llama-3.1-8b-instant',
  ollama: 'qwen2.5-coder:1.5b',
};

module.exports = Object.freeze({
  PORT: parseInt(process.env.PORT || '3000', 10),
  CORS_ORIGINS: process.env.CORS_ORIGINS || 'http://localhost:5173',

  AI_PROVIDER,
  OPENAI_API_KEY:  process.env.OPENAI_API_KEY  || 'dummy',
  GROQ_API_KEY:    process.env.GROQ_API_KEY    || 'dummy',
  OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL || 'http://localhost:11434/v1',
  AI_MODEL: process.env.AI_MODEL || DEFAULT_MODELS[AI_PROVIDER] || 'qwen2.5-coder:1.5b',

  // Email — optional; leave SMTP_USER blank to use Ethereal test account in development
  SMTP_HOST:   process.env.SMTP_HOST   || 'smtp.ethereal.email',
  SMTP_PORT:   process.env.SMTP_PORT   || '587',
  SMTP_SECURE: process.env.SMTP_SECURE || 'false',
  SMTP_USER:   process.env.SMTP_USER   || '',
  SMTP_PASS:   process.env.SMTP_PASS   || '',
  EMAIL_FROM:  process.env.EMAIL_FROM  || 'Fortress <noreply@fortress.local>',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || '',

  // Salesforce — optional until account is set up
  SF_LOGIN_URL: process.env.SF_LOGIN_URL,
  SF_CLIENT_ID: process.env.SF_CLIENT_ID,
  SF_CLIENT_SECRET: process.env.SF_CLIENT_SECRET,
  SF_USERNAME: process.env.SF_USERNAME,
  SF_PASSWORD: process.env.SF_PASSWORD,
  SF_SECURITY_TOKEN: process.env.SF_SECURITY_TOKEN,
  SALESFORCE_ENABLED: !!(
    process.env.SF_CLIENT_ID &&
    process.env.SF_CLIENT_SECRET &&
    process.env.SF_USERNAME &&
    process.env.SF_PASSWORD
  ),
});
