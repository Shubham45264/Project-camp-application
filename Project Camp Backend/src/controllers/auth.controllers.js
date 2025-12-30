import { User } from "../models/user.models.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import {
  emailVerificationMailgenContent,
  ForgotPasswordMailgenContent,
  sendEmail,
} from "../utils/mail.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";


// ================= Generate Access + Refresh Tokens =================
const generateAccessandRefreshTokens = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};


// ================= Register =================
const registerUser = asyncHandler(async (req, res) => {
  console.log('registerUser body:', req.body);
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  const user = await User.create({
    email,
    username,
    password,
    isEmailVerified: false,
  });

  console.log('User created id:', user._id.toString());

  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });

  await sendEmail({
    email: user.email,
    subject: "Verify your email",
    mailgenContent: emailVerificationMailgenContent(
      user.username,
      `${process.env.VERIFY_EMAIL_REDIRECT_URL}/${unHashedToken}`
    ),
  });

  const createdUser = await User.findById(user._id)
    .select(
      "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
    )
    .lean();

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        user: createdUser,
        verifyToken: unHashedToken, // remove later
      },
      "User registered successfully. Verification email sent"
    )
  );
});


// ================= Login =================
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) throw new ApiError(400, "Email is required");

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(401, "Invalid credentials");

  const { accessToken, refreshToken } =
    await generateAccessandRefreshTokens(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
  );

  const options = {
    httpOnly: true,
    secure: false, // true in production
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});


// ================= Logout =================

const logoutUser = asyncHandler(async (req, res) => {
  const options = { httpOnly: true, secure: false, path: "/" };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({ message: "User logged out successfully" });
});



// ================= Current User =================
const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponse(200, req.user, "Current user fetched successfully")
    );
});


// ================= Verify Email =================
const verifyEmail = asyncHandler(async (req, res) => {
  const { verificationToken } = req.params;

  if (!verificationToken)
    throw new ApiError(400, "Email verification token missing");

  const hashedToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpiry: { $gt: Date.now() },
  });

  if (!user) throw new ApiError(400, "Token invalid or expired");

  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;
  user.isEmailVerified = true;

  await user.save({ validateBeforeSave: false });

  return res.status(200).json(
    new ApiResponse(
      200,
      { isEmailVerified: true },
      "Email verified successfully"
    )
  );
});


// ================= Resend Email Verification =================
const resendEmailVerification = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) throw new ApiError(404, "User doesn't exist");

  if (user.isEmailVerified)
    throw new ApiError(409, "Email already verified");

  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });

  await sendEmail({
    email: user.email,
    subject: "Verify your email",
    mailgenContent: emailVerificationMailgenContent(
      user.username,
      `${process.env.VERIFY_EMAIL_REDIRECT_URL}/${unHashedToken}`
    ),
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      { verifyToken: unHashedToken }, // remove later
      "Verification email sent successfully"
    )
  );
});


// ================= Refresh Access Token =================
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingrefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingrefreshToken)
    throw new ApiError(401, "Unauthorized access");

  try {
    const decodedToken = jwt.verify(
      incomingrefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);
    if (!user) throw new ApiError(401, "Invalid refresh token");

    if (incomingrefreshToken !== user.refreshToken)
      throw new ApiError(401, "Refresh token expired or used");

    const options = { httpOnly: true, secure: false };

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessandRefreshTokens(user._id);

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, "Invalid refresh token");
  }
});


// ================= Forgot Password =================
const forgotPasswordRequest = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User doesn't exist");
  }

  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  user.forgotPasswordToken = hashedToken;
  user.forgotPasswordExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });

  const emailResponse = await sendEmail({
    email: user.email,
    subject: "Password reset request",
    mailgenContent: ForgotPasswordMailgenContent(
      user.username,
      `${process.env.FORGOT_PASSWORD_REDIRECT_URL}/${unHashedToken}`
    ),
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      (emailResponse && emailResponse.mockLink) ? { mockLink: emailResponse.mockLink } : {},
      "Password reset request sent successfully"
    )
  );
});


// ================= Reset Forgot Password =================
const resetForgotPassword = asyncHandler(async (req, res) => {
  const { resetToken } = req.params;
  const { newPassword } = req.body;

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await User.findOne({
    forgotPasswordToken: hashedToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Token is invalid or expired");
  }

  user.forgotPasswordExpiry = undefined;
  user.forgotPasswordToken = undefined;
  user.password = newPassword;

  await user.save({ validateBeforeSave: false });

  return res.status(200).json(
    new ApiResponse(
      200,
      {},
      "Password reset successfully"
    )
  );
});


// ================= Change Current Password =================
const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);

  const isPasswordValid = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid old Password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(
    new ApiResponse(
      200,
      {},
      "Password changed successfully"
    )
  );
});


// ================= Exports =================
export {
  registerUser,
  login,
  logoutUser,
  getCurrentUser,
  verifyEmail,
  resendEmailVerification,
  refreshAccessToken,
  forgotPasswordRequest,
  resetForgotPassword,
  changeCurrentPassword,
};
