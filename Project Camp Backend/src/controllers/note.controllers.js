import mongoose from "mongoose";
import { ProjectNote } from "../models/note.models.js";
import { Project } from "../models/project.models.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

const createNote = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { content } = req.body;

    if (!content) {
        throw new ApiError(400, "Content is required");
    }

    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const note = await ProjectNote.create({
        project: new mongoose.Types.ObjectId(projectId),
        createdBy: new mongoose.Types.ObjectId(req.user._id),
        content,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, note, "Note created successfully"));
});

const getProjectNotes = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const notes = await ProjectNote.find({
        project: new mongoose.Types.ObjectId(projectId),
    })
        .populate("createdBy", "fullName username avatar")
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, notes, "Notes fetched successfully"));
});

const getNoteById = asyncHandler(async (req, res) => {
    const { noteId } = req.params;

    const note = await ProjectNote.findById(noteId).populate(
        "createdBy",
        "fullName username avatar"
    );

    if (!note) {
        throw new ApiError(404, "Note not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, note, "Note fetched successfully"));
});

const updateNote = asyncHandler(async (req, res) => {
    const { noteId } = req.params;
    const { content } = req.body;

    const note = await ProjectNote.findById(noteId);

    if (!note) {
        throw new ApiError(404, "Note not found");
    }

    note.content = content ?? note.content;
    await note.save();

    return res
        .status(200)
        .json(new ApiResponse(200, note, "Note updated successfully"));
});

const deleteNote = asyncHandler(async (req, res) => {
    const { noteId } = req.params;

    const note = await ProjectNote.findById(noteId);

    if (!note) {
        throw new ApiError(404, "Note not found");
    }

    await note.deleteOne();

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Note deleted successfully"));
});

export { createNote, getProjectNotes, getNoteById, updateNote, deleteNote };
