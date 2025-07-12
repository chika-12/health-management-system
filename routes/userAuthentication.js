const express = require('express');
const userAuthenticationRoute = express.Router();
const authenticationController = require('../controllers/authentication');
const userAuthenticationController = require('../controllers/userAuthentication');
const validationResult = require('../validators/validationResult');
const validatorRequirement = require('../validators/express-validators');

userAuthenticationRoute.route('/logout').post(authenticationController.logout);

userAuthenticationRoute
  .route('/signup')
  .post(
    validatorRequirement.patientsValidator,
    validationResult,
    userAuthenticationController.signup
  );
userAuthenticationRoute
  .route('/login')
  .post(
    validatorRequirement.loginDetails,
    validationResult,
    userAuthenticationController.login
  );
module.exports = userAuthenticationRoute;
