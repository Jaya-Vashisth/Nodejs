const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authenticationController');
const express = require('express');

const router = express.Router({ mergeParams: true });

//Protect all routes
router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReview)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

//delete review handler
router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  )
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  );

module.exports = router;
