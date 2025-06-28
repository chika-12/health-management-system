const express = require('express');
const userAuthenticationRoute = express.Router();
const authenticationController = require('../controllers/authentication');

userAuthenticationRoute.route('/signup').post(authenticationController.signUp);
userAuthenticationRoute.route('/login').post(authenticationController.login);
userAuthenticationRoute.route('/logout').post(authenticationController.logout);
module.exports = userAuthenticationRoute;
