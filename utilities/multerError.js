const AppError = require('./appError');
const multer = require('multer');
const MAX_FILE_SIZE = require('../controllers/tutorialControllers');

const bytesToMB = (bytes) => bytes / (1024 * 1024);
module.exports = (middleware) => (req, res, next) => {
  middleware(req, res, function (err) {
    if (err && err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: 'fail',
        message: `File too large. Max size is ${bytesToMB(
          MAX_FILE_SIZE.MAX_FILE_SIZE
        )}MB`,
      });
    }
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        status: 'fail',
        message: err.message,
      });
    }
    if (err) {
      return next(new AppError(err, 400));
    }
    next();
  });
};
