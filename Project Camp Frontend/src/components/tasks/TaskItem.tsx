import { Trash2 } from "lucide-react";

import { RoleGuard } from "@/components/common/RoleGuard";

export interface Task {
  _id: string;
  title: string;
  status: "todo" | "in_progress" | "done";
}

interface TaskItemProps {
  task: Task;
  onDelete: (id: string) => void;
  onStatusChange: (
    id: string,
    status: Task["status"]
  ) => void;
  onClick?: (id: string) => void;
  userRole?: string | null;
}

const TaskItem = ({
  task,
  onDelete,
  onStatusChange,
  onClick,
  userRole,
}: TaskItemProps) => {
  return (
    <div className="flex items-center justify-between border rounded p-3">
      <span
        onClick={() => onClick && onClick(task._id)}
        className="font-medium cursor-pointer hover:underline decoration-dashed"
      >
        {task.title}
      </span>

      <div className="flex gap-2 items-center">
        <select
          value={task.status}
          onChange={(e) =>
            onStatusChange(
              task._id,
              e.target.value as Task["status"]
            )
          }
          className="border rounded px-2 py-1 text-sm bg-background"
        >
          <option value="todo">Todo</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <RoleGuard
          currentRole={userRole || null}
          allowedRoles={["admin", "project_admin"]}
        >
          <button
            onClick={() => onDelete(task._id)}
            className="text-red-500 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </RoleGuard>
      </div>
    </div>
  );
};

export default TaskItem;
