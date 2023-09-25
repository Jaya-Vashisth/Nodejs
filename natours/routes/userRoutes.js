const express = require('express');
const router = express.Router();
const userController = require('./../controllers/userConstroller');
const authController = require('./../controllers/authenticationController');

///////////////////////// Routes /////////////////////////////////

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgetPassword', authController.forgotPaswword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch(
  '/updatePassword',
  authController.protect,
  authController.updatePassword
);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUsers);

router
  .route('/:id')
  .get(userController.getUsers)
  .patch(userController.updateUsers)
  .delete(userController.deleteUsers);

module.exports = router;
