// src/pages/projects/ProjectCard.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Users,
  Calendar,
  ChevronRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getProjectById } from "@/services/project.api";

export interface Project {
  _id: string;
  name: string;
  description: string;
  members?: number;
  createdAt?: string;
  createdBy?: string;
}

export interface TaskStats {
  todo: number;
  inProgress: number;
  done: number;
  progress?: number;
}

interface Props {
  project: Project;
  stats?: TaskStats;
}

const ProjectCard = ({ project, stats }: Props) => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [projectDetails, setProjectDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const formattedDate = project.createdAt
    ? new Date(project.createdAt).toLocaleDateString()
    : "N/A";

  const handleOpenDetails = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setModalOpen(true);
    setLoadingDetails(true);
    try {
      const details = await getProjectById(project._id);
      setProjectDetails(details);
    } catch (err) {
      console.error("Failed to fetch project details:", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleNavigateToProject = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/project/${project._id}`);
    setModalOpen(false);
  };

  const totalTasks = (stats?.todo || 0) + (stats?.inProgress || 0) + (stats?.done || 0);

  // Use backend provided progress, or calculate weighted average (In Progress = 50%, Done = 100%)
  const completionPercent = stats?.progress ?? (
    totalTasks > 0
      ? Math.round((((stats?.done || 0) * 1 + (stats?.inProgress || 0) * 0.5) / totalTasks) * 100)
      : 0
  );

  return (
    <>
      <div
        onClick={handleOpenDetails}
        className="group relative overflow-hidden rounded-lg border border-border/50 bg-gradient-to-br from-card/50 to-card/30 p-6 cursor-pointer transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
      >
        {/* Background gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                {project.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {project.description || "No description"}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-background/50 rounded-lg p-2 border border-border/30">
              <div className="text-xs text-muted-foreground">TODO</div>
              <div className="text-lg font-bold text-yellow-500">
                {stats?.todo ?? 0}
              </div>
            </div>
            <div className="bg-background/50 rounded-lg p-2 border border-border/30">
              <div className="text-xs text-muted-foreground">IN PROGRESS</div>
              <div className="text-lg font-bold text-blue-500">
                {stats?.inProgress ?? 0}
              </div>
            </div>
            <div className="bg-background/50 rounded-lg p-2 border border-border/30">
              <div className="text-xs text-muted-foreground">DONE</div>
              <div className="text-lg font-bold text-green-500">
                {stats?.done ?? 0}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {totalTasks > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-muted-foreground">
                  Progress
                </span>
                <span className="text-xs font-bold text-primary">
                  {completionPercent}%
                </span>
              </div>
              <div className="h-2 bg-background/50 rounded-full overflow-hidden border border-border/30">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Meta Information */}
          <div className="flex items-center justify-between pt-3 border-t border-border/20">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="w-3.5 h-3.5" />
                <span>{project.members || 1}</span>
              </div>
            </div>
            <BarChart3 className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>
      </div>

      {/* Project Details Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {loadingDetails ? "Loading..." : projectDetails?.name || project.name}
            </DialogTitle>
          </DialogHeader>

          {loadingDetails ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Loading project details...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h4 className="text-sm font-semibold mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">
                  {projectDetails?.description || project.description || "No description provided"}
                </p>
              </div>

              {/* Project Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background/50 rounded-lg p-4 border border-border/30">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    <h4 className="text-sm font-semibold">Tasks</h4>
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {totalTasks}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats?.done || 0} completed
                  </p>
                </div>

                <div className="bg-background/50 rounded-lg p-4 border border-border/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-primary" />
                    <h4 className="text-sm font-semibold">Members</h4>
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {project.members || 1}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    team members
                  </p>
                </div>
              </div>

              {/* Task Breakdown */}
              <div>
                <h4 className="text-sm font-semibold mb-3">Task Status</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-8 bg-yellow-600/30 border border-yellow-500/50 rounded flex items-center justify-center">
                      <span className="text-xs font-bold text-yellow-400">
                        TODO
                      </span>
                    </div>
                    <div className="flex-1 h-2 bg-background/50 rounded-full overflow-hidden border border-border/30">
                      <div
                        className="h-full bg-yellow-500"
                        style={{
                          width: `${totalTasks > 0 ? (stats?.todo || 0) / totalTasks * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold w-8">
                      {stats?.todo || 0}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-20 h-8 bg-blue-600/30 border border-blue-500/50 rounded flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-400">
                        IN PROGRESS
                      </span>
                    </div>
                    <div className="flex-1 h-2 bg-background/50 rounded-full overflow-hidden border border-border/30">
                      <div
                        className="h-full bg-blue-500"
                        style={{
                          width: `${totalTasks > 0 ? (stats?.inProgress || 0) / totalTasks * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold w-8">
                      {stats?.inProgress || 0}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-20 h-8 bg-green-600/30 border border-green-500/50 rounded flex items-center justify-center">
                      <span className="text-xs font-bold text-green-400">
                        DONE
                      </span>
                    </div>
                    <div className="flex-1 h-2 bg-background/50 rounded-full overflow-hidden border border-border/30">
                      <div
                        className="h-full bg-green-500"
                        style={{
                          width: `${totalTasks > 0 ? (stats?.done || 0) / totalTasks * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold w-8">
                      {stats?.done || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleNavigateToProject}
                  className="flex-1"
                >
                  Open Project
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>)}        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectCard;
