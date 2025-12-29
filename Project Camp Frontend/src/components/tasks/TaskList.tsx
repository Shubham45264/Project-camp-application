import TaskItem, { Task } from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: string) => void;
  onStatusChange: (
    id: string,
    status: Task["status"]
  ) => void;
}

const STATUSES: Task["status"][] = [
  "TODO",
  "IN_PROGRESS",
  "DONE",
];

const TaskList = ({
  tasks,
  onDelete,
  onStatusChange,
}: TaskListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {STATUSES.map((status) => (
        <div key={status}>
          <h3 className="font-semibold mb-3">{status}</h3>

          <div className="space-y-3">
            {tasks
              .filter((t) => t.status === status)
              .map((task) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  onDelete={onDelete}
                  onStatusChange={onStatusChange}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
