const express = require('express');
const userRoute = express.Router();
const usersController = require('../controllers/userControllers');
const authentication = require('../controllers/authentication');
const userAuthentication = require('../controllers/userAuthentication');
const fileController = require('../controllers/fileController');
const photoUpdate = require('../controllers/photoUpdate');

userRoute.use(userAuthentication.protect);
//Get all users
userRoute
  .route('/allusers')
  .get(
    authentication.restrictTo('admin'),
    usersController.retriveAllPatientsData
  ); // for admins only

//fetch user profile
userRoute
  .route('/profile')
  .get(authentication.restrictTo('patient'), usersController.userProfile);

userRoute.post(
  '/postAdmin',
  authentication.restrictTo('admin'),
  usersController.registerUser
); // For registering admins

// for geting specific user
userRoute.get(
  '/specificuser/:id',
  authentication.restrictTo('admin'),
  usersController.retriveUserById
);

//delete user
userRoute.delete('/delete', usersController.delete);
//restore user
userRoute.patch(
  '/restore/:id',
  authentication.restrictTo('admin'),
  usersController.reactivateUser
);
//update photo
userRoute
  .route('/update/photo')
  .patch(
    authentication.restrictTo('patient'),
    fileController.uploadUserPhoto,
    photoUpdate.patientUpdateprofilePix
  );

//uploading test result
userRoute.patch(
  '/testResult',
  authentication.restrictTo('patients'),
  fileController.uploadUserfile,
  fileController.testResult
);
//update profile
userRoute
  .route('/update/profile')
  .patch(
    authentication.restrictTo('patient'),
    usersController.updateUserProfile
  );
module.exports = userRoute;
