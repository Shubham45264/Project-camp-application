import { Trash2 } from "lucide-react";

export interface Task {
  _id: string;
  title: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
}

interface TaskItemProps {
  task: Task;
  onDelete: (id: string) => void;
  onStatusChange: (
    id: string,
    status: Task["status"]
  ) => void;
}

const TaskItem = ({
  task,
  onDelete,
  onStatusChange,
}: TaskItemProps) => {
  return (
    <div className="flex items-center justify-between border rounded p-3">
      <span>{task.title}</span>

      <div className="flex gap-2 items-center">
        <select
          value={task.status}
          onChange={(e) =>
            onStatusChange(
              task._id,
              e.target.value as Task["status"]
            )
          }
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="TODO">Todo</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>

        <button
          onClick={() => onDelete(task._id)}
          className="text-red-500 hover:text-red-600"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
