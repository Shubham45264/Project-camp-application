import { useEffect, useState } from "react";
import { getProjects } from "@/services/project.api";

type ProjectItem = {
  project: {
    _id: string;
    name: string;
    description: string;
    members: number;
  };
  role: string;
};

const Projects = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <p>Loading projects...</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Projects</h1>

      {projects.map((item) => (
        <div
          key={item.project._id}
          className="border p-4 rounded"
        >
          <h2 className="font-semibold">{item.project.name}</h2>
          <p>{item.project.description}</p>
          <p className="text-sm text-muted-foreground">
            Members: {item.project.members} | Role: {item.role}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Projects;