const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
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
const Consultation = mongoose.model('Consultation', reservationSchema);
module.exports = Consultation;
