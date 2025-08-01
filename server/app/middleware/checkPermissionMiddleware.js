const ApiError = require("../config/apiError");

const checkPermission = (userRole) => {
  return (req, res, next) => {
    const role = req.user.role;

    if (!req.user || !role) {
      return res.status(403).json(new ApiError(" Role not found", 403));
    }

    if (userRole.includes(role)) {
      next();
    } else {
      return res
        .status(403)
        .json(new ApiError("You are not authorized for this action", 403));
    }
  };
};
module.exports = checkPermission;
