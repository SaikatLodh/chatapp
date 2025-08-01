const express = require("express");
const userController = require("../controller/user/userController.js");
const {
  validate,
  updateuser,
  changepassword,
  sendfriendrequest,
  acceptfriendrequest,
} = require("../helper/validator/userValidator.js");
const verifyJwt = require("../middleware/authMiddleware.js");
const upload = require("../middleware/multer.js");
const checkPermission = require("../middleware/checkPermissionMiddleware.js");

const router = express.Router();

router.route("/getuser").get(verifyJwt, userController.getuser);
router
  .route("/updateuser")
  .patch(
    verifyJwt,
    upload.single("profilePic"),
    updateuser(),
    validate,
    userController.updateuser
  );

router.route("/changepassword").patch(
  verifyJwt,

  changepassword(),
  validate,
  userController.changepassword
);

router
  .route("/searchuser")
  .get(verifyJwt, checkPermission("user"), userController.searchuser);

router
  .route("/sendfriendrequest/:receiverId")
  .get(
    verifyJwt,
    checkPermission("user"),
    sendfriendrequest(),
    validate,
    userController.sendfriendrequest
  );
router
  .route("/acceptfriendrequest")
  .post(
    verifyJwt,
    checkPermission("user"),
    acceptfriendrequest(),
    validate,
    userController.acceptfriendrequest
  );

router
  .route("/getmyfrieendrequest")
  .get(verifyJwt, checkPermission("user"), userController.getmyfrieendrequest);

router
  .route("/getmyfriends")
  .get(verifyJwt, checkPermission("user"), userController.getmyfriends);

router
  .route("/removefriend/:friendId")
  .get(verifyJwt, checkPermission("user"), userController.removefriend);

module.exports = router;
