const API_BASE_URL = import.meta.env.VITE_API_URL;

/* ================= GET TASKS BY PROJECT ================= */
export const getTasksByProject = async (projectId: string) => {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/tasks/project/${projectId}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch tasks");
  }

  return result.data; // Task[]
};

/* ================= CREATE TASK ================= */
export const createTask = async (
  projectId: string,
  data: {
    title: string;
    description?: string;
  }
) => {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/tasks/${projectId}`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create task");
  }

  return result.data;
};

/* ================= DELETE TASK ================= */
export const deleteTask = async (taskId: string) => {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/tasks/${taskId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete task");
  }

  return result.data;
};

/* ================= UPDATE TASK STATUS ================= */
export const updateTaskStatus = async (
  taskId: string,
  status: "TODO" | "IN_PROGRESS" | "DONE"
) => {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/tasks/${taskId}`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update task");
  }

  return result.data;
};
