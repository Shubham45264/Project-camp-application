// middlewares/auth.middleware.js
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import { User } from "../models/user.models.js";
import { ProjectMember } from "../models/projectmember.models.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";

/* ================= JWT VERIFICATION ================= */
export const verifyJWT = asyncHandler(async (req, _res, next) => {
  let token = null;

  // Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Cookie fallback
  if (!token && req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw new ApiError(401, "Access token missing");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch {
    throw new ApiError(401, "Invalid or expired access token");
  }

  const user = await User.findById(decoded._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
  );

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  req.user = user;
  next();
});

/* ================= PROJECT PERMISSION ================= */
export const validateProjectPermission = (roles = []) => {
  return asyncHandler(async (req, _res, next) => {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      throw new ApiError(400, "Invalid project ID");
    }

    const membership = await ProjectMember.findOne({
      project: projectId,
      user: req.user._id,
    });

    if (!membership) {
      throw new ApiError(403, "User is not a project member");
    }

    req.user.role = membership.role;

    if (roles.length && !roles.includes(membership.role)) {
      throw new ApiError(403, "Permission denied");
    }

    next();
  });
};
