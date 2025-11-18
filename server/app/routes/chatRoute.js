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

/**
 * @swagger
 * /api/v1/chat/creategroupchat:
 *   post:
 *     summary: Create group chat
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - members
 *             properties:
 *               name:
 *                 type: string
 *                 example: "My Group"
 *               members:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["userId1", "userId2"]
 *     responses:
 *       201:
 *         description: Group chat created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Chat created"
 *       400:
 *         description: Invalid member ID or validation error
 *       500:
 *         description: Internal server error
 */
router
  .route("/creategroupchat")
  .post(
    verifyJwt,
    checkPermission("user"),
    creategroupchatvalidator(),
    validate,
    chatController.creategroupchat
  );

/**
 * @swagger
 * /api/v1/chat/getmychatlist:
 *   get:
 *     summary: Get my chat list
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Chat list retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Chats fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     chats:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           groupChat:
 *                             type: boolean
 *                           members:
 *                             type: array
 *                             items:
 *                               type: string
 *                           avatar:
 *                             type: array
 *                             items:
 *                               type: object
 *                           MembersDetails:
 *                             type: array
 *                             items:
 *                               type: object
 *       500:
 *         description: Internal server error
 */
router
  .route("/getmychatlist")
  .get(verifyJwt, checkPermission("user"), chatController.getmychatlist);

/**
 * @swagger
 * /api/v1/chat/getmygroups:
 *   get:
 *     summary: Get my groups
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Groups list retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Chats fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     groups:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           groupChat:
 *                             type: boolean
 *                           avatar:
 *                             type: array
 *                             items:
 *                               type: string
 *                           members:
 *                             type: array
 *                             items:
 *                               type: object
 *       500:
 *         description: Internal server error
 */
router
  .route("/getmygroups")
  .get(verifyJwt, checkPermission("user"), chatController.getmygroups);

/**
 * @swagger
 * /api/v1/chat/addmembers:
 *   patch:
 *     summary: Add members to chat
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - chatId
 *               - members
 *             properties:
 *               chatId:
 *                 type: string
 *                 example: "chatId123"
 *               members:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["userId1", "userId2"]
 *     responses:
 *       200:
 *         description: Members added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Members added"
 *       400:
 *         description: Invalid ID, not a group chat, or not creator
 *       404:
 *         description: Chat not found
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /api/v1/chat/removemembers:
 *   patch:
 *     summary: Remove members from chat
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - chatId
 *               - members
 *             properties:
 *               chatId:
 *                 type: string
 *                 example: "chatId123"
 *               members:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["userId1"]
 *     responses:
 *       200:
 *         description: Members removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Members removed"
 *       400:
 *         description: Invalid ID, not a group chat, or not creator
 *       404:
 *         description: Chat not found
 *       500:
 *         description: Internal server error
 */
router
  .route("/removemembers")
  .patch(
    verifyJwt,
    checkPermission("user"),
    removemembersvalidator(),
    validate,
    chatController.removemembers
  );

/**
 * @swagger
 * /api/v1/chat/renamegroup/{chatId}:
 *   patch:
 *     summary: Rename group
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: chatId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "chatId123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "New Group Name"
 *     responses:
 *       200:
 *         description: Group renamed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Group name updated"
 *       400:
 *         description: Invalid chat ID or not a group chat
 *       404:
 *         description: Chat not found
 *       500:
 *         description: Internal server error
 */
router
  .route("/renamegroup/:chatId")
  .patch(
    verifyJwt,
    checkPermission("user"),
    renamegroupvalidator(),
    validate,
    chatController.renamegroup
  );

/**
 * @swagger
 * /api/v1/chat/leavegroup/{chatId}:
 *   get:
 *     summary: Leave group
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: chatId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "chatId123"
 *     responses:
 *       200:
 *         description: Left group successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Left group"
 *       400:
 *         description: Invalid chat ID or not a group chat
 *       404:
 *         description: Chat not found
 *       500:
 *         description: Internal server error
 */
router
  .route("/leavegroup/:chatId")
  .get(
    verifyJwt,
    checkPermission("user"),
    leavegroupvalidator(),
    validate,
    chatController.leavegroup
  );

/**
 * @swagger
 * /api/v1/chat/sendmessage/{chatId}:
 *   post:
 *     summary: Send message
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: chatId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "chatId123"
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Hello world"
 *               isGroup:
 *                 type: string
 *                 example: "true"
 *               attechment:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Message sent"
 *       400:
 *         description: Invalid chat ID, not friends, or validation error
 *       404:
 *         description: Chat not found
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /api/v1/chat/getmessages/{chatId}:
 *   get:
 *     summary: Get messages
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: chatId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "chatId123"
 *     responses:
 *       200:
 *         description: Messages retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Messages"
 *                 data:
 *                   type: object
 *                   properties:
 *                     messages:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           content:
 *                             type: string
 *                           attachments:
 *                             type: array
 *                             items:
 *                               type: object
 *                           sender:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                               name:
 *                                 type: string
 *                               avatar:
 *                                 type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *       400:
 *         description: Invalid chat ID
 *       404:
 *         description: Chat not found
 *       500:
 *         description: Internal server error
 */
router
  .route("/getmessages/:chatId")
  .get(
    verifyJwt,
    checkPermission("user"),
    getmessageValidator(),
    validate,
    chatController.getmessages
  );

/**
 * @swagger
 * /api/v1/chat/deleteChat/{chatId}:
 *   delete:
 *     summary: Delete chat
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: chatId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "chatId123"
 *     responses:
 *       200:
 *         description: Chat deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Chat deleted"
 *       400:
 *         description: Invalid chat ID or not a single chat
 *       404:
 *         description: Chat not found
 *       500:
 *         description: Internal server error
 */
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
