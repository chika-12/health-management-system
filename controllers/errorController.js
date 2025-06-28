const AppError = require('../utilities/appError');

const production = (error, res) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    console.log(`🔥🔥🔥Error: ${error}`);
    res.status(500).json({
      status: 'error',
      message: 'something went wrong',
    });
  }
};
const development = (error, res) => {
  res.status(error.statusCode).json({
    status: error.status,
    error,
    message: error.message,
    stack: error.stack,
  });
  console.log('Error', error);
};
const errorController = (err, req, res, next) => {
  (err.statusCode = err.statusCode || 500),
    (err.status = err.status || 'error');
  console.log(`🔥🔥🔥Error: ${err}`);
  const error = { ...err };
  error.message = err.message;
  error.stack = err.stack;
  if (process.env.NODE_ENV === 'production') {
    production(error, res);
  }
  if (process.env.NODE_ENV === 'development') {
    development(error, res);
  }
};
module.exports = errorController;
