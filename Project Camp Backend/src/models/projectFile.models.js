import mongoose, { Schema } from "mongoose";

const projectFileSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
    },
    localPath: {
      type: String,
      required: true,
    },
    type: {
      type: String, // e.g., 'application/pdf', 'image/png'
    },
    size: {
      type: Number, // in bytes
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
  },
  { timestamps: true }
);

export const ProjectFile = mongoose.model("ProjectFile", projectFileSchema);
