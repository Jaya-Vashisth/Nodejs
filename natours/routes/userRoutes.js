const express = require('express');
const router = express.Router();
const userController = require('./../controllers/userConstroller');
const authController = require('./../controllers/authenticationController');

///////////////////////// Routes /////////////////////////////////

router.patch('/updateMe', authController.protect, userController.updateMe);
router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgetPassword', authController.forgotPaswword);
router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);
router.delete('/deleteMe', authController.protect, userController.deleteMe);
router.patch('/resetPassword/:token', authController.resetPassword);

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
