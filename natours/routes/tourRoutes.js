const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('./../controllers/authenticationController');
// const reviewController = require('./../controllers/reviewController');
const reviewRouter = require('./reviewRoutes');
const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

router.route('/tour-stats').get(tourController.getTourStats);

router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  );

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAlltours);

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);
//tours-ditance?distance=322&center=34,32&unit-mi
//tours-distance/233/center/-30,39/unit/mi'


router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances)

router
  .route('/')
  .get(tourController.getAlltours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
