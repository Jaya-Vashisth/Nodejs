const express = require('express');
const tourConroller = require('../controllers/tourController');

const router = express.Router();

//middlerware to check id is present or not
router.param('id', tourConroller.checkID);

router
  .route('/')
  .get(tourConroller.getAlltours)
  .post(tourConroller.checkbody, tourConroller.createTour);

router
  .route('/:id')
  .get(tourConroller.getTour)
  .patch(tourConroller.updateTour)
  .delete(tourConroller.deleteTour);

module.exports = router;
