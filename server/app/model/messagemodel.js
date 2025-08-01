const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    content: String,

    attachments: [
      {
        publicId: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    ],

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chat",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("message", messageSchema);
module.exports = Message;
