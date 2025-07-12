const AppError = require('../utilities/appError');
const catchAsync = require('../utilities/catchAsync');

exports.retriveAll = (model) =>
  catchAsync(async (req, res, next) => {
    const user = await model.find();
    if (!user) {
      return next(new AppError('No users found on this data base', 404));
    }
    res.status(200).json({
      status: 'success',
      message: 'all data retrived',
      data: {
        result: user.length,
        user,
      },
    });
  });

exports.profile = (model) =>
  catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const user = await model.findById(userId);
    if (!user) {
      return next(new AppError('user not found', 500));
    }
    res.status(200).json({
      status: 'success',
      message: 'user found',
      data: {
        user,
      },
    });
  });

exports.register = (model) =>
  catchAsync(async (req, res, next) => {
    const user = await model.create(req.body);
    if (!user) {
      return next(new AppError('Error', 500));
    }
    res.status(200).json({
      status: 'success',
      message: 'user created',
      data: {
        user,
      },
    });
  });
exports.retriveById = (model) =>
  catchAsync(async (req, res, next) => {
    const userId = req.params.id;
    const user = await model.findById(userId);
    if (!user) {
      return next(new AppError('No user found', 404));
    }
    res.status(200).json({
      status: 'success',
      message: 'user found',
      data: {
        user,
      },
    });
  });

exports.delete = (model) =>
  catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const user = await model.findById(userId);
    user.active = false;
    await user.save({ validateBeforeSave: false });
    res.status(204).json({
      status: 'success',
      message: 'user deleted',
      data: null,
    });
  });
exports.reactivate = (model) =>
  catchAsync(async (req, res, next) => {
    const userEmail = req.body.email;
    const user = await model
      .findOne({
        email: userEmail,
        active: false,
      })
      .setOptions({ bypassFilter: true });

    if (!user) {
      return next(
        new AppError('this user can not be found on this server', 404)
      );
    }
    user.active = true;
    user.restoredAt = Date.now();
    await user.save({ validateBeforeSave: false });
    res.status(200).json({
      status: 'success',
      message: 'user restored',
      data: {
        user,
      },
    });
  });
