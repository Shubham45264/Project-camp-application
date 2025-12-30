import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { ProjectFile } from "../models/projectFile.models.js";
import { UserRolesEnum } from "../utils/constants.js";
import mongoose from "mongoose";
import fs from "fs";

const uploadFile = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  if (!req.file) {
    throw new ApiError(400, "No file uploaded");
  }

  const { originalname, mimetype, size, path, filename } = req.file;

  // Construct a public URL. Adjust the base URL as needed for production.
  // For local dev, assuming 'public' is served at root or /Images
  // Since we used ./public/ProjectFiles, and app.js says app.use(express.static("public"));
  // The url should be /ProjectFiles/filename
  const url = `/ProjectFiles/${filename}`;

  const projectFile = await ProjectFile.create({
    name: originalname,
    url: url,
    localPath: path,
    type: mimetype,
    size: size,
    uploadedBy: req.user._id,
    project: projectId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, projectFile, "File uploaded successfully"));
});

const getProjectFiles = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const files = await ProjectFile.find({ project: projectId })
    .populate("uploadedBy", "fullName username avatar")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, files, "Project files fetched successfully"));
});

const deleteFile = asyncHandler(async (req, res) => {
  const { projectId, fileId } = req.params;

  const projectFile = await ProjectFile.findById(fileId);

  if (!projectFile) {
    throw new ApiError(404, "File not found");
  }

  // Permission Check: Admin, Project Admin, or Uploader
  const isUploader = projectFile.uploadedBy.toString() === req.user._id.toString();
  const isAdmin = req.user.role === UserRolesEnum.ADMIN;
  const isProjectAdmin = req.user.role === UserRolesEnum.PROJECT_ADMIN;

  if (!isUploader && !isAdmin && !isProjectAdmin) {
    throw new ApiError(403, "You are not authorized to delete this file");
  }

  // Delete from filesystem
  if (projectFile.localPath && fs.existsSync(projectFile.localPath)) {
    try {
      fs.unlinkSync(projectFile.localPath);
    } catch (error) {
      console.error("Error deleting file from disk:", error);
    }
  }

  await ProjectFile.findByIdAndDelete(fileId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "File deleted successfully"));
});

export { uploadFile, getProjectFiles, deleteFile };
