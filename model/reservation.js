const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PatientData',
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DoctorData',
    required: true,
  },
  date: {
    type: Date,
    required: [true, 'Please provide a date for the reservation'],
  },
  timeSlot: {
    type: String,
    required: [true, 'Please choose a time slot'],
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
  reasonForVisit: {
    type: String,
    maxlength: 300,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
reservationSchema.pre(/^find/, function (next) {
  this.populate({ path: 'doctor', select: 'name specilization' }).populate({
    path: 'patient',
    select: 'name',
  });
  next();
});
const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation;
