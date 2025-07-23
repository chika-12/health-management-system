const express = require('express');
const retriveReservation = express.Router();
const doctorsAuthControl = require('../controllers/doctorsAuthControl');
const patientAuth = require('../controllers/userAuthentication');
const generalAuthentication = require('../controllers/authentication');
const reservation = require('../controllers/routeConnectsHereForReservationRetrival');
const adminRetrival = require('../controllers/reservationRetrivalSystem');

retriveReservation
  .route('/user/retrive')
  .get(patientAuth.protect, reservation.patirntsReserv);
retriveReservation
  .route('/doctors/retrive')
  .get(doctorsAuthControl.protect, reservation.doctorsReserv);

retriveReservation
  .route('/admin')
  .get(
    patientAuth.protect,
    generalAuthentication.restrictTo('admin'),
    adminRetrival.adminRetrival
  );
module.exports = retriveReservation;
