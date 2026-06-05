const multer = require('multer');

const ALLOWED_MIMETYPES = new Set([
  'application/pdf',
  'text/plain',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter(_req, file, cb) {
    if (ALLOWED_MIMETYPES.has(file.mimetype)) {
      cb(null, true);
    } else {
      const err = new Error(`Unsupported file type: ${file.mimetype}. Allowed: .pdf, .txt, .docx`);
      err.code = 'INVALID_FILE_TYPE';
      cb(err, false);
    }
  },
});

module.exports = upload;
