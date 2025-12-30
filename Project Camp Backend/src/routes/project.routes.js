import { Router } from "express";
import {
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
} from "../controllers/project.controllers.js";

import { validate } from "../middlewares/validator.middleware.js";

import {
  createProjectValidator,
  addMembertoProjectValidator,
} from "../validators/index.js";

import {
  verifyJWT,
  validateProjectPermission,
} from "../middlewares/auth.middleware.js";

import { UserRolesEnum } from "../utils/constants.js";

const router = Router();

// All project routes require auth
router.use(verifyJWT);

// ---------------- PROJECT CRUD ----------------
router
  .route("/")
  .get(getProjects)
  .post(
    createProjectValidator(),
    validate,
    createProject
  );

// Check Role
router.route("/:projectId/role").get(getMyProjectRole);

router
  .route("/:projectId")
  .get(getProjectById)
  .put(
    validateProjectPermission([UserRolesEnum.ADMIN]),
    updateProject
  )
  .delete(
    validateProjectPermission([UserRolesEnum.ADMIN]),
    deleteProject
  );

// ---------------- PROJECT MEMBERS ----------------
router
  .route("/:projectId/members")
  .get(getProjectMembers)
  .post(
    validateProjectPermission([UserRolesEnum.ADMIN]),
    addMembertoProjectValidator(),
    validate,
    addMembersToProject
  );

router
  .route("/:projectId/members/:userId")
  .put(
    validateProjectPermission([UserRolesEnum.ADMIN]),
    updateMemberRole
  )
  .delete(
    validateProjectPermission([UserRolesEnum.ADMIN]),
    deleteMember
  );

export default router;
