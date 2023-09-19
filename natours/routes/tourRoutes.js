const express = require('express');
const tourConroller = require('../controllers/tourController');

const router = express.Router();

//middlerware to check id is present or not
// router.param('id', tourConroller.checkID);

router
  .route('/top-5-cheap')
  .get(tourConroller.aliasTopTours, tourConroller.getAlltours);

router.route('/').get(tourConroller.getAlltours).post(tourConroller.createTour);

router
  .route('/:id')
  .get(tourConroller.getTour)
  .patch(tourConroller.updateTour)
  .delete(tourConroller.deleteTour);

module.exports = router;
