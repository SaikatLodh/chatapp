const mongoose = require("mongoose");
const validator = require("validator");

const otpSchema = new mongoose.Schema(
  {
    otp: {
      type: Number,
      default: null,
      required: true,
    },
    otpExpire: {
      type: Date,
      default: null,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      validate: [
        {
          validator: function (v) {
            return validator.isEmail(v);
          },
          message: "Please enter a valid email",
        },
      ],
    },
    isotpsend: {
      type: Boolean,
      default: false,
    },
    otpVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Otp = mongoose.model("otp", otpSchema);

module.exports = Otp;
