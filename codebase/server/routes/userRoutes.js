const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetpassword,
  getUserDetails,
  updatePassword,
  updateUserProfile,
  getAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { getProductReviews } = require("../controllers/productController");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetpassword);
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticatedUser, getUserDetails);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/me/update").put(isAuthenticatedUser, updateUserProfile);

//admin
router.route("/admin/users").get(getAllUsers, authorizeRoles("admin"));
router
  .route("/admin/user/:id")
  .get(getSingleUser, authorizeRoles("admin"))
  .put(updateUserRole, authorizeRoles("admin"))
  .delete(deleteUser, authorizeRoles("admin"));

  router.route("/reviews").get(getProductReviews)

module.exports = router;
