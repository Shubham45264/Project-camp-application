import TaskItem, { Task } from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: string) => void;
  onStatusChange: (
    id: string,
    status: Task["status"]
  ) => void;
  onTaskClick?: (id: string) => void;
  userRole?: string | null;
}

const STATUSES: Task["status"][] = [
  "todo",
  "in_progress",
  "done",
];

const TaskList = ({
  tasks,
  onDelete,
  onStatusChange,
  onTaskClick,
  userRole,
}: TaskListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {STATUSES.map((status) => (
        <div key={status}>
          <h3 className="font-semibold mb-3">{status.toUpperCase().replace('_', ' ')}</h3>

          <div className="space-y-3">
            {tasks
              .filter((t) => t.status === status)
              .map((task) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  onDelete={onDelete}
                  onStatusChange={onStatusChange}
                  onClick={onTaskClick}
                  userRole={userRole}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
