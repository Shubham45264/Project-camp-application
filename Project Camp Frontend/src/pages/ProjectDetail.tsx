import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Plus, Upload, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

import { getProjectById, getMyProjectRole, addMember } from "@/services/project.api";
import {
  getTasksByProject,
  createTask,
  deleteTask,
  updateTaskStatus,
} from "@/services/task.api";
import { getProjectFiles, uploadFile, deleteFile } from "@/services/file.api";

import TaskList from "@/components/tasks/TaskList";
import AddTaskModal from "@/components/tasks/AddTaskModal";
import { NoteList } from "@/components/notes/NoteList";
import UploadFileModal from "@/components/files/UploadFileModal";
import FileList from "@/components/files/FileList";

import { TaskDetailModal } from "@/components/tasks/TaskDetailModal";
import { RoleGuard } from "@/components/common/RoleGuard";
import { AddMemberModal } from "@/components/projects/AddMemberModal";

/* ---------------- TYPES ---------------- */
interface Task {
  _id: string;
  title: string;
  status: "todo" | "in_progress" | "done";
}

interface Project {
  _id: string;
  name: string;
  description: string;
}

/* ---------------- PAGE ---------------- */
const ProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [activeTab, setActiveTab] = useState("tasks");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { toast } = useToast();

  /* -------- LOAD PROJECT + TASKS + ROLE -------- */
  useEffect(() => {
    if (!projectId) return;

    const load = async () => {
      try {
        const [projectData, taskData, roleData, fileData] = await Promise.all([
          getProjectById(projectId),
          getTasksByProject(projectId),
          getMyProjectRole(projectId),
          getProjectFiles(projectId),
        ]);

        setProject(projectData);
        setTasks(taskData);
        setUserRole(roleData.role);
        setFiles(fileData);
      } catch (e) {
        console.error("Failed to load project data", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [projectId]);

  /* -------- ADD TASK -------- */
  const handleAddTask = async (title: string) => {
    if (!projectId) return;

    try {
      const task = await createTask(projectId, {
        title,
      });

      setTasks((prev) => [...prev, task]);
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Failed to create task");
    }
  };

  /* -------- DELETE TASK -------- */
  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
  };

  /* -------- STATUS CHANGE -------- */
  const handleStatusChange = async (
    taskId: string,
    status: Task["status"]
  ) => {
    const updatedTask = await updateTaskStatus(taskId, status);

    setTasks((prev) =>
      prev.map((t) =>
        t._id === updatedTask._id ? updatedTask : t
      )
    );
  };

  /* -------- INVITE MEMBER -------- */
  const handleInvite = async (email: string, role: "member" | "project_admin") => {
    if (!projectId) return;
    try {
      await addMember(projectId, { email, role });
      toast({
        title: "Member Invited",
        description: `${email} has been added as ${role}.`,
      });
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Failed to add member. Ensure user exists.");
    }
  };

  /* -------- UPLOAD FILE -------- */
  const handleUploadFile = async (file: File) => {
    if (!projectId) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const newFile = await uploadFile(projectId, formData);
      setFiles((prev) => [newFile, ...prev]);
      setShowUploadModal(false);
      toast({
        title: "File Uploaded",
        description: "File has been successfully uploaded.",
      });
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  /* -------- DELETE FILE -------- */
  const handleDeleteFile = async (fileId: string) => {
    if (!projectId) return;

    if (!confirm("Are you sure you want to delete this file?")) return;

    try {
      await deleteFile(projectId, fileId);
      setFiles((prev) => prev.filter((f) => f._id !== fileId));
      toast({
        title: "File Deleted",
        description: "File has been successfully deleted.",
      });
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Failed to delete file");
    }
  };

  /* -------- UI STATES -------- */
  if (loading) return <p className="p-6">Loading...</p>;
  if (!project) return <p className="p-6">Project not found</p>;

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <Button variant="ghost" asChild className="mb-2 pl-0 hover:bg-transparent hover:underline">
            <Link to="/dashboard">
              ← Back to Projects
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold">{project.name}</h1>
          <p className="text-muted-foreground">{project.description}</p>
        </div>

        <div className="flex gap-2">
          {activeTab === "files" && (
            <Button onClick={() => setShowUploadModal(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Upload File
            </Button>
          )}

          <RoleGuard
            currentRole={userRole}
            allowedRoles={["admin", "project_admin"]}
          >
            <Button variant="outline" onClick={() => setShowInviteModal(true)}>
              <UserPlus className="w-4 h-4 mr-2" />
              Invite
            </Button>
          </RoleGuard>

          {activeTab === "tasks" && (
            <RoleGuard
              currentRole={userRole}
              allowedRoles={["admin", "project_admin"]}
            >
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </RoleGuard>
          )}
        </div>
      </div>

      <Tabs defaultValue="tasks" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        <TabsContent value="tasks" className="mt-6">
          <TaskList
            tasks={tasks}
            onDelete={handleDeleteTask}
            onStatusChange={handleStatusChange}
            onTaskClick={setSelectedTaskId}
            userRole={userRole}
          />
        </TabsContent>
        <TabsContent value="notes" className="mt-6">
          <NoteList />
        </TabsContent>
        <TabsContent value="files" className="mt-6">
          <FileList files={files} onDelete={handleDeleteFile} />
        </TabsContent>
      </Tabs>

      {/* ADD TASK MODAL */}
      <AddTaskModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddTask}
      />

      {/* INVITE MODAL */}
      <AddMemberModal
        open={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onAdd={handleInvite}
      />

      {/* UPLOAD FILE MODAL */}
      <UploadFileModal
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUploadFile}
        isUploading={isUploading}
      />

      {/* TASK DETAIL MODAL */}
      <TaskDetailModal
        taskId={selectedTaskId}
        isOpen={!!selectedTaskId}
        onClose={() => setSelectedTaskId(null)}
      />
    </div>
  );
};

export default ProjectDetail;
