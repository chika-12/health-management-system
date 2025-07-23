// models/doctorAvailability.js
const mongoose = require('mongoose');

const doctorAvailabilitySchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DoctorData',
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  consultationDuration: {
    type: Number,
    required: true,
    min: [45, 'Consultation must be at least 45 minutes'],
  },
  availableSlots: [String],
});
doctorAvailabilitySchema.pre(/^find/, function (next) {
  this.populate({ path: 'doctor', select: 'name, specialization' });
  next();
});
doctorAvailabilitySchema.methods.removeTimeSlot = function (value) {
  const index = this.availableSlots.indexOf(value);
  if (index !== -1) {
    this.availableSlots.splice(index, 1);
  }
};
doctorAvailabilitySchema.methods.checkAvailableTime = function (time) {
  return this.availableSlots.includes(time);
};
// doctorAvailabilitySchema.methods.checkAvailability = function (date) {
//   return this.date === date;
// };
doctorAvailabilitySchema.index({ doctor: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DoctorAvailability', doctorAvailabilitySchema);
