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

/* ================= TASK PERMISSION ================= */
export const validateTaskPermission = (roles = []) => {
  return asyncHandler(async (req, _res, next) => {
    const { taskId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      throw new ApiError(400, "Invalid task ID");
    }

    // Dynamic import to avoid circular dependency if models import this file
    const { Task } = await import("../models/task.models.js");

    const task = await Task.findById(taskId);
    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    const membership = await ProjectMember.findOne({
      project: task.project,
      user: req.user._id,
    });

    if (!membership) {
      throw new ApiError(403, "User is not a project member");
    }

    if (roles.length && !roles.includes(membership.role)) {
      throw new ApiError(403, "Permission denied");
    }

    req.projectMember = membership;
    next();
  });
};

/* ================= SUBTASK PERMISSION ================= */
export const validateSubtaskPermission = (roles = []) => {
  return asyncHandler(async (req, _res, next) => {
    const { subtaskId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(subtaskId)) {
      throw new ApiError(400, "Invalid subtask ID");
    }

    const { Subtask } = await import("../models/subtask.models.js");
    const { Task } = await import("../models/task.models.js");

    const subtask = await Subtask.findById(subtaskId);
    if (!subtask) {
      throw new ApiError(404, "Subtask not found");
    }

    const task = await Task.findById(subtask.task);
    if (!task) {
      throw new ApiError(404, "Parent task not found");
    }

    const membership = await ProjectMember.findOne({
      project: task.project,
      user: req.user._id,
    });

    if (!membership) {
      throw new ApiError(403, "User is not a project member");
    }

    if (roles.length && !roles.includes(membership.role)) {
      throw new ApiError(403, "Permission denied");
    }

    req.projectMember = membership;
    next();
  });
};
