const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authenticationController');
const express = require('express');

const router = express.Router({ mergeParams: true });

// POST /tour/453532/reviews
// POST /tour/reviews/
router
  .route('/')
  .get(reviewController.getAllReview)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  );

//delete review handler
router.route('/:id').delete(reviewController.deleteReview);

module.exports = router;
