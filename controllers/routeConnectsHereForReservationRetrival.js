const reservation = require('./reservationRetrivalSystem');

exports.doctorsReserv = reservation.retriveReservation('doctor');
exports.patirntsReserv = reservation.retriveReservation('patient');
