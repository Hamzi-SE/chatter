const express = require("express");
const { getAllUsers, registerUser, updateProfile, deleteUser, getSingleUser, loginUser, logout, forgotPassword, resetPassword, getMyDetails, updatePassword, addFriend } = require("../controllers/userContoller");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/users").get(getAllUsers);
router.route("/user/register").post(registerUser);
router.route("/user/login").post(loginUser);
router.route("/me").get(isAuthenticatedUser, getMyDetails);
router.route("/me/update").put(isAuthenticatedUser, updateProfile);
router.route("/user/logout").get(logout);
router.route("/user/:id").get(getSingleUser);
router.route("/user/delete/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/user/addFriend").put(isAuthenticatedUser, addFriend);

module.exports = router;