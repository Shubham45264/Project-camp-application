import { Router } from "express";
import {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/task.controllers.js";

import { validate } from "../middlewares/validator.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// All task routes require auth
router.use(verifyJWT);

// Get tasks for a project
router.route("/project/:projectId").get(getTasks);

// Create a task for a project
router.route("/:projectId").post(createTask);

// Task CRUD by taskId
router.route("/:taskId").get(getTaskById).put(updateTask).delete(deleteTask);

export default router;
