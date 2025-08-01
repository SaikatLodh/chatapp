const { body, validationResult, param } = require("express-validator");
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
const updateuser = () => [
  body("name")
    .notEmpty()
    .withMessage("name is required")
    .isString()
    .withMessage("name must be a string")
    .isLength({ min: 3, max: 50 })
    .withMessage("name must be between 3 and 50 characters")
    .trim(),
  body("username")
    .notEmpty()
    .withMessage("username is required")
    .isString()
    .withMessage("username must be a string")
    .isLength({ min: 3, max: 50 })
    .withMessage("username must be between 3 and 50 characters")
    .trim(),
];

const changepassword = () => [
  body("oldPassword")
    .notEmpty()
    .withMessage("oldpassword is required")
    .isString()
    .withMessage("oldpassword must be a string")
    .isLength({ min: 6, max: 20 })
    .withMessage("oldpassword must be between 6 and 20 characters")
    .trim(),

  body("newPassword")
    .notEmpty()
    .withMessage("newpassword is required")
    .isString()
    .withMessage("newpassword must be a string")
    .isLength({ min: 6, max: 20 })
    .withMessage("newpassword must be between 6 and 20 characters")
    .trim(),

  body("confirmPassword")
    .notEmpty()
    .withMessage("confirmpassword is required")
    .isString()
    .withMessage("confirmpassword must be a string")
    .isLength({ min: 6, max: 20 })
    .withMessage("confirmpassword must be between 6 and 20 characters")
    .trim(),
];

const sendfriendrequest = () => [
  param("receiverId").notEmpty().withMessage("receiverId is required").trim(),
];

const acceptfriendrequest = () => [
  body("senderId")
    .notEmpty()
    .withMessage("senderId is required")
    .withMessage("requestId is required")
    .isString()
    .withMessage("requestId must be a string")
    .trim(),
  body("accept")
    .notEmpty()
    .withMessage("accept is required")
    .isBoolean()
    .withMessage("accept must be a boolean"),
];

module.exports = {
  validate,
  updateuser,
  changepassword,
  sendfriendrequest,
  acceptfriendrequest,
};
