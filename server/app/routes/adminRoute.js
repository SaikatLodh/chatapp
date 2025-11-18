const adminContrller = require("../controller/admin/adminController.js");
const express = require("express");
const verifyJwt = require("../middleware/authMiddleware.js");
const checkPermission = require("../middleware/checkPermissionMiddleware.js");
const router = express.Router();

/**
 * @swagger
 * /api/v1/admin/getdashboardstats:
 *   get:
 *     summary: Get dashboard stats
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats
 */
router
  .route("/getdashboardstats")
  .get(verifyJwt, checkPermission("admin"), adminContrller.getdashboardstats);

/**
 * @swagger
 * /api/v1/admin/getallusers:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All users
 */
router
  .route("/getallusers")
  .get(verifyJwt, checkPermission("admin"), adminContrller.getallusers);

/**
 * @swagger
 * /api/v1/admin/getallchats:
 *   get:
 *     summary: Get all chats
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All chats
 */
router
  .route("/getallchats")
  .get(verifyJwt, checkPermission("admin"), adminContrller.getallchats);

/**
 * @swagger
 * /api/v1/admin/getallmessages:
 *   get:
 *     summary: Get all messages
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All messages
 */
router
  .route("/getallmessages")
  .get(verifyJwt, checkPermission("admin"), adminContrller.getallmessages);

module.exports = router;
