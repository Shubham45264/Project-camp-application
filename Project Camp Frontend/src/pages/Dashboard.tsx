import { useEffect, useState, useCallback } from "react";
import { Plus, LogOut, Tent, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, useLocation, Link } from "react-router-dom";

import { getProjects } from "@/services/project.api";
import { getTasksByProject } from "@/services/task.api";

import ProjectCard, {
  Project,
  TaskStats,
} from "@/pages/projects/ProjectCard";

/* ---------------- TYPES ---------------- */
interface Task {
  _id: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
}

/* ---------------- DASHBOARD ---------------- */
const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [projects, setProjects] = useState<Project[]>([]);
  const [taskStats, setTaskStats] = useState<Record<string, TaskStats>>({});
  const [loading, setLoading] = useState(true);

  // Only used for UPDATE button
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );

  /* -------- LOAD PROJECTS -------- */
  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      // Extract the project object from each item since backend returns { project: {...}, role: "..." }
      const projectsData = data.map((item: any) => item.project || item);
      setProjects(projectsData);
    } catch (error: any) {
      alert(error.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // Refetch when returning from create/edit with state.refresh
  useEffect(() => {
    if (location.state?.refresh) {
      loadProjects();
    }
  }, [location, loadProjects]);

  /* -------- LOAD TASK STATS -------- */
  useEffect(() => {
    if (!projects.length) return;

    const loadTaskStats = async () => {
      const statsMap: Record<string, TaskStats> = {};

      await Promise.all(
        projects.map(async (project) => {
          try {
            const tasks: Task[] = await getTasksByProject(project._id);

            statsMap[project._id] = {
              todo: tasks.filter((t) => t.status === "TODO").length,
              inProgress: tasks.filter(
                (t) => t.status === "IN_PROGRESS"
              ).length,
              done: tasks.filter((t) => t.status === "DONE").length,
            };
          } catch {
            statsMap[project._id] = {
              todo: 0,
              inProgress: 0,
              done: 0,
            };
          }
        })
      );

      setTaskStats(statsMap);
    };

    loadTaskStats();
  }, [projects]);

  /* -------- LOGOUT -------- */
  const handleLogout = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 border-r bg-card/50 flex flex-col">
        <div className="h-16 px-6 border-b flex items-center gap-2">
          <Tent className="w-5 h-5 text-primary" />
          <span className="font-semibold text-lg">
            Project<span className="text-primary">Camp</span>
          </span>
        </div>

        <div className="mt-auto p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex gap-2 items-center text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 flex flex-col">
        {/* HEADER */}
        <header className="h-16 px-6 border-b flex justify-between items-center">
          <h1 className="text-xl font-semibold">Projects</h1>

          <div className="flex gap-3">
            <Input placeholder="Search projects..." className="w-64" />

            <Button 
              variant="outline"
              onClick={() => {
                setLoading(true);
                loadProjects();
              }}
            >
              Refresh
            </Button>

            <Button variant="hero" asChild>
              <Link to="/projects/new">
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Link>
            </Button>

            <Button
              variant="secondary"
              disabled={!selectedProjectId}
              onClick={() =>
                selectedProjectId &&
                navigate(`/projects/${selectedProjectId}/edit`)
              }
            >
              <Pencil className="w-4 h-4 mr-2" />
              Update
            </Button>
          </div>
        </header>

        {/* CONTENT */}
        <div className="flex-1 p-6">
          {loading ? (
            <p className="text-muted-foreground">Loading projects…</p>
          ) : projects.length === 0 ? (
            <p className="text-muted-foreground">No projects found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {projects.map((project) => (
                <div
                  key={project._id}
                  onClick={() => setSelectedProjectId(project._id)}
                >
                  <ProjectCard
                    project={project}
                    stats={
                      taskStats[project._id] ?? {
                        todo: 0,
                        inProgress: 0,
                        done: 0,
                      }
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
