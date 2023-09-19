const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have duration'],
  },

  price: {
    type: Number,
    required: [true, 'A tour must have Price'],
  },

  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have maxGroupSize'],
  },

  difficulty: {
    type: String,
    required: [true, 'A tour must have difficulty'],
  },

  ratingsAverage: {
    type: Number,
    default: 4.3,
  },
  ratingQuantity: {
    type: Number,
    default: 0,
  },

  priceDiscount: Number,

  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a description'],
  },

  description: {
    type: String,
    trim: true,
  },

  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image'],
  },

  images: [String],

  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },

  startDates: [Date],
});

const Tour = mongoose.model('TOURS', tourSchema);

module.exports = Tour;
