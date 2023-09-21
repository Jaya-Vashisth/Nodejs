const express = require('express');
const morgan = require('morgan');
const app = express();

const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');

//1. Middle ware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());

//for static files
app.use(express.static(`${__dirname}/public`));

// app.use((req, res, next) => {
//   console.log('hello from the middleware');
//   next();
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3). ROUTES

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);

//unspecified url handler
app.all('*', (req, res, next) => {
  next(new AppError(`Cann't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
