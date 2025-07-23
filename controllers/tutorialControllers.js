//const PatientData = require('../model/patientsData');
const AppError = require('../utilities/appError');
const catchAsync = require('../utilities/catchAsync');
const Article = require('../model/articleModel');
const Tutorial = require('../model/tutorial');
const cache = require('../utilities/cache');
const ApiFeatures = require('../utilities/apiFeatures');
const uploadToCloudinary = require('../utilities/uploadToCloudinary');
const upload = require('../utilities/multerHandler');

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
  const result = await uploadToCloudinary(
    req.file.buffer,
    'tutorials',
    'video'
  );
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
  cache.del('/api/v1/tutorial/retrive_videos');

  responseHandler(200, res, video);
});

//article handler
exports.uploadTutorialImage = upload.array('images', 5);
exports.savePhotoToCloudinary = catchAsync(async (req, res, next) => {
  let uploadedImages = [];
  if (req.files && req.files.length > 0) {
    if (uploadedImages.length > 5) {
      return next(new AppError('you can only upload 5 images', 400));
    }

    uploadedImages = await Promise.all(
      req.files.map((file) =>
        uploadToCloudinary(file.buffer, 'tutorial_images', 'image', 400, 400)
      )
    );
  }

  const article = await Article.create({
    title: req.body.title,
    body: req.body.body,
    images: uploadedImages.map((img) => img.secure_url),
    postedBy: req.user.id,
    tags: req.body.tags || [],
  });
  cache.del('/api/v1/tutorial/retrive_videos');
  responseHandler(200, res, article);
});

//Get routes for getting tutorials(videos and atricles)

exports.retriveAllTutorialVideos = catchAsync(async (req, res, next) => {
  const cachedKey = req.originalUrl;
  let videos = cache.get(cachedKey);
  //let videos = null;
  if (!videos) {
    videos = await new ApiFeatures(Tutorial.find().lean(), req.query)
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
    articles = await new ApiFeatures(Article.find().lean(), req.query)
      .filtering()
      .fields()
      .sorting()
      .pagination().query;
    if (articles.length === 0) {
      return next(new AppError('No article found', 404));
    }
    cache.set(cachedKey, articles, 60);
  }
  responseHandler(200, res, articles);
});
