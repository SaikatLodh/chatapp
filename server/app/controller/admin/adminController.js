const User = require("../../model/userModel");
const Chat = require("../../model/chatmodel");
const Message = require("../../model/messagemodel");
const ApiResponse = require("../../config/apiResponse");
const ApiError = require("../../config/apiError");

class adminController {
  async getdashboardstats(req, res) {
    try {
      const [groupsCount, usersCount, messagesCount, totalChatsCount] =
        await Promise.all([
          Chat.countDocuments({ groupChat: true }),
          User.countDocuments({ role: "user" }),
          Message.countDocuments(),
          Chat.countDocuments(),
        ]);

      const today = new Date();
      const last7Days = new Date();
      last7Days.setDate(last7Days.getDate() - 7);

      const last7DaysMessages = await Message.find({
        createdAt: { $gte: last7Days, $lte: today },
      }).select("createdAt");

      const messages = new Array(7).fill(0);
      const dayInMiliseconds = 1000 * 60 * 60 * 24;

      last7DaysMessages.forEach((message) => {
        const indexApprox =
          (today.getTime() - message.createdAt.getTime()) / dayInMiliseconds;
        const index = Math.floor(indexApprox);

        messages[6 - index]++;
      });

      const stats = {
        groupsCount,
        usersCount,
        messagesCount,
        totalChatsCount,
        messagesChart: messages,
      };

      return res
        .status(200)
        .json(new ApiResponse(200, { stats }, "Stats fetched successfully"));
    } catch (error) {
      return res.status(500).json(new ApiError(error.message, 500));
    }
  }

  async getallusers(req, res) {
    try {
      const users = await User.find({ role: "user" })
        .select("-password -resetPasswordToken -resetPasswordExpire")
        .sort({ createdAt: -1 })
        .lean();

      if (!users) {
        return res
          .status(500)
          .json(new ApiError("Something went wrong while fetching users", 500));
      }
      return res
        .status(200)
        .json(new ApiResponse(200, { users }, "Users fetched successfully"));
    } catch (error) {
      return res.status(500).json(new ApiError(error.message, 500));
    }
  }

  async getallchats(req, res) {
    try {
      const chats = await Chat.find({})
        .populate("members", "name avatar gooleavatar")
        .populate("creator", "name avatar gooleavatar")
        .lean();

      if (!chats) {
        return res
          .status(500)
          .json(new ApiError("Something went wrong while fetching chats", 500));
      }

      const transformedChats = await Promise.all(
        chats.map(async ({ members, _id, groupChat, name, creator }) => {
          const totalMessages = await Message.countDocuments({ chat: _id });

          return {
            _id,
            groupChat,
            name,
            avatar: members
              .slice(0, 3)
              .map(
                (member) => member?.avatar?.url || member?.gooleavatar || ""
              ),
            members: members.map(({ _id, name, avatar }) => ({
              _id,
              name,
              avatar: avatar?.url || avatar?.gooleavatar || "",
            })),
            creator: {
              name: creator?.name || "None",
              avatar: creator?.avatar?.url || creator?.gooleavatar || "",
            },
            totalMembers: members.length,
            totalMessages,
          };
        })
      );
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

  async getallmessages(req, res) {
    try {
      const messages = await Message.find({})
        .populate("sender", "name avatar gooleavatar")
        .populate("chat", "name groupChat")
        .lean();

      if (!messages) {
        return res
          .status(500)
          .json(
            new ApiError("Something went wrong while fetching messages", 500)
          );
      }

      const transformedMessages = messages.map(
        ({ content, attachments, _id, sender, createdAt, chat }) => ({
          _id,
          attachments,
          content,
          createdAt,
          chat: chat._id,
          groupChat: chat.groupChat,
          sender: {
            _id: sender._id,
            name: sender.name,
            avatar: sender?.avatar?.url || sender?.gooleavatar || "",
          },
        })
      );

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { messages: transformedMessages },
            "Messages fetched successfully"
          )
        );
    } catch (error) {
      return res.status(500).json(new ApiError(error.message, 500));
    }
  }
}

module.exports = new adminController();
