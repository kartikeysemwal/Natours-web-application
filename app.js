const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes.js');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.enable('trust proxy'); //Heroku works by sending proxy this is for heroku

app.set('view engine', 'pug'); //This is to set the template engine to pub
app.set('views', path.join(__dirname, 'views'));

// Global Middleware

//Serving static files
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));

//Set security HTTP headers
app.use(helmet());

//Developnent logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Rate limiter
const limiter = rateLimiter({
  max: 100,
  windowMs: 60 * 60 * 100,
  message: 'Too many request from this id. Please try again in one hour',
});

app.use('/api', limiter);

//Body parser, reading body from body to req.body
app.use(express.json({ limit: '10kb' })); //Middleware for the request in the post
app.use(express.urlencoded({ extended: true, limit: '10kb' })); //Body parser for the rendered website
app.use(cookieParser()); //Parses the data from the cookie in the browser

//Data sanitization before no sql injection
app.use(mongoSanitize());

//Data sanitization against xss
app.use(xss());

//Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

app.use(compression());

//Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//Routes

//Render website routes
app.use('/', viewRouter);

//API routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find the ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
