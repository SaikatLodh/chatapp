const express = require("express");
const authController = require("../controller/auth/authController");
const {
  validate,
  sendOtp,
  verifyOtp,
  register,
  login,
  forgotSendEmail,
  forgotResetPassword,
  googleSignup,
  googleSignin,
} = require("../helper/validator/authValidator");
const verifyJwt = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/sendOtp").post(sendOtp(), validate, authController.sendOtp);
router
  .route("/verifyOtp")
  .post(verifyOtp(), validate, authController.verifyOtp);
router.route("/register").post(register(), validate, authController.register);
router.route("/login").post(login(), validate, authController.login);
router.route("/logout").get(verifyJwt, authController.logout);
router
  .route("/forgotSendEmail")
  .post(forgotSendEmail(), validate, authController.forgotsendemail);
router
  .route("/forgotResetPassword/:token")
  .post(forgotResetPassword(), validate, authController.forgotrestpassword);
router
  .route("/googlesignup")
  .get(googleSignup(), validate, authController.googlesignup);
router
  .route("/googlesignin")
  .get(googleSignin(), validate, authController.googlesignin);
router.route("/refreshtoken").post(authController.refresToken);

module.exports = router;
