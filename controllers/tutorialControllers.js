//const PatientData = require('../model/patientsData');
const AppError = require('../utilities/appError');
const catchAsync = require('../utilities/catchAsync');
const cloudinary = require('../utilities/cloudSevice');
const multer = require('multer');
const Article = require('../model/articleModel');
const streamifier = require('streamifier');
const Tutorial = require('../model/tutorial');
const cache = require('../utilities/cache');
const ApiFeatures = require('../utilities/apiFeatures');

// multer configuration for memory optimization and cloudinary upload
const storage = multer.memoryStorage();
// maximum size of video
const MAX_FILE_SIZE = 100 * 1024 * 1024;
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

// Response Handler
const responseHandler = (statusCode, res, data) => {
  res.status(statusCode).json({
    status: 'success',
    result: data.length,
    data,
  });
};

// video handler
exports.videoUpload = upload.single('video');
exports.saveVideo = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('video required', 400));
  }
  const uploadToCloudinary = (videoBuffer) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'tutorials',
          resource_type: 'video',
        },
        (error, result) => {
          if (error) {
            console.log('Error:', error);
            return reject(new AppError('video failed to upload', 500));
          }
          resolve(result);
        }
      );
      streamifier.createReadStream(videoBuffer).pipe(stream);
    });
  };
  const result = await uploadToCloudinary(req.file.buffer);
  if (!result || !result.secure_url) {
    return next(new AppError('Upload failed', 500));
  }
  // Mongoose schema will validate required fields like title & description
  const video = await Tutorial.create({
    title: req.body.title,
    description: req.body.description,
    videoUrl: result.secure_url,
    postedBy: req.user.id, // Doctor ID
    tags: req.body.tags,
  });
  cache.del('tutorialVideos');

  responseHandler(200, res, video);
});

//article handler
exports.uploadTutorialImage = upload.array('image', 5);
exports.savePhotoToCloudinary = catchAsync(async (req, res, next) => {
  let uploadedImages = [];

  if (req.files && req.files.length > 0) {
    if (uploadedImages.length > 5) {
      return next(new AppError('you can only upload 5 images', 400));
    }
    const uploadToCloudinary = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'tutorial_images',
            width: 400,
            height: 400,
            resource_type: 'image',
          },
          (error, result) => {
            if (error) {
              return reject(new AppError('unable to upload photo', 400));
            }
            resolve(result);
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    uploadedImages = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file.buffer))
    );
  }

  const article = await Article.create({
    title: req.body.title,
    body: req.body.body,
    images: uploadedImages,
    postedBy: req.user.id,
    tags: req.body.tags || [],
  });
  cache.del('allArticles');
  responseHandler(200, res, article);
});

//Get routes for getting tutorials(videos and atricles)

exports.retriveAllTutorialVideos = catchAsync(async (req, res, next) => {
  const cachedKey = req.originalUrl;
  let videos = cache.get(cachedKey);
  if (!videos) {
    videos = await new ApiFeatures(Tutorial.find(), req.query)
      .filtering()
      .sorting()
      .fields()
      .pagination().query;
    if (videos.length === 0) {
      return next(new AppError('No videos found', 404));
    }
    cache.set(cachedKey, videos, 60);
  }

  responseHandler(200, res, videos);
});

exports.retriveAllArticles = catchAsync(async (req, res, next) => {
  const cachedKey = req.originalUrl;
  let articles = cache.get(cachedKey);
  if (!articles) {
    articles = await new ApiFeatures(Article.find(), req.query)
      .filtering()
      .fields()
      .sorting()
      .pagination().query;
    if (articles.length === 0) {
      return next(new AppError('No article found', 404));
    }
    cache.set(cachedKey, articles);
  }
  responseHandler(200, res, articles);
});
