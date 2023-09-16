const express = require('express');
const router = express.Router();
const userController = require('../controllers/userConstroller');

///////////////////////// Routes /////////////////////////////////

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
