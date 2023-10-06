const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel')
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      minlength: [8, 'A tour name must have greater or equeal to 10 character'],
      maxlength: [
        40,
        'A tour name must have less thant or equal to 40 characters',
      ],
    },

    // slug: String,

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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either : easy , midium , difficult',
      },
    },

    ratingsAverage: {
      type: Number,
      default: 4.3,
      min: [1, 'Rating must be atleast 1.0'],
      max: [5, 'Rating can atmost be 1'],
    },
    ratingsQuantity: {
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

    secretTour: {
      type: Boolean,
      default: false,
    },

    startLocation: {
      //GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },

      coordinates: [Number],
      address: String,
      description: String,
    },

    locations: [
      {
        type: {
          type: String,
          dafault: 'Point',
          enum: ['Point'],
        },

        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],

    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });

//virtual property that cannot be accessed by urls
tourSchema.virtual('durationInWeeks').get(function () {
  return this.duration / 7;
});

//virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

//return tour that have secretTour not equal to true
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

//populate the guides field with actual data
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});

//embedding guides

//  tourSchema.pre('save', async function(next){
//   const guidesPromises = this.guides.map(async id => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
//  }
//  );

//1 .DOCUMENT MIDDLWARE:

//runs before .save() and .create()
// tourSchema.pre('save', function (next) {
//   // this.slug = slugify(this.name, { lower: true });

//   console.log('execute before saving the document')
//   next();
// });

//run just after saving the document  .save() .create()
// tourSchema.post('save', function(doc, next){
//    console.log(doc);
//    next();
// })

//2.QUERY MIDDLEWARE

// tourSchema.post('/^find/',function(next){
//   console.log(`query took ${Date.now()-this.start} milliseconds`);
//   console.log(doc);  //return document after query executed
// })

//3. AGGREGATION MIDDLEWARE

const Tour = mongoose.model('TOURS', tourSchema);

module.exports = Tour;
