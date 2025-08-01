const adminContrller = require("../controller/admin/adminController.js");
const express = require("express");
const verifyJwt = require("../middleware/authMiddleware.js");
const checkPermission = require("../middleware/checkPermissionMiddleware.js");
const router = express.Router();

router
  .route("/getdashboardstats")
  .get(verifyJwt, checkPermission("admin"), adminContrller.getdashboardstats);
router
  .route("/getallusers")
  .get(verifyJwt, checkPermission("admin"), adminContrller.getallusers);
router
  .route("/getallchats")
  .get(verifyJwt, checkPermission("admin"), adminContrller.getallchats);
router
  .route("/getallmessages")
  .get(verifyJwt, checkPermission("admin"), adminContrller.getallmessages);

module.exports = router;
