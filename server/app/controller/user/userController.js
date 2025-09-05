const User = require("../../model/userModel");
const Request = require("../../model/requestmodel");
const Chat = require("../../model/chatmodel");
const ApiResponse = require("../../config/apiResponse");
const ApiError = require("../../config/apiError");
const uploadFile = require("../../helper/cloudinary");
const deleteFile = require("../../helper/cloudinary");
const { default: mongoose } = require("mongoose");
const { getIO, userSocketIDs } = require("../../config/socketStore");
const { USERS_REQUEST, CREATE_CHAT } = require("../../config/socketkeys");
const isValidObjectId = require("mongoose").isValidObjectId;

class userController {
  async getuser(req, res) {
    try {
      const userId = req.user.id;

      const finduser = await User.findById(userId).select(
        "-password -resetPasswordToken -resetPasswordExpire"
      );

      if (!finduser) {
        return res
          .status(500)
          .json(new ApiError("Something went wrong while fetching user", 500));
      }

      return res
        .status(200)
        .json(
          new ApiResponse(200, { user: finduser }, "User fetched successfully")
        );
    } catch (error) {
      return res.status(500).json(new ApiError(error.message, 500));
    }
  }

  async updateuser(req, res) {
    try {
      const userId = req.user.id;
      const { name, bio, username } = req.body;

      const file = req?.file?.path;

      const finduser = await User.findById(userId);

      if (file) {
        if (
          req?.file?.mimetype !== "image/png" &&
          req?.file?.mimetype !== "image/jpeg" &&
          req?.file?.mimetype !== "image/jpg"
        ) {
          return res.status(400).json(new ApiError("Invalid file type", 400));
        }

        const uploadFileOnCloudinary = await uploadFile.uploadFile(file);

        if (!uploadFileOnCloudinary.url || !uploadFileOnCloudinary.publicId) {
          return res.status(400).json(new ApiError("File not uploaded", 400));
        }

        if (finduser.avatar.public_id) {
          await deleteFile.deleteImage(finduser.avatar.public_id);
        }

        const updateuser = await User.findByIdAndUpdate(
          userId,
          {
            name: name || finduser.name,
            bio: bio || finduser.bio,
            username: username || finduser.username,
            avatar: {
              url: uploadFileOnCloudinary.url,
              public_id: uploadFileOnCloudinary.public_id,
            },
          },
          { new: true }
        );

        if (!updateuser) {
          return res.status(500).json(new ApiError("User not updated", 500));
        }

        return res
          .status(200)
          .json(new ApiResponse(200, {}, "User updated successfully"));
      } else {
        const updateuser = await User.findByIdAndUpdate(
          userId,
          {
            name: name || finduser?.name,
            bio: bio || finduser?.bio,
            username: username || finduser?.username,
          },
          { new: true }
        );

        if (!updateuser) {
          return res.status(500).json(new ApiError("User not updated", 500));
        }

        return res
          .status(200)
          .json(new ApiResponse(200, {}, "User updated successfully"));
      }
    } catch (error) {
      return res.status(500).json(new ApiError(error.message, 500));
    }
  }

  async changepassword(req, res) {
    try {
      const userId = req.user.id;
      const { oldPassword, newPassword, confirmPassword } = req.body;

      if (newPassword !== confirmPassword) {
        return res
          .status(400)
          .json(new ApiError("Password and confirm password is not same", 400));
      }

      const finduser = await User.findById(userId);

      const comparePassword = await finduser.comparePassword(oldPassword);

      if (!comparePassword) {
        return res
          .status(400)
          .json(new ApiError("Old password is incorrect", 400));
      }

      finduser.password = newPassword;
      await finduser.save({ validateBeforeSave: false });

      return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"));
    } catch (error) {
      return res.status(500).json(new ApiError(error.message, 500));
    }
  }

  async searchuser(req, res) {
    try {
      const { name = "" } = req.query;
      const userId = req.user?._id;

      if (name.length > 0) {
        const finduser = await User.find({
          _id: { $ne: userId },
          name: { $regex: name, $options: "i" },
          role: "user",
        })
          .select("name avatar gooleavatar friends")
          .lean();

        if (!finduser) {
          return res
            .status(500)
            .json(
              new ApiError("Something went wrong while fetching users", 500)
            );
        }

        const findRequiest = await Request.find({
          $or: [{ sender: userId }, { receiver: userId }],
        });

        if (!findRequiest) {
          return res
            .status(500)
            .json(
              new ApiError("Something went wrong while fetching users", 500)
            );
        }

        const margeArrays = finduser.map((user) => {
          return {
            ...user,
            request: findRequiest,
          };
        });

        return res
          .status(200)
          .json(new ApiResponse(200, { users: margeArrays }, "Users fetched"));
      } else {
        const finduser = await User.find({ _id: { $ne: userId }, role: "user" })
          .select("name avatar gooleavatar friends")
          .lean();

        if (!finduser) {
          return res
            .status(500)
            .json(
              new ApiError("Something went wrong while fetching users", 500)
            );
        }

        const findRequiest = await Request.find({
          $or: [{ sender: userId }, { receiver: userId }],
        });

        if (!findRequiest) {
          return res
            .status(500)
            .json(
              new ApiError("Something went wrong while fetching users", 500)
            );
        }

        const margeArrays = finduser.map((user) => {
          return {
            ...user,
            request: findRequiest,
          };
        });

        return res
          .status(200)
          .json(new ApiResponse(200, { users: margeArrays }, "Users fetched"));
      }
    } catch (error) {
      return res.statu(500).json(new ApiError(error.message, 500));
    }
  }

  async sendfriendrequest(req, res) {
    try {
      const { receiverId } = req.params;
      const senderId = req.user._id;
      if (!isValidObjectId(receiverId)) {
        return res.status(400).json(new ApiError("Invalid user id", 400));
      }

      const findrequest = await Request.findOne({
        $or: [
          { sender: senderId, receiver: receiverId },
          { sender: receiverId, receiver: senderId },
        ],
        friend: true,
      });

      if (findrequest) {
        return res.status(400).json(new ApiError("Request already sent", 400));
      }

      const sendrequest = await Request.create({
        sender: senderId,
        receiver: receiverId,
        status: "sent",
      });

      if (!sendrequest) {
        return res
          .status(500)
          .json(
            new ApiError("Something went wrong while sending request", 500)
          );
      }

      const getCreatedRequest = await Request.findById(sendrequest._id)
        .populate("sender", "name avatar gooleavatar")
        .lean();

      if (!getCreatedRequest) {
        return res
          .status(500)
          .json(
            new ApiError("Something went wrong while fetching request", 500)
          );
      }

      const io = getIO();
      const receiverSocketId = userSocketIDs.get(receiverId);
      io.to(receiverSocketId).emit(USERS_REQUEST, getCreatedRequest);

      return res.status(200).json(new ApiResponse(200, {}, "Request sent"));
    } catch (error) {
      return res.status(500).json(new ApiError(error.message, 500));
    }
  }

  async acceptfriendrequest(req, res) {
    try {
      const { senderId, accept } = req.body;
      const reciverId = req.user._id.toString();

      if (!isValidObjectId(senderId)) {
        return res.status(400).json(new ApiError("Invalid request id", 400));
      }

      if (!accept) {
        const deleteRequest = await Request.deleteOne({
          sender: senderId,
          receiver: reciverId,
        });

        if (!deleteRequest) {
          return res
            .status(500)
            .json(
              new ApiError("Something went wrong while deleting request", 500)
            );
        }

        return res
          .status(200)
          .json(new ApiResponse(200, {}, "Request not accepted"));
      } else {
        const acceptrequest = await Request.updateOne(
          {
            sender: senderId,
            receiver: reciverId,
          },
          {
            $set: {
              status: "accepted",
              friend: true,
            },
          },
          {
            new: true,
          }
        );

        if (!acceptrequest) {
          return res
            .status(500)
            .json(
              new ApiError("Something went wrong while accepting request", 500)
            );
        }

        const findrequest = await Request.findOne({
          sender: senderId,
          receiver: reciverId,
        })
          .populate("sender", "name")
          .populate("receiver", "name");

        const checkChat = await Chat.findOne({
          groupChat: false,
          members: { $all: [findrequest.sender, findrequest.receiver] },
        });

        if (!checkChat) {
          const createChat = await Chat.create({
            name: `${findrequest.sender.name}-${findrequest.receiver.name}`,
            groupChat: false,
            members: [findrequest.sender, findrequest.receiver],
          });

          if (!createChat) {
            return res
              .status(500)
              .json(
                new ApiError("Something went wrong while creating chat", 500)
              );
          }

          const findCreateChat = await Chat.findById(createChat._id)
            .populate({
              path: "members",
              select: "name avatar gooleavatar",
            })
            .lean();

          const payLoad = {
            _id: findCreateChat._id.toString(),
            name: findCreateChat.members.find(
              (member) => member._id.toString() !== reciverId
            ).name,
            groupChat: findCreateChat.groupChat,
            members: findCreateChat.members.reduce((acc, member) => {
              if (member._id.toString() !== reciverId) {
                acc.push(member._id.toString());
              }
              return acc;
            }, []),
            avatar: findCreateChat.members,
          };
          const io = getIO();
          const senderSocketId = userSocketIDs.get(senderId);
          io.to(senderSocketId).emit(CREATE_CHAT, payLoad);
        }

        await Promise.all([
          User.findByIdAndUpdate(reciverId, {
            $push: { friends: senderId },
          }),
          User.findByIdAndUpdate(senderId, {
            $push: { friends: reciverId },
          }),
        ]);

        return res
          .status(200)
          .json(new ApiResponse(200, {}, "Request accepted"));
      }
    } catch (error) {
      return res.status(500).json(new ApiError(error.message, 500));
    }
  }

  async getmyfrieendrequest(req, res) {
    try {
      const userid = req.user._id;

      const findrequests = await Request.find({
        receiver: userid,
        friend: false,
        status: "sent",
      })
        .populate("sender", "name avatar gooleavatar")
        .sort({ createdAt: -1 })
        .lean();

      if (!findrequests) {
        return res
          .status(500)
          .json(
            new ApiError("Something went wrong while fetching request", 500)
          );
      }

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { requests: findrequests },
            "Request fetched successfully"
          )
        );
    } catch (error) {
      return res.status(500).json(new ApiError(error.message, 500));
    }
  }

  async getmyfriends(req, res) {
    try {
      const userid = req.user._id;

      const findfriends = await User.findById(userid)
        .select("friends")
        .populate("friends", "name avatar gooleavatar")
        .lean();

      if (!findfriends) {
        return res
          .status(500)
          .json(
            new ApiError("Something went wrong while fetching friends", 500)
          );
      }

      return res
        .status(200)
        .json(
          new ApiResponse(200, { friends: findfriends }, "Friends fetched")
        );
    } catch (error) {
      return res.status(500).json(new ApiError(error.message, 500));
    }
  }

  async removefriend(req, res) {
    try {
      const { friendId } = req.params;
      const userId = req.user._id;

      if (!isValidObjectId(friendId)) {
        return res.status(400).json(new ApiError("Invalid friend id", 400));
      }

      const finduser = await User.findById(userId);

      if (!finduser) {
        return res.status(404).json(new ApiError("User not found", 404));
      }

      if (!finduser.friends.includes(friendId)) {
        return res
          .status(400)
          .json(new ApiError("You are not friends with this user", 400));
      }

      const [one, two, three] = await Promise.all([
        User.findByIdAndUpdate(userId, {
          $pull: { friends: friendId },
        }),
        User.findByIdAndUpdate(friendId, {
          $pull: { friends: userId },
        }),
        Request.updateOne(
          {
            $or: [
              { sender: userId, receiver: friendId },
              { sender: friendId, receiver: userId },
            ],
          },
          {
            $set: { status: "rejected", friend: false },
          }
        ),
      ]);

      if (one && two && three) {
        return res
          .status(200)
          .json(new ApiResponse(200, {}, "Friend removed successfully"));
      }
    } catch (error) {
      return res.status(500).json(new ApiError(error.message, 500));
    }
  }
}

module.exports = new userController();
