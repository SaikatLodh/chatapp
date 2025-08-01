const { body, param, validationResult, query } = require("express-validator");
const ApiError = require("../../config/apiError");

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Convert errors array to an object: { field: message }
    const errorObject = {};
    errors.array().forEach((err) => {
      errorObject[err.path] = err.msg;
    });
    return res.status(400).json(new ApiError(errorObject, 400));
  }
  next();
};

const sendOtp = () => [
  body("email")
    .notEmpty()
    .withMessage("Please provide email.")
    .isEmail()
    .withMessage("Please provide valid email.")
    .trim(),
];

const verifyOtp = () => [
  body("email")
    .notEmpty()
    .withMessage("Please provide email.")
    .isEmail()
    .withMessage("Please provide valid email.")
    .trim(),
  body("otp")
    .notEmpty()
    .withMessage("Please provide OTP")
    .isNumeric()
    .withMessage("Please provide valid otp.")
    .trim(),
];

const register = () => [
  body("name")
    .notEmpty()
    .withMessage("Please provide name.")
    .isString()
    .withMessage("Please provide as a string.")
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be between 3 and 50 characters long.")
    .trim(),
  body("email")
    .notEmpty()
    .withMessage("Please provide email.")
    .isEmail()
    .withMessage("Please provide valid email.")
    .trim(),
  body("username")
    .notEmpty()
    .withMessage("Please provide username.")
    .isString()
    .withMessage("Please provide as a string.")
    .isLength({ min: 3, max: 50 })
    .withMessage("Username must be between 3 and 50 characters long.")
    .trim(),
  body("password")
    .notEmpty()
    .withMessage("Please provide password.")
    .isString() // Removed isLength() here
    .withMessage("Please provide as a string.")
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must be between 6 and 20 characters long.")
    .trim(),
];

const login = () => [
  body("email")
    .notEmpty()
    .withMessage("Please provide email.")
    .isEmail()
    .withMessage("Please provide valid email.")
    .trim(),
  body("password")
    .notEmpty()
    .withMessage("Please provide password.")
    .isString() // Removed isLength() here
    .withMessage("Please provide as a string.")
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must be between 6 and 20 characters long.")
    .trim(),
];

const forgotSendEmail = () => [
  body("email")
    .notEmpty()
    .withMessage("Please provide email.")
    .isEmail()
    .withMessage("Please provide valid email.")
    .trim(),
];

const forgotResetPassword = () => [
  param("token").notEmpty().withMessage("Token is required").trim(),
];

const googleSignup = () => [
  query("code").notEmpty().withMessage("Code is required").trim(),
];

const googleSignin = () => [
  query("code").notEmpty().withMessage("Code is required").trim(),
];

module.exports = {
  validate,
  sendOtp,
  verifyOtp,
  register,
  login,
  forgotSendEmail,
  forgotResetPassword,
  googleSignup,
  googleSignin,
};
