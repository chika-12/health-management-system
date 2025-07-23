const express = require('express');
const booking = express.Router();
const userAuthentication = require('../controllers/userAuthentication');
const generalAuthentication = require('../controllers/authentication');
const bookingController = require('../controllers/bookingSystem');
const doctorsAuthentication = require('../controllers/doctorsAuthControl');

booking
  .route('/confirm')
  .post(
    doctorsAuthentication.protect,
    generalAuthentication.restrictTo('doctor'),
    bookingController.comfirmBooking
  );
booking.use(userAuthentication.protect);
booking
  .route('/specialty')
  .get(
    generalAuthentication.restrictTo('patient'),
    bookingController.findSpecialiseDoctor
  );

booking
  .route('/book')
  .post(
    generalAuthentication.restrictTo('patient'),
    bookingController.bookDoctor
  );
module.exports = booking;
