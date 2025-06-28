const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  reservation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation',
  },
  diagnosis: {
    type: String,
    required: [true, 'Please provide a diagnosis'],
  },
  notes: {
    type: String,
    maxlength: 1000,
  },

  // 🔥 New additions:
  vitals: {
    temperature: Number,
    bloodPressure: String, // e.g. '120/80'
    heartRate: Number,
    respiratoryRate: Number,
    oxygenSaturation: Number,
  },

  prescriptions: [
    {
      medication: String,
      dosage: String,
      frequency: String,
      duration: String,
    },
  ],

  labTests: [String], // e.g., ['X-ray', 'Blood Test']

  followUpDate: Date,

  // 💉 Surgery
  surgeryRequired: {
    type: Boolean,
    default: false,
  },
  surgeryDetails: {
    type: String,
  },
  surgeryDate: Date,
  surgeryBooked: {
    type: Boolean,
    default: false,
  },

  // 🔁 Referral
  referred: {
    type: Boolean,
    default: false,
  },
  referredTo: {
    type: String, // could be another specialization, hospital, or doctor name
  },

  // 📅 Date info
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Consultation = mongoose.model('Consultation', consultationSchema);
module.exports = Consultation;
