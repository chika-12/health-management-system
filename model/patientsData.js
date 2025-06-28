const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

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
  password: {
    type: String,
    required: [true, 'password required'],
    minlength: [8, 'paasword should not be lass than 8 characters'],
    maxlength: [50, 'password should not be more 50 characters'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'confirm your password'],
    validate: {
      validator: function (value) {
        return this.password === value;
      },
      message: 'password do not matchs',
    },
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
  active: {
    type: Boolean,
    default: true,
  },
  passwordChangedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

patientSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

patientSchema.methods.correctPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

patientSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

patientSchema.methods.changedPassword = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changeTime = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    console.log(this.passwordChangedAt, JWTTimestamp);
    return JWTTimestamp < changeTime;
  }
  return false;
};

patientSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

const PatientData = mongoose.model('PatientData', patientSchema);
module.exports = PatientData;
