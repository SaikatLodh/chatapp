const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
const ApiError = require("../config/apiError");

const verifySocketJwt = async (err, socket, next) => {
  try {
    if (err) return next(err);
    const authToken = socket.request.cookies[accessToken];
    if (!authToken) {
      return next(new ApiError("Unauthorized", 401));
    }
    const decode = jwt.verify(authToken, process.env.ACCESS_SECRET_TOKEN);
    if (!decode) {
      return next(new ApiError("Invalid token", 401));
    }
    const user = await User.findById(decode.id).select("-password");
    if (!user) {
      return next(new ApiError("User not found", 404));
    }
    socket.user = user;
    next();
  } catch (error) {
    next(new ApiError(error.message, 500));
  }
};

module.exports = { verifySocketJwt };
