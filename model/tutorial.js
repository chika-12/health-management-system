const mongoose = require('mongoose');

const tutorialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Tutorial must have a title'],
  },
  description: String,
  videoUrl: {
    type: String,
    required: [true, 'Tutorial must have a video'],
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DoctorData',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  tags: [String],
});

const Tutorial = mongoose.model('Tutorial', tutorialSchema);
module.exports = Tutorial;
