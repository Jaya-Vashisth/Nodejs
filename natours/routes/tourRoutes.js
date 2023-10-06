const express = require('express');
const tourConroller = require('../controllers/tourController');
const authController = require('./../controllers/authenticationController');
// const reviewController = require('./../controllers/reviewController');
const reviewRouter = require('./reviewRoutes');
const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

router.route('/tour-stats').get(tourConroller.getTourStats);

router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourConroller.getMonthlyPlan
  );

router
  .route('/top-5-cheap')
  .get(tourConroller.aliasTopTours, tourConroller.getAlltours);

router
  .route('/')
  .get(tourConroller.getAlltours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourConroller.createTour
  );

router
  .route('/:id')
  .get(tourConroller.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourConroller.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourConroller.deleteTour
  );

module.exports = router;
