import { Router } from "express";
import {
    createNote,
    deleteNote,
    getNoteById,
    getProjectNotes,
    updateNote,
} from "../controllers/note.controllers.js";
import { verifyJWT, validateProjectPermission } from "../middlewares/auth.middleware.js";
import { UserRolesEnum } from "../utils/constants.js";

const router = Router();

// All routes require authentication
router.use(verifyJWT);

// Routes with /:projectId
router
    .route("/:projectId")
    .get(validateProjectPermission(), getProjectNotes)
    .post(validateProjectPermission(), createNote);

// Routes with /:projectId/n/:noteId
router
    .route("/:projectId/n/:noteId")
    .get(validateProjectPermission(), getNoteById)
    .put(validateProjectPermission([UserRolesEnum.ADMIN]), updateNote)
    .delete(validateProjectPermission([UserRolesEnum.ADMIN]), deleteNote);

export default router;
