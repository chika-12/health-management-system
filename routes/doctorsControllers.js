const express = require('express');
const doctorsRoute = express.Router();
const doctorAuthControl = require('../controllers/doctorsAuthControl');
const authentication = require('../controllers/authentication');
const validationRequirement = require('../validators/express-validators');
const validate = require('../validators/validationResult');

doctorsRoute.use(doctorAuthControl.protect);

doctorsRoute.route('/profile').get(doctorAuthControl.profile);
doctorsRoute.route('/:id').get(doctorAuthControl.getDoctorById);
doctorsRoute.route('/deleteDoctor').delete(doctorAuthControl.delete);
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
