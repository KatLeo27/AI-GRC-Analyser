const pdfParse = require('pdf-parse');
const mammoth  = require('mammoth');
const logger   = require('../utils/logger');

const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

async function extractText(file) {
  let text = '';

  if (file.mimetype === 'application/pdf') {
    logger.debug('Text extraction: PDF', { size: file.size });
    const result = await pdfParse(file.buffer);
    text = result.text;
  } else if (file.mimetype === DOCX_MIME) {
    logger.debug('Text extraction: DOCX', { size: file.size });
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    text = result.value;
  } else {
    logger.debug('Text extraction: plain text', { size: file.size });
    text = file.buffer.toString('utf-8');
  }

  text = text.trim();

  if (!text) {
    const err = new Error('Could not extract any readable text from the uploaded file.');
    err.code = 'TEXT_EXTRACTION_FAILED';
    throw err;
  }

  // Guard against context window overflow — 80k chars is safe for GPT-4o
  return text.slice(0, 80_000);
}

module.exports = { extractText };
