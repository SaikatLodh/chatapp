const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
const ApiError = require("../config/apiError");

const verifyJwt = async (req, res, next) => {
  try {
    const token =
      req?.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "") ||
      req.headers["x-access-token"];

    if (!token) {
      return res.status(401).json(new ApiError("Unauthorized", 401));
    }

    const decode = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);

    if (!decode) {
      return res.status(401).json(new ApiError("Invalid token", 401));
    }

    const user = await User.findById(decode.id).select(
      "-password -resetPasswordExpire -resetPasswordToken"
    );

    if (!user) {
      return res.status(404).json(new ApiError("User not found", 404));
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json(new ApiError(error.message, 500));
  }
};

module.exports = verifyJwt;
