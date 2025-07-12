const express = require('express');
const tutorialRoute = express.Router();
const authentication = require('../controllers/authentication');
const doctorAuthControl = require('../controllers/doctorsAuthControl');
const tutorialControllers = require('../controllers/tutorialControllers');
const validationResult = require('../validators/validationResult');
const validatorRequirement = require('../validators/express-validators');
const multerError = require('../utilities/multerError');

tutorialRoute.use(doctorAuthControl.protect);
// uploading videos for doctors
tutorialRoute
  .route('/videoupload')
  .post(
    authentication.restrictTo('doctor'),
    multerError(tutorialControllers.videoUpload),
    validatorRequirement.videoValidator,
    validationResult,
    tutorialControllers.saveVideo
  );

//Article writing
tutorialRoute
  .route('/writeup')
  .post(
    authentication.restrictTo('doctor'),
    multerError(tutorialControllers.uploadTutorialImage),
    validatorRequirement.articleValidator,
    validationResult,
    tutorialControllers.savePhotoToCloudinary
  );
tutorialRoute
  .route('/retrive_videos')
  .get(tutorialControllers.retriveAllTutorialVideos);
tutorialRoute.route('/articles').get(tutorialControllers.retriveAllArticles);
module.exports = tutorialRoute;
