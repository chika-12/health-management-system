const PatientData = require('../model/patientsData');
const catchAsync = require('../utilities/catchAsync');
const AppError = require('../utilities/appError');
const jwt = require('jsonwebtoken');
const { token } = require('morgan');

const signToken = (id, user, statusCode, res) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    secure: true,
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const user = await PatientData.create(req.body);
  if (!user) {
    return next(new AppError('patient not registered', 400));
  }
  signToken(user.id, user, 200, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Invalid email or password', 400));
  }
  const user = await PatientData.findOne({ email: email }).select('+password');
  if (!user || !(await user.correctPassword(password))) {
    return next(new AppError('Invalid email or password', 400));
  }
  signToken(user.id, user, 200, res);
});
exports.logout = catchAsync(async (req, res, next) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });
  //req.headers.authorization.Bearer = null;
  res.status(200).json({
    status: 'success',
    messege: 'user logged out',
  });
});
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(new AppError('You are not logged in', 401));
  }
});
