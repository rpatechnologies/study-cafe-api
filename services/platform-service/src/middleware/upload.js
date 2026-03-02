const path = require('path');
const fs = require('fs');
const multer = require('multer');

const uploadsDir = path.join(__dirname, '../uploads');

try {
  fs.mkdirSync(uploadsDir, { recursive: true });
} catch (_) {}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    const safeExt = /^\.(jpe?g|png|gif|webp|svg)$/i.test(ext) ? ext : '.jpg';
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${safeExt}`;
    cb(null, name);
  },
});

const imageFilter = (_req, file, cb) => {
  const allowed = /^image\/(jpeg|png|gif|webp|svg\+xml)$/i.test(file.mimetype);
  if (allowed) cb(null, true);
  else cb(new Error('Only image files (JPEG, PNG, GIF, WebP, SVG) are allowed'), false);
};

const uploadImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
}).single('file');

module.exports = { uploadImage, uploadsDir };
