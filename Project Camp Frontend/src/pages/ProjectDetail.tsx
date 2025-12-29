import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

import { getProjectById } from "@/services/project.api";
import {
  getTasksByProject,
  createTask,
  deleteTask,
  updateTaskStatus,
} from "@/services/task.api";

import TaskList from "@/components/tasks/TaskList";
import AddTaskModal from "@/components/tasks/AddTaskModal";

/* ---------------- TYPES ---------------- */
interface Task {
  _id: string;
  title: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
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

  /* -------- LOAD PROJECT + TASKS -------- */
  useEffect(() => {
    if (!projectId) return;

    const load = async () => {
      try {
        const projectData = await getProjectById(projectId);
        const taskData = await getTasksByProject(projectId);

        setProject(projectData);
        setTasks(taskData);
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

  /* -------- UI STATES -------- */
  if (loading) return <p className="p-6">Loading...</p>;
  if (!project) return <p className="p-6">Project not found</p>;

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">{project.name}</h1>
          <p className="text-muted-foreground">
            {project.description}
          </p>
        </div>

        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* TASK LIST */}
      <TaskList
        tasks={tasks}
        onDelete={handleDeleteTask}
        onStatusChange={handleStatusChange}
      />

      {/* ADD TASK MODAL */}
      <AddTaskModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddTask}
      />
    </div>
  );
};

export default ProjectDetail;
