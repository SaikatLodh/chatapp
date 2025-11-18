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

/**
 * @swagger
 * /api/v1/user/getuser:
 *   get:
 *     summary: Get current user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data retrieved successfully
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
 *                   example: "User fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         username:
 *                           type: string
 *                         email:
 *                           type: string
 *                         bio:
 *                           type: string
 *                         avatar:
 *                           type: object
 *                           properties:
 *                             url:
 *                               type: string
 *                             public_id:
 *                               type: string
 *                         gooleavatar:
 *                           type: string
 *                         role:
 *                           type: string
 *                         friends:
 *                           type: array
 *                           items:
 *                             type: string
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Something went wrong while fetching user"
 */
router.route("/getuser").get(verifyJwt, userController.getuser);

/**
 * @swagger
 * /api/v1/user/updateuser:
 *   patch:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               bio:
 *                 type: string
 *                 example: "Hello, I'm John"
 *               username:
 *                 type: string
 *                 example: "johndoe"
 *               profilePic:
 *                 type: string
 *                 format: binary
 *                 description: Profile picture file (PNG, JPEG, JPG only)
 *     responses:
 *       200:
 *         description: User updated successfully
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
 *                   example: "User updated successfully"
 *       400:
 *         description: Invalid file type or validation error
 *       500:
 *         description: Internal server error
 */
router
  .route("/updateuser")
  .patch(
    verifyJwt,
    upload.single("profilePic"),
    updateuser(),
    validate,
    userController.updateuser
  );

/**
 * @swagger
 * /api/v1/user/changepassword:
 *   patch:
 *     summary: Change password
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: "oldpassword123"
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 20
 *                 example: "newpassword123"
 *               confirmPassword:
 *                 type: string
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Password changed successfully
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
 *                   example: "Password changed successfully"
 *       400:
 *         description: Password mismatch or incorrect old password
 *       500:
 *         description: Internal server error
 */
router.route("/changepassword").patch(
  verifyJwt,
  changepassword(),
  validate,
  userController.changepassword
);

/**
 * @swagger
 * /api/v1/user/searchuser:
 *   get:
 *     summary: Search users
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: name
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         example: "John"
 *     responses:
 *       200:
 *         description: Users found successfully
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
 *                   example: "Users fetched"
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           avatar:
 *                             type: object
 *                             properties:
 *                               url:
 *                                 type: string
 *                           gooleavatar:
 *                             type: string
 *                           friends:
 *                             type: array
 *                             items:
 *                               type: string
 *                           request:
 *                             type: array
 *                             items:
 *                               type: object
 *       500:
 *         description: Internal server error
 */
router
  .route("/searchuser")
  .get(verifyJwt, checkPermission("user"), userController.searchuser);

/**
 * @swagger
 * /api/v1/user/sendfriendrequest/{receiverId}:
 *   get:
 *     summary: Send friend request
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: receiverId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "userId123"
 *     responses:
 *       200:
 *         description: Friend request sent successfully
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
 *                   example: "Request sent"
 *       400:
 *         description: Invalid user ID or request already sent
 *       500:
 *         description: Internal server error
 */
router
  .route("/sendfriendrequest/:receiverId")
  .get(
    verifyJwt,
    checkPermission("user"),
    sendfriendrequest(),
    validate,
    userController.sendfriendrequest
  );

/**
 * @swagger
 * /api/v1/user/acceptfriendrequest:
 *   post:
 *     summary: Accept friend request
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - senderId
 *               - accept
 *             properties:
 *               senderId:
 *                 type: string
 *                 example: "senderId123"
 *               accept:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Friend request accepted successfully
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
 *                   example: "Request accepted"
 *       400:
 *         description: Invalid request ID
 *       500:
 *         description: Internal server error
 */
router
  .route("/acceptfriendrequest")
  .post(
    verifyJwt,
    checkPermission("user"),
    acceptfriendrequest(),
    validate,
    userController.acceptfriendrequest
  );

/**
 * @swagger
 * /api/v1/user/getmyfrieendrequest:
 *   get:
 *     summary: Get my friend requests
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Friend requests retrieved successfully
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
 *                   example: "Request fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     requests:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           sender:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                               name:
 *                                 type: string
 *                               avatar:
 *                                 type: object
 *                                 properties:
 *                                   url:
 *                                     type: string
 *                               gooleavatar:
 *                                 type: string
 *                           status:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *       500:
 *         description: Internal server error
 */
router
  .route("/getmyfrieendrequest")
  .get(verifyJwt, checkPermission("user"), userController.getmyfrieendrequest);

/**
 * @swagger
 * /api/v1/user/getmyfriends:
 *   get:
 *     summary: Get my friends
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Friends list retrieved successfully
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
 *                   example: "Friends fetched"
 *                 data:
 *                   type: object
 *                   properties:
 *                     friends:
 *                       type: object
 *                       properties:
 *                         friends:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                               name:
 *                                 type: string
 *                               avatar:
 *                                 type: object
 *                                 properties:
 *                                   url:
 *                                     type: string
 *                               gooleavatar:
 *                                 type: string
 *       500:
 *         description: Internal server error
 */
router
  .route("/getmyfriends")
  .get(verifyJwt, checkPermission("user"), userController.getmyfriends);

/**
 * @swagger
 * /api/v1/user/removefriend/{friendId}:
 *   get:
 *     summary: Remove friend
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: friendId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "friendId123"
 *     responses:
 *       200:
 *         description: Friend removed successfully
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
 *                   example: "Friend removed successfully"
 *       400:
 *         description: Invalid friend ID or not friends
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router
  .route("/removefriend/:friendId")
  .get(verifyJwt, checkPermission("user"), userController.removefriend);

module.exports = router;
