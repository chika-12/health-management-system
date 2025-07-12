const express = require('express');
const doctorsRoute = express.Router();
const authentication = require('../controllers/authentication');
const doctorAuthControl = require('../controllers/doctorsAuthControl');
const validationRequirement = require('../validators/express-validators');
const validationResult = require('../validators/validationResult');

//doctorsRoute.use(doctorAuthControl.protect);
doctorsRoute
  .route('/signup')
  .post(
    validationRequirement.doctorValidator,
    validationResult,
    doctorAuthControl.signup
  );
doctorsRoute
  .route('/login')
  .post(
    validationRequirement.loginDetails,
    validationResult,
    doctorAuthControl.login
  );
doctorsRoute.route('/logout').post(authentication.logout);
module.exports = doctorsRoute;
