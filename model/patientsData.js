const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A patient must have a name'],
  },
  email: {
    type: String,
    required: [true, 'A patient must have an email'],
    unique: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: [true, 'A patient must have a phone number'],
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'A patient must have a date of birth'],
  },
  address: {
    type: String,
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String,
  },
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
  },
  medicalHistory: [
    {
      condition: String,
      diagnosedAt: Date,
      notes: String,
    },
  ],
  allergies: [String],
  medications: [
    {
      name: String,
      dosage: String,
      frequency: String,
    },
  ],
  assignedDoctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const patientData = mongoose.model('patientData', patientSchema);
module.exports = patientData;
