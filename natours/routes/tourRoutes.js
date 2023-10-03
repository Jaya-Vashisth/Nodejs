const express = require('express');
const tourConroller = require('../controllers/tourController');
const authController = require('./../controllers/authenticationController');
// const reviewController = require('./../controllers/reviewController');
const reviewRouter = require('./reviewRoutes');
const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

router.route('/tour-stats').get(tourConroller.getTourStats);

router.route('/monthly-plan/:year').get(tourConroller.getMonthlyPlan);

router
  .route('/top-5-cheap')
  .get(tourConroller.aliasTopTours, tourConroller.getAlltours);

router
  .route('/')
  .get(authController.protect, tourConroller.getAlltours)
  .post(tourConroller.createTour);

router
  .route('/:id')
  .get(tourConroller.getTour)
  .patch(tourConroller.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourConroller.deleteTour
  );

// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview
//   );
module.exports = router;
