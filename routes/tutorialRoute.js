const express = require('express');
const tutorialRoute = express.Router();
const authentication = require('../controllers/authentication');
const tutorialControllers = require('../controllers/tutorialControllers');

tutorialRoute.use(authentication.protect);
// uploading videos for doctors
tutorialRoute
  .route('/videoupload')
  .post(
    authentication.restrictTo('doctor'),
    tutorialControllers.videoUpload,
    tutorialControllers.saveVideo
  );

//Article writing
tutorialRoute.route('/writeup').post(
  /*authentication.restrictTo('doctor'),*/
  tutorialControllers.uploadTutorialImage,
  tutorialControllers.savePhotoToCloudinary
);
tutorialRoute
  .route('/retrive_videos')
  .get(tutorialControllers.retriveAllTutorialVideos);
tutorialRoute.route('/articles').get(tutorialControllers.retriveAllArticles);
module.exports = tutorialRoute;
