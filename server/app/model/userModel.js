const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      validate: [
        {
          validator: function (v) {
            return validator.isLength(v, { min: 3, max: 50 });
          },
          message: "Name must be between 3 and 50 characters long",
        },
      ],
    },
    bio: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [
        {
          validator: function (v) {
            return validator.isEmail(v);
          },
          message: "Please enter a valid email",
        },
      ],
    },
    username: {
      type: String,
      required: true,
      unique: true,
      validate: [
        {
          validator: function (v) {
            return validator.isLength(v, { min: 3, max: 50 });
          },
          message: "Username must be between 3 and 50 characters long",
        },
      ],
    },
    password: {
      type: String,
      required: true,
      validate: [
        {
          validator: function (v) {
            return validator.isLength(v, { min: 6, max: 30 });
          },
          message: "Password must be between 6 and 20 characters long",
        },
      ],
    },
    avatar: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    gooleavatar: {
      type: String,
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    groups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "chat",
      },
    ],
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpire: { type: Date, default: null },
    isverified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.ACCESS_SECRET_TOKEN,
    {
      expiresIn: process.env.ACCESS_SECRET_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.REFRESH_SECRET_TOKEN,
    {
      expiresIn: process.env.REFRESH_SECRET_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model("user", userSchema);
module.exports = User;
