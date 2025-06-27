const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A doctor must have a name'],
  },
  email: {
    type: String,
    required: [true, 'A doctor must have an email'],
    unique: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: [true, 'A doctor must have a phone number'],
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true,
  },
  specialization: {
    type: String,
    required: [true, 'A doctor must have a specialization'],
    enum: [
      'general',
      'cardiologist',
      'dermatologist',
      'pediatrician',
      'neurologist',
      'psychiatrist',
      'gynecologist',
      'orthopedic',
      'dentist',
      'other',
    ],
  },
  licenseNumber: {
    type: String,
    required: [true, 'A doctor must have a license number'],
    unique: true,
  },
  yearsOfExperience: {
    type: Number,
    min: 0,
  },
  bio: {
    type: String,
    maxlength: 500,
  },
  availability: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const DoctorData = mongoose.model('DoctorData', doctorSchema);
module.exports = DoctorData;
