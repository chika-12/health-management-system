const express = require('express');
const booking = express.Router();
const userAuthentication = require('../controllers/userAuthentication');
const generalAuthentication = require('../controllers/authentication');
const bookingController = require('../controllers/bookingSystem');
booking.use(userAuthentication.protect);
booking.route('/specialty').get(bookingController.findSpecialiseDoctor);
booking.route('/book').post(bookingController.bookDoctor);
module.exports = booking;
