const { body, param, validationResult } = require("express-validator");
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
const creategroupchatvalidator = () => [
  body("name").notEmpty().withMessage("Name is required").trim(),
  body("members")
    .isArray()
    .withMessage("Members must be an array")
    .isLength({ min: 2 })
    .withMessage("Members must have at least 2 members")
    .trim(),
];

const addmembersvalidator = () => [
  body("chatId").notEmpty().withMessage("ChatId is required").trim(),
  body("members")
    .isArray()
    .withMessage("Members must be an array")
    .isLength({ min: 1 })
    .withMessage("Members must have at least 1 member")
    .trim(),
];

const removemembersvalidator = () => [
  body("chatId").notEmpty().withMessage("ChatId is required").trim(),
  body("members")
    .isArray()
    .withMessage("Members must be an array")
    .isLength({ min: 1 })
    .withMessage("Members must have at least 1 member")
    .trim(),
];

const leavegroupvalidator = () => [
  param("chatId").notEmpty().withMessage("ChatId is required").trim(),
];

const sendmessagevalidator = () => [param("chatId").notEmpty().trim()];

const getmessageValidator = () => [
  param("chatId").notEmpty().withMessage("ChatId is required").trim(),
];

const renamegroupvalidator = () => [
  param("chatId").notEmpty().withMessage("ChatId is required").trim(),
  body("name").notEmpty().withMessage("Name is required").trim(),
];

const deletegroupvalidator = () => [
  param("chatId").notEmpty().withMessage("ChatId is required").trim(),
];

module.exports = {
  validate,
  creategroupchatvalidator,
  addmembersvalidator,
  removemembersvalidator,
  leavegroupvalidator,
  sendmessagevalidator,
  getmessageValidator,
  renamegroupvalidator,
  deletegroupvalidator,
};
