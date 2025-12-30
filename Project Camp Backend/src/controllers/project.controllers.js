import { User } from "../models/user.models.js";
import { Project } from "../models/project.models.js";
import { ProjectMember } from "../models/projectmember.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import mongoose from "mongoose";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";

const getProjects = asyncHandler(async (req, res) => {
  const { search } = req.query;

  const projects = await ProjectMember.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "projects",
        localField: "project",
        foreignField: "_id",
        as: "project",
        pipeline: [
          {
            $lookup: {
              from: "projectmembers",
              localField: "_id",
              foreignField: "project",
              as: "projectmembers",
            },
          },
          {
            $addFields: {
              members: {
                $size: "$projectmembers",
              },
            },
          },
        ],
      },
    },
    {
      $unwind: "$project",
    },
    // Search Filter
    ...(search
      ? [
        {
          $match: {
            "project.name": { $regex: search, $options: "i" },
          },
        },
      ]
      : []),
    // Lookup Tasks for Stats
    {
      $lookup: {
        from: "tasks",
        localField: "project._id",
        foreignField: "project",
        as: "tasks",
      },
    },
    {
      $addFields: {
        totalTasks: { $size: "$tasks" },
        todoTasks: {
          $size: {
            $filter: {
              input: "$tasks",
              as: "task",
              cond: { $eq: ["$$task.status", "todo"] },
            },
          },
        },
        inProgressTasks: {
          $size: {
            $filter: {
              input: "$tasks",
              as: "task",
              cond: { $eq: ["$$task.status", "in_progress"] },
            },
          },
        },
        doneTasks: {
          $size: {
            $filter: {
              input: "$tasks",
              as: "task",
              cond: { $eq: ["$$task.status", "done"] },
            },
          },
        },
      },
    },
    {
      $addFields: {
        progress: {
          $cond: {
            if: { $eq: ["$totalTasks", 0] },
            then: 0,
            else: {
              $multiply: [
                {
                  $divide: [
                    {
                      $add: [
                        { $multiply: ["$inProgressTasks", 0.5] },
                        { $multiply: ["$doneTasks", 1] },
                      ],
                    },
                    "$totalTasks",
                  ],
                },
                100,
              ],
            },
          },
        },
      },
    },
    {
      $project: {
        project: {
          _id: 1,
          name: 1,
          description: 1,
          members: 1,
          createdAt: 1,
          createdBy: 1,
        },
        role: 1,
        stats: {
          todo: "$todoTasks",
          inProgress: "$inProgressTasks",
          done: "$doneTasks",
          total: "$totalTasks",
          progress: { $round: ["$progress", 0] },
        },
        _id: 0,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, projects, "Projects fetched successfully"));
});

const getProjectById = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project fetched successfully"));
});

const createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const project = await Project.create({
    name,
    description,
    createdBy: new mongoose.Types.ObjectId(req.user._id),
  });

  await ProjectMember.create({
    user: new mongoose.Types.ObjectId(req.user._id),
    project: new mongoose.Types.ObjectId(project._id),
    role: UserRolesEnum.ADMIN,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, project, "Project created Successfully"));
});

const updateProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const { projectId } = req.params;

  const project = await Project.findByIdAndUpdate(
    projectId,
    {
      name,
      description,
    },
    { new: true },
  );

  if (!project) {
    throw new ApiError(404, "Project not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project updated successfully"));
});

const deleteProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findByIdAndDelete(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project deleted successfully"));
});

const addMembersToProject = asyncHandler(async (req, res) => {
  const { email, role } = req.body;
  const { projectId } = req.params;
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  await ProjectMember.findOneAndUpdate(
    {
      user: new mongoose.Types.ObjectId(user._id),
      project: new mongoose.Types.ObjectId(projectId),
    },
    {
      user: new mongoose.Types.ObjectId(user._id),
      project: new mongoose.Types.ObjectId(projectId),
      role: role,
    },
    {
      new: true,
      upsert: true,
    },
  );

  return res
    .status(201)
    .json(new ApiResponse(201, {}, "Project member added successfully"));
});

const getProjectMembers = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const projectMembers = await ProjectMember.aggregate([
    {
      $match: {
        project: new mongoose.Types.ObjectId(projectId),
      },
    },

    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        user: {
          $arrayElemAt: ["$user", 0],
        },
      },
    },
    {
      $project: {
        project: 1,
        user: 1,
        role: 1,
        createdAt: 1,
        updatedAt: 1,
        _id: 0,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, projectMembers, "Project members fetched"));
});

const updateMemberRole = asyncHandler(async (req, res) => {
  const { projectId, userId } = req.params;
  const { newRole } = req.body;

  if (!AvailableUserRole.includes(newRole)) {
    throw new ApiError(400, "Invalid Role");
  }

  let projectMember = await ProjectMember.findOne({
    project: new mongoose.Types.ObjectId(projectId),
    user: new mongoose.Types.ObjectId(userId),
  });

  if (!projectMember) {
    throw new ApiError(400, "Project member not found");
  }

  projectMember = await ProjectMember.findByIdAndUpdate(
    projectMember._id,
    {
      role: newRole,
    },
    { new: true },
  );

  if (!projectMember) {
    throw new ApiError(400, "Project member not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        projectMember,
        "Project member role updated successfully",
      ),
    );
});

const deleteMember = asyncHandler(async (req, res) => {
  const { projectId, userId } = req.params;

  let projectMember = await ProjectMember.findOne({
    project: new mongoose.Types.ObjectId(projectId),
    user: new mongoose.Types.ObjectId(userId),
  });

  if (!projectMember) {
    throw new ApiError(400, "Project member not found");
  }

  projectMember = await ProjectMember.findByIdAndDelete(projectMember._id);

  if (!projectMember) {
    throw new ApiError(400, "Project member not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        projectMember,
        "Project member deleted successfully",
      ),
    );
});

const getMyProjectRole = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const projectMember = await ProjectMember.findOne({
    project: new mongoose.Types.ObjectId(projectId),
    user: new mongoose.Types.ObjectId(req.user._id),
  });

  if (!projectMember) {
    throw new ApiError(403, "Not a member of this project");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { role: projectMember.role }, "Role fetched"));
});

export {
  addMembersToProject,
  createProject,
  deleteMember,
  getProjects,
  getProjectById,
  getProjectMembers,
  updateProject,
  deleteProject,
  updateMemberRole,
  getMyProjectRole,
};
