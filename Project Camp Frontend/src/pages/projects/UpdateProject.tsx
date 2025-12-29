import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useParams } from "react-router-dom";
import {
  updateProject,
  getProjectById,
} from "@/services/project.api";

const UpdateProject = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  /* -------- LOAD PROJECT -------- */
  useEffect(() => {
    if (!id) {
      navigate("/dashboard");
      return;
    }

    const loadProject = async () => {
      try {
        const project = await getProjectById(id);
        setForm({
          name: project.name,
          description: project.description || "",
        });
      } catch (error: any) {
        alert(error.message || "Failed to load project");
        navigate("/dashboard");
      } finally {
        setPageLoading(false);
      }
    };

    loadProject();
  }, [id, navigate]);

  /* -------- UPDATE -------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Project name is required");
      return;
    }

    try {
      setLoading(true);

      await updateProject(id!, {
        name: form.name,
        description: form.description,
      });

      navigate("/dashboard");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading project…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-lg p-8"
      >
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <h1 className="text-2xl font-display font-semibold mb-6">
          Update Project
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label>Project Name</Label>
            <Input
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
            />
          </div>

          <Button
            type="submit"
            variant="hero"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Update Project
              </>
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default UpdateProject;
