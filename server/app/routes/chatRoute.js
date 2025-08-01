const chatController = require("../controller/chat/chatController");
const verifyJwt = require("../middleware/authMiddleware");
const {
  validate,
  creategroupchatvalidator,
  addmembersvalidator,
  removemembersvalidator,
  leavegroupvalidator,
  sendmessagevalidator,
  getmessageValidator,
  renamegroupvalidator,
  deletegroupvalidator,
} = require("../helper/validator/chatValidator");
const upload = require("../middleware/multer");
const checkPermission = require("../middleware/checkPermissionMiddleware");
const router = require("express").Router();

router
  .route("/creategroupchat")
  .post(
    verifyJwt,
    checkPermission("user"),
    creategroupchatvalidator(),
    validate,
    chatController.creategroupchat
  );
router
  .route("/getmychatlist")
  .get(verifyJwt, checkPermission("user"), chatController.getmychatlist);
router
  .route("/getmygroups")
  .get(verifyJwt, checkPermission("user"), chatController.getmygroups);
router
  .route("/addmembers")
  .patch(
    verifyJwt,
    checkPermission("user"),
    addmembersvalidator(),
    checkPermission("user"),
    validate,
    chatController.addmembers
  );
router
  .route("/removemembers")
  .patch(
    verifyJwt,
    checkPermission("user"),
    removemembersvalidator(),
    validate,
    chatController.removemembers
  );
router
  .route("/renamegroup/:chatId")
  .patch(
    verifyJwt,
    checkPermission("user"),
    renamegroupvalidator(),
    validate,
    chatController.renamegroup
  );
router
  .route("/leavegroup/:chatId")
  .get(
    verifyJwt,
    checkPermission("user"),
    leavegroupvalidator(),
    validate,
    chatController.leavegroup
  );
router
  .route("/sendmessage/:chatId")
  .post(
    verifyJwt,
    checkPermission("user"),
    upload.fields([{ name: "attechment", maxCount: 5 }]),
    sendmessagevalidator(),
    validate,
    chatController.sendmessage
  );
router
  .route("/getmessages/:chatId")
  .get(
    verifyJwt,
    checkPermission("user"),
    getmessageValidator(),
    validate,
    chatController.getmessages
  );
router
  .route("/deleteChat/:chatId")
  .delete(
    verifyJwt,
    checkPermission("user"),
    deletegroupvalidator(),
    validate,
    chatController.deleteChat
  );

module.exports = router;
