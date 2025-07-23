const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
  password: {
    type: String,
    required: [true, 'password required'],
    minlength: 8,
    maxlength: 50,
    select: false,
  },
  role: {
    type: String,
    enum: ['patient', 'admin', 'doctor'],
    default: 'doctor',
  },
  languageSpoken: {
    type: [String],
    default: ['English'],
  },
  passwordConfirm: {
    type: String,
    rquired: [true, 'confirm your password'],
    validate: {
      validator: function (value) {
        return this.password === value;
      },
      message: 'Password do not match',
    },
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
  photo: String,
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
  active: {
    type: Boolean,
    default: true,
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

doctorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next;
  }
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
doctorSchema.methods.correctPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
doctorSchema.pre(/^find/, function (next) {
  if (!this.getOptions || !this.getOptions().bypassFilter) {
    this.find({ active: { $ne: false } });
  }
  next();
});

doctorSchema.methods.changedPassword = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changeTime = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    console.log(this.passwordChangedAt, JWTTimestamp);
    return JWTTimestamp < changeTime;
  }
  return false;
};

doctorSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});
const DoctorData = mongoose.model('DoctorData', doctorSchema);
module.exports = DoctorData;
