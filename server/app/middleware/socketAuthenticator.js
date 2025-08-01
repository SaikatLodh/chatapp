const jwt = require("jsonwebtoken");
const ApiError = require("../config/apiError");
const User = require("../model/userModel");

const socketAuthenticator = async (err, socket, next) => {
  try {
    if (err) return next(err);

    const cookieString = socket.handshake.headers.cookie;

    const token = cookieString
      .split(";")
      .find((str) => str.trim().startsWith("accessToken="))
      ?.split("=")[1];

    if (!token) {
      return next(new ApiError("Unauthorized", 401));
    }

    const decode = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);

    if (!decode) {
      return next(new ApiError("Invalid token", 401));
    }

    const user = await User.findById(decode.id).select(
      "-password -resetPasswordExpire -resetPasswordToken"
    );

    if (!user) {
      return next(new ApiError("User not found", 404));
    }

    socket.user = user;

    next();
  } catch (error) {
    return next(new ApiError("Unauthorized", 401));
  }
};

module.exports = { socketAuthenticator };
