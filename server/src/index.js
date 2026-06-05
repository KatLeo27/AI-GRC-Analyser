'use strict';

const config = require('./config');
const logger = require('./utils/logger');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const complianceRouter = require('./routes/compliance');
const policiesRouter = require('./routes/policies');

const app = express();

app.use(cors({ origin: config.CORS_ORIGINS.split(',').map(o => o.trim()) }));
app.use(express.json());
app.use(morgan('dev', { stream: { write: msg => logger.http(msg.trim()) } }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', salesforceEnabled: config.SALESFORCE_ENABLED });
});

app.use('/api/compliance', complianceRouter);
app.use('/api/policies', policiesRouter);

// Global error handler
app.use((err, _req, res, _next) => {
  logger.error(err.message, { code: err.code, stack: err.stack });

  const STATUS_MAP = {
    INVALID_FILE_TYPE:      400,
    FILE_TOO_LARGE:         400,
    MISSING_FIELDS:         400,
    VALIDATION_ERROR:       400,
    NOT_FOUND:              404,
    TEXT_EXTRACTION_FAILED: 422,
    OPENAI_ERROR:           502,
    SALESFORCE_AUTH_ERROR:  502,
    SALESFORCE_ERROR:       502,
    POLICIES_ERROR:         500,
  };

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      error: { code: 'FILE_TOO_LARGE', message: 'File exceeds the 10 MB limit.' },
    });
  }

  const status = STATUS_MAP[err.code] || 500;
  return res.status(status).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'An unexpected error occurred.',
    },
  });
});

app.listen(config.PORT, () => {
  logger.info(`Server running on http://localhost:${config.PORT}`);
  logger.info(`Salesforce integration: ${config.SALESFORCE_ENABLED ? 'ENABLED' : 'disabled (credentials not set)'}`);
  logger.info(`AI provider: ${config.AI_PROVIDER} (${config.AI_MODEL})`);
});
