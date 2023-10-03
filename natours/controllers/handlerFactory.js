const catchAsync = require('../utils/catchAsync');
const appError = require('./../utils/appError');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new appError('No document found with this ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: null,
    });
  });
