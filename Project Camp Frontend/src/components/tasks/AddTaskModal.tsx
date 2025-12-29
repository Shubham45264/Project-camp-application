import { useState } from "react";
import { Button } from "@/components/ui/button";

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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-card p-6 rounded-lg w-96">
        <h2 className="text-lg font-semibold mb-4">
          Add Task
        </h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          className="w-full border rounded px-3 py-2 mb-4"
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
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
