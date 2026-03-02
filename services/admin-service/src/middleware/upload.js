const multer = require('multer');

const imageFilter = (_req, file, cb) => {
  const allowed = /^image\/(jpeg|png|gif|webp|svg\+xml)$/i.test(file.mimetype);
  if (allowed) cb(null, true);
  else cb(new Error('Only image files (JPEG, PNG, GIF, WebP, SVG) are allowed'), false);
};

const memoryStorage = multer.memoryStorage();
const uploadImage = multer({
  storage: memoryStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
}).single('file');

module.exports = { uploadImage };
