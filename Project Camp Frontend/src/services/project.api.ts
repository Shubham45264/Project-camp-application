const API_BASE_URL = import.meta.env.VITE_API_URL;

/* ================= GET PROJECTS ================= */
export const getProjects = async () => {
  const response = await fetch(`${API_BASE_URL}/api/v1/projects`, {
    method: "GET",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch projects");
  }

  return result.data;
};

/* ================= GET PROJECT BY ID ================= */
export const getProjectById = async (projectId: string) => {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/projects/${projectId}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch project");
  }

  return result.data;
};

/* ================= CREATE PROJECT ================= */
export const createProject = async (data: {
  name: string;
  description?: string;
}) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/projects`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create project");
  }

  return result.data;
};

/* ================= UPDATE PROJECT ================= */
export const updateProject = async (
  projectId: string,
  data: { name: string; description?: string }
) => {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/projects/${projectId}`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update project");
  }

  return result.data;
};
