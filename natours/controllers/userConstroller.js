const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = async (req, res) => {
  const allusers = await User.find({});

  res.status(200).json({
    status: 'success',
    results: allusers.length,
    data: {
      allusers,
    },
  });
};

//to be updated by user
exports.updateMe = catchAsync(async (req, res, next) => {
  //1) create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword',
        400
      )
    );

  //2)update the user document

  //filter out unwanted fileds
  const filterBody = filterObj(req.body, 'name', 'email');

  const updateduser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updateduser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
exports.getUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    maessage: ' This route is not yet defined',
  });
};

exports.createUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    maessage: ' This route is not yet defined',
  });
};

exports.updateUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    maessage: ' This route is not yet defined',
  });
};

// exports.deleteUsers = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     maessage: ' This route is not yet defined',
//   });
// };

exports.deleteUser = factory.deleteOne(User);
