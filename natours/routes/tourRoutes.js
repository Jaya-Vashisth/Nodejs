const express = require('express');
const tourConroller = require('../controllers/tourController');
const authController = require('./../controllers/authenticationController');
const router = express.Router();

//middlerware to check id is present or not
// router.param('id', tourConroller.checkID);

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

module.exports = router;
