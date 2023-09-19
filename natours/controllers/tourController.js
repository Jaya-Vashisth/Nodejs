// const fs = require('fs');
const Tour = require('./../models/tourModel');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1A)Filteriting
    const querobj = { ...this.querystring };
    const excludefileds = ['page', 'sort', 'limit', 'fields'];
    excludefileds.forEach((el) => delete querobj[el]);

    //1B) Advanse filtering
    let queryStr = JSON.stringify(querobj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortby = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortby);
      //sort('price ratingsAverage')
    }

    return this;
  }

  limitfields() {
    if (this.querystring.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  //4) Pagination
  paginate() {
    const page = this.querystring.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

exports.getAlltours = async (req, res) => {
  try {
    //BUILD QUERY
    // const querobj = { ...req.query };

    // // 1A)Filteriting
    // const excludefileds = ['page', 'sort', 'limit', 'fields'];
    // excludefileds.forEach((el) => delete querobj[el]);

    // //1B) Advanse filtering

    // //{difficulty:'easy', duration:{$gte:5}}
    // // we get {difficulty:'easy', duration:{gte:5}
    // let queryStr = JSON.stringify(querobj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // let query = Tour.find(JSON.parse(queryStr));

    // 2) Sorting
    // if (req.query.sort) {
    //   const sortby = req.query.sort.split(',').join(' ');
    //   query = query.sort(sortby);
    //   //sort('price ratingsAverage')
    // }

    //3) Field filtering
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields);
    // } else {
    //   query = query.select('-__v');
    // }

    // //4) Pagination
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;
    // query = query.skip(skip).limit(limit);

    // if (req.query.page) {
    //   const numtour = await Tour.countDocuments();
    //   if (skip >= numtour) throw new Error('This page does not exist');
    // }

    // //EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitfields()
      .paginate();

    const Tours = await features.query;

    //send RESPONSE
    res.status(200).json({
      status: 'success',
      result: Tours.length,
      data: {
        Tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

//get the tour for specified id
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.param.id);

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'success',
      message: err,
    });
  }
};

//creating a new tour
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }

  //   }
  // );
};

//update the existing tour

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};

//delete the tour
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};
