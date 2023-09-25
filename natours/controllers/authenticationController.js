const { promisify } = require('util');
const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');
// const { getUsers } = require('./userConstroller');
const sendEmail = require('./../utils/email');
const crypto = require('crypto');

//token for the user that logged in
const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

//signup new user
exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      role: req.body.role,
    });

    createSendToken(newUser, 201, res);
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

//user login authentication
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  //1) check if email and password exist
  if (!email || !password)
    return next(new AppError('please provide email and password!', 400));

  //2) check if user exist
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  //3) if everything ok ,send token to client
  createSendToken(user, 200, res);
};

//Protecting routes by authenticating user login token

exports.protect = async (req, res, next) => {
  let token;
  //1) Getting token and check if it's there
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not looged in! Please log in to get access', 401)
    );
  }

  //2)Verify token
  try {
    const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //3) Check if user still exists
    const currentuser = await User.findById(decode.id);

    if (!currentuser) {
      return next(new AppError("The User Don't Exist", 401));
    }

    //4) Check if user changed password after the token was issued
    if (currentuser.changedPasswordAfter(decode.iat)) {
      return next(
        new AppError('User recently changed password! please log in again', 401)
      );
    }

    //access grandted
    req.user = currentuser;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError')
      return next(new AppError('Invalid Token. Please log in again!', 401));
    else if (err.name === 'TokenExpiredError')
      return next(
        new AppError('Your Token has Expired! please login again.', 401)
      );
  }

  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //roles is an array
    if (!roles.includes(req.user.roles)) {
      return next(
        new AppError('you don not have permission to perform this action', 403)
      );
    }
    next();
  };
};

exports.forgotPaswword = async (req, res, next) => {
  //1)get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }

  //2)Generate the random reset Token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //3 send it to user mail
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? submit a patch request with your new password and passwordConfirm to : ${resetURL}.\n if you did not forget your password , please ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 minutes)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email.Try again later!'),
      500
    );
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    //1)get user based on the token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    console.log(hashedToken);

    console.log('\n', req.params.token);
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    //2)if token has not expired an there is user, set the new password
    if (!user) {
      return next(new AppError('Token is invalid or has expired', 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    //3) Update changePaswwordAt property for the user

    //4)Log the user in , send JWT
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

//update the password when user is already logged in
exports.updatePassword = async (req, res, next) => {
  //1) get user from the collection
  const user = await user.findById(req.user.id).select('+password');

  //2) check if password enter by user is correct or not
  if (!user.correctPassword(req.body.currentPassword, user.password)) {
    return next(new AppError('Your current password is wrong'), 401);
  }

  //3) update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  //4) log the user again
  createSendToken(user, 200, res);
};
