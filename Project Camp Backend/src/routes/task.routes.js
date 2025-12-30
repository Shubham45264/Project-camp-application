import { Router } from "express";
import {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  createSubTask,
  updateSubTask,
  deleteSubTask,
} from "../controllers/task.controllers.js";

import { validate } from "../middlewares/validator.middleware.js";
import { createTaskValidator } from "../validators/index.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  validateProjectPermission,
  validateTaskPermission,
  validateSubtaskPermission,
} from "../middlewares/auth.middleware.js";
import { UserRolesEnum } from "../utils/constants.js";

const router = Router();

// All task routes require auth
router.use(verifyJWT);

// Get tasks for a project (Any member)
router.route("/project/:projectId").get(validateProjectPermission(), getTasks);

// Create a task for a project (Admin/Project Admin)
router.route("/:projectId").post(
  validateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN]),
  createTaskValidator(),
  validate,
  createTask
);

// Subtask Routes
// Create Subtask (Admin/Project Admin)
router.route("/:taskId/subtasks").post(
  validateTaskPermission([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN]),
  createSubTask
);

// Update/Delete Subtask
router
  .route("/subtasks/:subtaskId")
  // Update Subtask (Any Member - for status)
  .put(validateSubtaskPermission(), updateSubTask)
  // Delete Subtask (Admin/Project Admin)
  .delete(
    validateSubtaskPermission([
      UserRolesEnum.ADMIN,
      UserRolesEnum.PROJECT_ADMIN,
    ]),
    deleteSubTask
  );

// Task CRUD by taskId
router
  .route("/:taskId")
  // Get Task (Any Member)
  .get(validateTaskPermission(), getTaskById)
  // Update Task (Admin/Project Admin)
  .put(
    validateTaskPermission([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN]),
    updateTask
  )
  // Delete Task (Admin/Project Admin)
  .delete(
    validateTaskPermission([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN]),
    deleteTask
  );

export default router;
