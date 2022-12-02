const express = require("express");
const userController = require("../controllers/usersController");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");

// applying verifyJWT middleware to all the routes in this file.
router.use(verifyJWT);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createNewUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
