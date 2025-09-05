const Chat = require("../../model/chatmodel");
const User = require("../../model/userModel");
const Message = require("../../model/messagemodel");
const ApiResponse = require("../../config/apiResponse");
const ApiError = require("../../config/apiError");
const uploadFile = require("../../helper/cloudinary");
const { userSocketIDs, getIO } = require("../../config/socketStore");
const {
  USERS_MESSAGE,
  CREATE_CHAT,
  MESSAGE_ALERT,
} = require("../../config/socketkeys");
const isValidObjectId = require("mongoose").isValidObjectId;

class chatController {
  async creategroupchat(req, res) {
    try {
      const { name, members } = req.body;
      const creator = req.user._id;

      const checkIsobjectId = members.every((member) =>
        isValidObjectId(member)
      );

      if (!checkIsobjectId)
        return res.status(400).json(new ApiError("Invalid member id", 400));

      const allMembers = [...members, creator];

      const chat = await Chat.create({
        name,
        creator,
        members: allMembers,
        groupChat: true,
      });

      if (!chat)
        return res.status(500).json(new ApiError("Chat not created", 500));

      const addchatinuser = await User.updateMany(
        { _id: { $in: allMembers } },
        { $push: { groups: chat._id } }
      );

      if (!addchatinuser)
        return res.status(500).json(new ApiError("Chat not created", 500));

      const findCreateChat = await Chat.findById(chat._id)
        .populate({
          path: "members",
          select: "name avatar gooleavatar",
        })
        .lean();

      const payLoad = {
        _id: findCreateChat._id.toString(),
        name: findCreateChat.name,
        groupChat: findCreateChat.groupChat,
        members: findCreateChat.members.reduce((acc, member) => {
          if (member._id.toString() !== creator.toString()) {
            acc.push(member._id.toString());
          }
          return acc;
        }, []),
        avatar: findCreateChat.members.slice(0, 3).map((avatar) => avatar),
      };

      members.forEach((element) => {
        const io = getIO();
        const getSocketId = userSocketIDs.get(element.toString());
        io.to(getSocketId).emit(CREATE_CHAT, payLoad);
      });

      return res.status(201).json(new ApiResponse(201, {}, "Chat created"));
    } catch (error) {
      res.status(500).json(new ApiError(error.message, 500));
    }
  }

  async getmychatlist(req, res) {
    try {
      const userId = req.user._id;

      const chats = await Chat.find({
        members: { $elemMatch: { $eq: userId } },
      })
        .populate({
          path: "members",
          select: "name avatar gooleavatar",
        })
        .sort({ updatedAt: -1 })
        .lean();

      if (!chats)
        return res
          .status(500)
          .json(new ApiError("Something went wrong while fetching chats", 500));

      const transformedChats = chats.map((chat) => {
        const member = chat.members.find(
          (member) => member._id.toString() !== userId.toString()
        );
        return {
          _id: chat._id,
          name: chat.groupChat ? chat.name : member.name,
          groupChat: chat.groupChat,
          members: chat.members.reduce((acc, member) => {
            acc.push(member._id.toString());
            return acc;
          }, []),
          avatar: chat.groupChat
            ? chat.members.slice(0, 3).map((avatar) => avatar)
            : [member],
          MembersDetails: chat.members.reduce((acc, member) => {
            acc.push(member);
            return acc;
          }, []),
        };
      });

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { chats: transformedChats },
            "Chats fetched successfully"
          )
        );
    } catch (error) {
      return res.status(500).json(new ApiError(error.message, 500));
    }
  }

  async getmygroups(req, res) {
    try {
      const userId = req.user._id;

      const chats = await Chat.find({
        members: { $elemMatch: { $eq: userId } },
        groupChat: true,
        creator: userId,
      })
        .populate({
          path: "members",
          select: "name avatar gooleavatar",
        })
        .lean();

      if (!chats)
        return res
          .status(500)
          .json(new ApiError("Something went wrong while fetching chats", 500));

      const transformedGroups = chats.map((chat) => {
        return {
          _id: chat._id,
          name: chat.name,
          groupChat: chat.groupChat,
          avatar: chat.members
            .slice(0, 3)
            .map(
              (avatar) =>
                (avatar.avatar && avatar.avatar.url) ||
                (avatar.gooleavatar && avatar.gooleavatar)
            ),
          members: chat.members,
        };
      });

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { groups: transformedGroups },
            "Chats fetched successfully",
            200
          )
        );
    } catch (error) {
      return res.status(500).json(new ApiError(error.message, 500));
    }
  }

  async addmembers(req, res) {
    try {
      const { chatId, members } = req.body;
      const userId = req.user._id;

      const checkIsobjectId = members.every((member) =>
        isValidObjectId(member && chatId)
      );

      if (!checkIsobjectId)
        return res.status(400).json(new ApiError("Invalid member id", 400));

      const chat = await Chat.findById(chatId);

      if (!chat)
        return res.status(404).json(new ApiError("Chat not found", 404));

      if (chat.groupChat === false)
        return res
          .status(400)
          .json(new ApiError("This is not a group chat", 400));

      if (chat.creator.toString() !== userId.toString())
        return res
          .status(400)
          .json(new ApiError("You are not the creator of this group", 400));

      const checkMembers = await Chat.find({
        _id: chatId,
        members: { $in: members },
      });

      if (checkMembers.length > 0)
        return res
          .status(400)
          .json(new ApiError("Members already exists", 400));

      const addMembers = await Chat.findByIdAndUpdate(
        chatId,
        {
          $push: { members: { $each: members } },
        },
        { new: true }
      );

      if (!addMembers)
        return res
          .status(500)
          .json(new ApiError("Something went wrong while adding members", 500));

      return res.status(200).json(new ApiResponse(200, {}, "Members added"));
    } catch (error) {
      res.status(500).json(new ApiError(error.message, 500));
    }
  }

  async removemembers(req, res) {
    try {
      const { chatId, members } = req.body;
      const userId = req.user._id;

      const checkIsobjectId = members.every((member) =>
        isValidObjectId(member && chatId)
      );

      if (!checkIsobjectId)
        return res.status(400).json(new ApiError("Invalid member id", 400));

      const chat = await Chat.findById(chatId);

      if (!chat)
        return res.status(404).json(new ApiError("Chat not found", 404));

      if (chat.groupChat === false)
        return res
          .status(400)
          .json(new ApiError("This is not a group chat", 400));

      if (chat.creator.toString() !== userId.toString())
        return res
          .status(400)
          .json(new ApiError("You are not the creator of this group", 400));

      const checkMembers = await Chat.find({
        _id: chatId,
        members: { $in: members },
      });

      if (checkMembers.length > 0) {
        const removeMembers = await Chat.findByIdAndUpdate(
          chatId,
          {
            $pull: { members: { $in: members } },
          },
          { new: true }
        );

        if (!removeMembers)
          return res
            .status(500)
            .json(
              new ApiError("Something went wrong while removing members", 500)
            );

        return res
          .status(200)
          .json(new ApiResponse(200, {}, "Members removed"));
      }
    } catch (error) {
      res.status(500).json(new ApiError(error.message, 500));
    }
  }

  async renamegroup(req, res) {
    try {
      const { chatId } = req.params;
      const { name } = req.body;

      if (!isValidObjectId(chatId))
        return res.status(400).json(new ApiError("Invalid chat id", 400));

      const chat = await Chat.findById(chatId);

      if (!chat)
        return res.status(404).json(new ApiError("Chat not found", 404));

      if (chat.groupChat === false)
        return res
          .status(400)
          .json(new ApiError("This is not a group chat", 400));

      const updateChat = await Chat.findByIdAndUpdate(
        chatId,
        {
          name: name,
        },
        { new: true }
      );

      if (!updateChat)
        return res
          .status(500)
          .json(new ApiError("Something went wrong while updating chat", 500));
      return res
        .status(200)
        .json(new ApiResponse(200, {}, "Group name updated"));
    } catch (error) {
      res.status(500).json(new ApiError(error.message, 500));
    }
  }

  async leavegroup(req, res) {
    try {
      const { chatId } = req.params;
      const userId = req.user._id;

      if (!isValidObjectId(chatId))
        return res.status(400).json(new ApiError("Invalid chat id", 400));

      const chat = await Chat.findById(chatId);

      if (!chat)
        return res.status(404).json(new ApiError("Chat not found", 404));

      if (chat.groupChat === false)
        return res
          .status(400)
          .json(new ApiError("This is not a group chat", 400));

      const checkMembers = chat.members.includes(userId);

      if (checkMembers) {
        const removeMembers = await Chat.findByIdAndUpdate(
          chatId,
          {
            $pull: { members: userId },
          },
          { new: true }
        );

        if (!removeMembers)
          return res
            .status(500)
            .json(
              new ApiError("Something went wrong while removing members", 500)
            );

        if (chat.creator.toString() === userId.toString()) {
          const remainingMembers = chat.members.filter(
            (member) => member.toString() !== userId.toString()
          );
          const randomElement = Math.floor(
            Math.random() * remainingMembers.length
          );
          const randomMember = remainingMembers[randomElement];
          const updateChat = await Chat.findByIdAndUpdate(
            chatId,
            {
              creator: randomMember,
            },
            { new: true }
          );
          if (!updateChat)
            return res
              .status(500)
              .json(
                new ApiError("Something went wrong while updating chat", 500)
              );
        }

        return res.status(200).json(new ApiResponse(200, {}, "Left group"));
      }
    } catch (error) {
      res.status(500).json(new ApiError(error.message, 500));
    }
  }

  async sendmessage(req, res) {
    try {
      const { chatId } = req.params;
      const { content, isGroup } = req?.body;
      const convertIsFroup = JSON.parse(isGroup);
      const userId = req.user._id;
      const files =
        req?.files && req?.files?.attechment?.length > 0
          ? req?.files?.attechment
          : [];

      if (!isValidObjectId(chatId))
        return res.status(400).json(new ApiError("Invalid chat id", 400));
      const io = getIO();
      const chat = await Chat.findById(chatId);

      if (!chat)
        return res.status(404).json(new ApiError("Chat not found", 404));

      const getFriend = chat.members.filter(
        (member) => member.toString() !== userId.toString()
      )[0];

      const isFriend = req.user.friends.includes(getFriend.toString());

      if (!isFriend && chat.groupChat === false) {
        return res
          .status(400)
          .json(new ApiError("You are not friends with this user", 400));
      }

      if (files?.length > 0) {
        const upLoadFiles = await uploadFile.uploadFiles(files);

        if (!upLoadFiles) {
          return res
            .status(500)
            .json(
              new ApiError("Something went wrong while uploading file", 500)
            );
        }

        if (upLoadFiles.length === files.length) {
          const message = await Message.create({
            sender: userId,
            chat: chatId,
            attachments: upLoadFiles,
          });

          if (!message)
            return res
              .status(500)
              .json(
                new ApiError("Something went wrong while sending message", 500)
              );

          if (convertIsFroup === true) {
            const filterMembers = chat.members.filter(
              (member) => member._id.toString() !== userId.toString()
            );

            for (const member of filterMembers) {
              const socketId = userSocketIDs.get(member.toString());
              if (socketId) {
                io.to(socketId).emit(USERS_MESSAGE, message);
                io.to(socketId).emit(MESSAGE_ALERT, { chatId });
              }
            }
          } else {
            const findReciver = chat.members.find(
              (member) => member.toString() !== userId.toString()
            );

            const socketId = userSocketIDs.get(findReciver.toString());

            if (socketId) {
              io.to(socketId).emit(USERS_MESSAGE, message);
              io.to(socketId).emit(MESSAGE_ALERT, { chatId });
            }
          }

          return res.status(200).json(new ApiResponse(201, {}, "Message sent"));
        }
      } else {
        const message = await Message.create({
          content: content,
          sender: userId,
          chat: chatId,
        });

        if (!message)
          return res
            .status(500)
            .json(
              new ApiError("Something went wrong while sending message", 500)
            );

        if (convertIsFroup === true) {
          const filterMembers = chat.members.filter(
            (member) => member._id.toString() !== userId.toString()
          );

          for (const member of filterMembers) {
            const socketId = userSocketIDs.get(member.toString());
            if (socketId) {
              io.to(socketId).emit(USERS_MESSAGE, message);
              io.to(socketId).emit(MESSAGE_ALERT, { chatId });
            }
          }
        } else {
          const findReciver = chat.members.find(
            (member) => member.toString() !== userId.toString()
          );

          const socketId = userSocketIDs.get(findReciver.toString());

          if (socketId) {
            io.to(socketId).emit(USERS_MESSAGE, message);
            io.to(socketId).emit(MESSAGE_ALERT, { chatId });
          }
        }
        return res.status(200).json(new ApiResponse(201, {}, "Message sent"));
      }
    } catch (error) {
      res.status(500).json(new ApiError(error.message, 500));
    }
  }

  async getmessages(req, res) {
    try {
      const { chatId } = req.params;

      if (!isValidObjectId(chatId))
        return res.status(400).json(new ApiError("Invalid chat id", 400));

      const chat = await Chat.findById(chatId);
      if (!chat)
        return res.status(404).json(new ApiError("Chat not found", 404));

      const messages = await Message.find({ chat: chatId })
        .populate("sender", "name avatar gooleavatar")
        .lean();

      if (!messages)
        return res
          .status(500)
          .json(
            new ApiError("Something went wrong while fetching messages", 500)
          );

      return res
        .status(200)
        .json(new ApiResponse(200, { messages }, "Messages"));
    } catch (error) {
      res.status(500).json(new ApiError(error.message, 500));
    }
  }

  async deleteChat(req, res) {
    try {
      const { chatId } = req.params;
      const userId = req.user._id;

      if (!isValidObjectId(chatId))
        return res.status(400).json(new ApiError("Invalid chat id", 400));

      const chat = await Chat.findById(chatId);

      if (!chat)
        return res.status(404).json(new ApiError("Chat not found", 404));

      if (chat.groupChat === true)
        return res
          .status(400)
          .json(new ApiError("This is not a single chat", 400));

      const messagesWithAttachments = await Message.find({
        chat: chatId,
        attachments: { $exists: true, $ne: [] },
      });

      if (messagesWithAttachments.length > 0) {
        const imagePublicIds = [];
        const videoPublicIds = [];
        const rawsPublicIds = [];

        messagesWithAttachments.forEach((message) => {
          message.attachments.forEach((attachment) => {
            if (attachment.url) {
              if (attachment.url.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i)) {
                imagePublicIds.push(attachment.publicId);
              } else if (
                attachment.url.match(/\.(mp4|mov|avi|wmv|flv|webm|mkv)$/i)
              ) {
                videoPublicIds.push(attachment.publicId);
              } else {
                rawsPublicIds.push(attachment.publicId);
              }
            }
          });
        });

        if (imagePublicIds.length > 0) {
          await uploadFile.deleteImages(imagePublicIds);
        }
        if (videoPublicIds.length > 0) {
          await uploadFile.deleteVideos(videoPublicIds);
        }
        if (rawsPublicIds.length > 0) {
          await uploadFile.deleteRaws(rawsPublicIds);
        }
      }

      const deletedMessages = await Message.deleteMany({
        chat: chatId,
        sender: userId,
      });

      if (!deletedMessages)
        return res
          .status(500)
          .json(
            new ApiError("Something went wrong while deleting messages", 500)
          );

      return res.status(200).json(new ApiResponse(200, {}, "Chat deleted"));
    } catch (error) {
      res.status(500).json(new ApiError(error.message, 500));
    }
  }
}

module.exports = new chatController();
