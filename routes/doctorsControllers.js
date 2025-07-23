const express = require('express');
const doctorsRoute = express.Router();
const doctorAuthControl = require('../controllers/doctorsAuthControl');
const authentication = require('../controllers/authentication');
const validationRequirement = require('../validators/express-validators');
const validate = require('../validators/validationResult');
const setAavailbility = require('../controllers/setDoctorsAvailability');
const fileController = require('../controllers/fileController');
const photoUpdate = require('../controllers/photoUpdate');

doctorsRoute.use(doctorAuthControl.protect);

doctorsRoute
  .route('/profile')
  .get(authentication.restrictTo('doctor'), doctorAuthControl.profile);
doctorsRoute
  .route('/deleteDoctor')
  .delete(authentication.restrictTo('doctor'), doctorAuthControl.delete);
doctorsRoute
  .route('/update/profile')
  .patch(authentication.restrictTo('doctor'), doctorAuthControl.updateProfile);
//set docotors availability
doctorsRoute
  .route('/setAvailability')
  .patch(setAavailbility.setDoctorsAvailability);
//update profile photo
doctorsRoute
  .route('/photo')
  .patch(
    authentication.restrictTo('doctor'),
    fileController.uploadUserPhoto,
    photoUpdate.doctorsPicxUpdate
  );

// for admin only
doctorsRoute
  .route('/:id')
  .get(authentication.restrictTo('admin'), doctorAuthControl.getDoctorById);

doctorsRoute
  .route('/allDoctors')
  .get(authentication.restrictTo('admin'), doctorAuthControl.retriveAllDoctors);

doctorsRoute
  .route('/reactivate')
  .patch(
    authentication.restrictTo('admin'),
    validationRequirement.reactivateUser,
    validate,
    doctorAuthControl.restoreDeleted
  );

module.exports = doctorsRoute;
