import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (title: string) => void;
}

const AddTaskModal = ({
  open,
  onClose,
  onAdd,
}: AddTaskModalProps) => {
  const [title, setTitle] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg w-96 border shadow-lg text-card-foreground">
        <h2 className="text-lg font-semibold mb-4">Add Task</h2>

        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          className="mb-4 bg-background text-foreground"
        />

        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              onAdd(title);
              setTitle("");
              onClose();
            }}
            disabled={!title.trim()}
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
