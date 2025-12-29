import { Router } from "express";
import {
  forgotPasswordRequest,
  login,
  logoutUser,
  refreshAccessToken,
  registerUser,
  verifyEmail,
  resetForgotPassword,
  resendEmailVerification,
  getCurrentUser,
  changeCurrentPassword
} from "../controllers/auth.controllers.js";

import { validate } from "../middlewares/validator.middleware.js";

import {
  userLoginValidator,
  userRegisterValidator,
  userForgotPasswordValidator,
  userResetForgotPasswordValidator,
  userChangeCurrentPasswordValidator
} from "../validators/index.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// ---------- PUBLIC ROUTES ----------

// Register
router.route("/register").post(
  userRegisterValidator(),
  validate,
  registerUser
);

// Login
router.route("/login").post(
  userLoginValidator(),
  validate,
  login
);

// Verify Email
router.route("/verify-email/:verificationToken").get(verifyEmail);

// Refresh Access Token
router.route("/refresh-token").post(refreshAccessToken);

// Forgot Password
router.route("/forgot-password").post(
  userForgotPasswordValidator(),
  validate,
  forgotPasswordRequest
);

// Reset Forgotten Password
router.route("/reset-password/:resetToken").post(
  userResetForgotPasswordValidator(),
  validate,
  resetForgotPassword
);

// ---------- PROTECTED ROUTES ----------

// Logout
router.route("/logout").post(logoutUser);

// Get Current User
router.route("/current-user").post(verifyJWT, getCurrentUser);

// Change Password
router
  .route("/change-password")
  .post(
    verifyJWT,
    userChangeCurrentPasswordValidator(),
    validate,
    changeCurrentPassword
  );

// Resend Verification Email
router
  .route("/resend-email-verification")
  .post(verifyJWT, resendEmailVerification);

export default router;
