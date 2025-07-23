const multer = require('multer');
const AppError = require('./appError');
// multer configuration for memory optimization and cloudinary upload
const storage = multer.memoryStorage();
// maximum size of video
const MAX_FILE_SIZE = 300 * 1024 * 1024;
exports.MAX_FILE_SIZE = MAX_FILE_SIZE;
//Setting file type
const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (req, file, cb) => {
    const allowedFiles = ['video/mp4', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedFiles.includes(file.mimetype)) {
      return cb(new AppError('file type not allowed', 400), false);
    }
    cb(null, true);
  },
});
module.exports = upload;
