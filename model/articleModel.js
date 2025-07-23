// models/Article.js

const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'An article must have a title'],
      trim: true,
    },
    body: {
      type: String,
      required: [true, 'An article must have content'],
    },
    images: [
      {
        type: String, // Store image URLs from Cloudinary
      },
    ],
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DoctorData',
      required: [true, 'Article must be linked to a doctor'],
    },
    tags: [String],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
articleSchema.pre(/^find/, function (next) {
  this.populate({ path: 'postedBy', select: 'name specialization' });
  next();
});

const Article = mongoose.model('Article', articleSchema);
module.exports = Article;
