const express = require('express');
const path = require('path');
const app = express();
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookiePaser = require('cookie-parser');
const errorController = require('./controllers/errorController');
const AppError = require('./utilities/appError');
const userControllers = require('./routes/getingUsersInfo');
const userAuthenticationRoute = require('./routes/userAuthentication');
const cookieParser = require('cookie-parser');
const tutorialRoute = require('./routes/tutorialRoute');

app.use(helmet());
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());
app.use(xss());

const limiter = rateLimit({
  max: 100,
  windowsMs: 60 * 60 * 1000,
  message: 'Too many request from this IP. Try again in an hour',
});
app.use('/api', limiter);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
app.use(cookieParser()); //Checks for cookie

app.use('/api/auth', userAuthenticationRoute);
app.use('/api/v1/users', userControllers);
app.use('/api/v1/tutorial', tutorialRoute);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorController);
module.exports = app;
