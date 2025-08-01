const User = require("../../model/userModel");
const Otp = require("../../model/otpmodel");
const ApiResponse = require("../../config/apiResponse");
const ApiError = require("../../config/apiError");
const sendEmail = require("../../helper/sendEmail");
const generateAccessAndRefereshToken = require("../../config/generateAccessAndRefereshToken ");
const crypto = require("crypto");
const oauth2Client = require("../../helper/googleclient");
const jwt = require("jsonwebtoken");

class authController {
  async sendOtp(req, res) {
    try {
      const { email } = req.body;

      const checkUser = await User.findOne({ email: email });

      if (checkUser) {
        return res.status(400).json(new ApiError("Email already exists", 400));
      }

      const checkEmail = await Otp.findOne({ email: email });

      if (checkEmail) {
        await Otp.deleteOne({ email: email });
      }

      const generateOtp = Math.floor(1000 + Math.random() * 9000);

      const createOtp = await Otp.create({
        email: email,
        otp: generateOtp,
        otpExpire: new Date(Date.now() + 2 * 60 * 1000),
      });

      if (!createOtp) {
        return res.status(500).json(new ApiError("Failed to send otp", 500));
      }

      const mailOption = {
        email: createOtp.email,
        subject: "OTP for email verification",
        message: `<h3>OTP for email verification is ${createOtp.otp}</h3>`,
      };

      await sendEmail(mailOption);
      createOtp.isotpsend = true;
      await createOtp.save({ validateBeforeSave: false });
      return res
        .status(201)
        .json(new ApiResponse(201, {}, "Otp sent successfully"));
    } catch (error) {
      return res.status(500).json(new ApiError(error.message, 500));
    }
  }

  async verifyOtp(req, res) {
    try {
      const { email, otp } = req.body;

      const findOtp = await Otp.findOne({ email: email });

      if (!findOtp.isotpsend) {
        return res.status(400).json(new ApiError("Otp not sent", 400));
      }

      if (findOtp.otp !== Number(otp)) {
        return res.status(400).json(new ApiError("Invalid otp", 400));
      }

      if (findOtp.otpExpire < Date.now()) {
        return res.status(400).json(new ApiError("Otp expired", 400));
      }

      findOtp.isotpsend = false;
      findOtp.otpVerified = true;
      await findOtp.save({ validateBeforeSave: false });

      return res.status(200).json(new ApiResponse(200, {}, "Otp verified"));
    } catch (error) {}
  }

  async register(req, res) {
    try {
      const { name, email, username, password } = req.body;

      const verifyEmail = await Otp.findOne({ email: email });

      if (!verifyEmail) {
        return res
          .status(400)
          .json(new ApiError("Enter the verified email", 400));
      }

      if (!verifyEmail.otpVerified) {
        return res.status(404).json(new ApiError("Otp not verified", 404));
      }

      await Otp.deleteOne({ email: email });

      const checkEmail = await User.findOne({ email: email });
      if (checkEmail) {
        return res.status(400).json(new ApiError("Email already exists", 400));
      }

      const checkUsername = await User.findOne({ username: username });
      if (checkUsername) {
        return res
          .status(400)
          .json(new ApiError("Username already exists", 400));
      }

      const createUser = await User.create({
        name,
        email,
        username,
        password,
        isverified: true,
      });

      if (!createUser) {
        return res
          .status(500)
          .json(new ApiError("Failed to register user", 500));
      }

      return res
        .status(201)
        .json(new ApiResponse(201, {}, "User register successfully"));
    } catch (error) {
      return res.status(500).json(new ApiError(error.message, 500));
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const checkUser = await User.findOne({ email: email });
      if (!checkUser) {
        return res.status(404).json(new ApiError("Email does not exists", 404));
      }

      if (!checkUser.isverified) {
        return res.status(400).json(new ApiError("Email is not verified", 400));
      }

      const comparePassword = await checkUser.comparePassword(password);

      if (!comparePassword) {
        return res.status(400).json(new ApiError("Password is incorrect", 400));
      }

      if (comparePassword) {
        const { accessToken, refreshToken } =
          await generateAccessAndRefereshToken(checkUser._id);

        const isProduction = process.env.NODE_ENV === "production";
        const accessOptions = {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? "none" : "lax",
          domain: isProduction ? "chatapp-a5f7.vercel.app" : "localhost:3000",
          partitioned: isProduction,
          expires: new Date(Date.now() + 15 * 60 * 1000),
          path: "/",
        };

        const refreshOptions = {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? "none" : "lax",
          domain: isProduction ? "chatapp-a5f7.vercel.app" : "localhost:3000",
          partitioned: isProduction,
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          path: "/",
        };

        return res
          .status(200)
          .cookie("accessToken", accessToken, accessOptions)
          .cookie("refreshToken", refreshToken, refreshOptions)
          .json(
            new ApiResponse(
              200,
              { token: accessToken },
              "User login successfully"
            )
          );
      }
    } catch (error) {
      return res.status(500).json(new ApiError(error.message, 500));
    }
  }

  async logout(req, res) {
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
    };
    try {
      return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logout successfully"));
    } catch (error) {
      return res.status(500).json(new ApiError(error.message, 500));
    }
  }

  async forgotsendemail(req, res) {
    try {
      const { email } = req.body;

      const checkEmail = await User.findOne({ email: email });
      if (!checkEmail) {
        return res.status(400).json(new ApiError("Enter the valid email", 400));
      }

      const generateToken = checkEmail.getResetPasswordToken();
      await checkEmail.save({ validateBeforeSave: false });

      const resetPasswordUrl = `${process.env.CLIENT_URL}/forgot-password/${generateToken}`;

      const message = `Your Reset Password Token is:- \n\n ${resetPasswordUrl}  \n\n If 
   You've not requested this email then, please ignore it.`;

      await sendEmail({
        email: checkEmail.email,
        subject: "Chatapp Reset Password",
        message: message,
      });

      return res
        .status(200)
        .json(new ApiResponse(200, {}, "Email sent successfully"));
    } catch (error) {
      return res.status(500).json(new ApiError(error.message, 500));
    }
  }

  async forgotrestpassword(req, res) {
    try {
      const { password, confirmPassword } = req.body;
      const { token } = req.params;

      if (password !== confirmPassword) {
        return res
          .status(400)
          .json(new ApiError("Password and confirm password is not same", 400));
      }

      const resetPasswordToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      const checkValidation = await User.findOne({
        resetPasswordToken: resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
      });

      if (!checkValidation) {
        return res.status(400).json(new ApiError("Token is invalid", 400));
      }

      checkValidation.password = confirmPassword;
      checkValidation.resetPasswordToken = undefined;
      checkValidation.resetPasswordExpire = undefined;

      await checkValidation.save({ validateBeforeSave: false });

      return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password reset successfully"));
    } catch (error) {
      return res.status(500).json(new ApiError(error.message, 500));
    }
  }

  async googlesignup(req, res) {
    try {
      const { code } = req.query;

      const googleRes = await oauth2Client.getToken(code);

      if (!googleRes) {
        return res.status(400).json(new ApiError("Invalid token", 400));
      }
      oauth2Client.setCredentials(googleRes.tokens);

      const response = await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
      );
      const data = await response.json();

      const checkEmail = await User.findOne({ email: data.email });

      if (checkEmail) {
        return res
          .status(400)
          .json(new ApiError("Email is already exist", 400));
      }

      const splitedEmail = data?.email.split("@");
      const username = splitedEmail[0];

      const checkUsername = await User.findOne({ username: username });
      if (checkUsername) {
        return res
          .status(400)
          .json(new ApiError("Username is already exist", 400));
      }

      const createuser = await User.create({
        name: data?.name,
        email: data?.email,
        username: username,
        password: data?.id,
        gooleavatar: data?.picture,
        isverified: true,
      });

      if (!createuser) {
        return res.status(500).json(new ApiError("User not created", 500));
      }

      const { accessToken, refreshToken } =
        await generateAccessAndRefereshToken(createuser._id);

      const accessOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        expires: new Date(Date.now() + 15 * 60 * 1000),
      };

      const refreshOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      };

      return res
        .status(200)
        .cookie("accessToken", accessToken, accessOptions)
        .cookie("refreshToken", refreshToken, refreshOptions)
        .json(
          new ApiResponse(
            200,
            { token: accessToken },
            "User signup successfully"
          )
        );
    } catch (error) {
      return res.status(500).json(new ApiError(error.message, 500));
    }
  }

  async googlesignin(req, res) {
    try {
      const { code } = req.query;

      const googleRes = await oauth2Client.getToken(code);

      if (!googleRes) {
        return res.status(400).json(new ApiError("Invalid token", 400));
      }
      oauth2Client.setCredentials(googleRes.tokens);

      const response = await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
      );
      const data = await response.json();

      const checkEmail = await User.findOne({ email: data.email });

      if (!checkEmail) {
        return res
          .status(400)
          .json(new ApiError("User not found with this email", 400));
      }

      const comparePassword = await checkEmail.comparePassword(data?.id);

      if (!comparePassword) {
        return res.status(400).json(new ApiError("Password is incorrect", 400));
      }

      if (comparePassword) {
        const { accessToken, refreshToken } =
          await generateAccessAndRefereshToken(checkEmail._id);

        const accessOptions = {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Lax",
          expires: new Date(Date.now() + 15 * 60 * 1000),
        };

        const refreshOptions = {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Lax",
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        };

        return res
          .status(200)
          .cookie("accessToken", accessToken, accessOptions)
          .cookie("refreshToken", refreshToken, refreshOptions)
          .json(
            new ApiResponse(
              200,
              { token: accessToken },
              "User login successfully"
            )
          );
      }
    } catch (error) {
      return res.status(500).json(new ApiError(error.message, 500));
    }
  }

  async refresToken(req, res) {
    try {
      const refreshToken = req?.cookies?.refreshToken;

      if (!refreshToken) {
        return res.status(401).json(new ApiError("Unauthorized", 401));
      }

      const decode = jwt.verify(refreshToken, process.env.REFRESH_SECRET_TOKEN);

      if (!decode) {
        return res.status(401).json(new ApiError("Invalid token", 401));
      }

      const user = await User.findById(decode.id);

      if (!user) {
        return res.status(404).json(new ApiError("User not found", 404));
      }

      const { accessToken } = await generateAccessAndRefereshToken(user._id);

      const accessOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        expires: new Date(Date.now() + 15 * 60 * 1000),
      };

      return res
        .status(200)
        .cookie("accessToken", accessToken, accessOptions)
        .json(
          new ApiResponse(
            200,
            { token: accessToken },
            "Reset token successfully"
          )
        );
    } catch (error) {
      return res.status(500).json(new ApiError(error.message, 500));
    }
  }
}

module.exports = new authController();
