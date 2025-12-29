import { motion } from "framer-motion";
import { 
  MoreHorizontal, 
  Plus, 
  Circle, 
  Clock, 
  CheckCircle2,
  User,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/landing/Footer"; // adjust path if needed

const tasks = {
  todo: [
    { id: 1, title: "Design system documentation", assignee: "Alex", priority: "high" },
    { id: 2, title: "API endpoint review", assignee: "Jordan", priority: "medium" },
  ],
  inProgress: [
    { id: 3, title: "User authentication flow", assignee: "Sam", priority: "high" },
    { id: 4, title: "Dashboard components", assignee: "Taylor", priority: "medium" },
  ],
  done: [
    { id: 5, title: "Project setup", assignee: "Alex", priority: "low" },
    { id: 6, title: "Database schema", assignee: "Jordan", priority: "high" },
  ],
};

const TaskCard = ({ task, status }: { task: typeof tasks.todo[0]; status: string }) => {
  const priorityColors = {
    high: "bg-destructive/20 text-destructive",
    medium: "bg-status-todo/20 text-status-todo",
    low: "bg-muted text-muted-foreground",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -2 }}
      className="p-4 rounded-lg bg-card border border-border hover:border-primary/30 transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-medium text-sm text-foreground">{task.title}</h4>
        <button className="p-1 rounded hover:bg-secondary transition-colors">
          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
      <div className="flex items-center justify-between">
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityColors[task.priority as keyof typeof priorityColors]}`}>
          {task.priority}
        </span>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>Dec 25</span>
          </div>
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-3 h-3 text-primary" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Column = ({ 
  title, 
  icon: Icon, 
  color, 
  tasks: columnTasks,
  status 
}: { 
  title: string; 
  icon: React.ElementType; 
  color: string;
  tasks: typeof tasks.todo;
  status: string;
}) => (
  <div className="flex-1 min-w-[280px]">
    <div className="flex items-center justify-between mb-4 px-1">
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4`} style={{ color: `hsl(var(--${color}))` }} />
        <span className="font-medium text-sm text-foreground">{title}</span>
        <span className="px-2 py-0.5 rounded-full bg-secondary text-xs text-muted-foreground">
          {columnTasks.length}
        </span>
      </div>
      <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
        <Plus className="w-4 h-4 text-muted-foreground" />
      </button>
    </div>
    <div className="space-y-3">
      {columnTasks.map((task) => (
        <TaskCard key={task.id} task={task} status={status} />
      ))}
    </div>
  </div>
);

export function Preview() {
  return (
    <>
      <section className="py-24 relative">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Visualize your
              <span className="gradient-text"> workflow</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Drag and drop tasks across columns. See progress at a glance 
              with our intuitive Kanban board.
            </p>
          </motion.div>

          {/* Kanban Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Glow Effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-3xl opacity-30" />
            
            {/* Board Container */}
            <div className="relative glass-card p-6 md:p-8 rounded-2xl overflow-hidden">
              {/* Board Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <div>
                  <h3 className="font-display font-semibold text-lg text-foreground">Project Alpha</h3>
                  <p className="text-sm text-muted-foreground">Sprint 3 - Week 2</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div 
                        key={i}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 border-2 border-card flex items-center justify-center"
                      >
                        <User className="w-4 h-4 text-primary" />
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">+5 more</span>
                </div>
              </div>

              {/* Columns */}
              <div className="flex gap-6 overflow-x-auto pb-4">
                <Column 
                  title="To Do" 
                  icon={Circle} 
                  color="status-todo" 
                  tasks={tasks.todo}
                  status="todo"
                />
                <Column 
                  title="In Progress" 
                  icon={Clock} 
                  color="status-progress" 
                  tasks={tasks.inProgress}
                  status="inProgress"
                />
                <Column 
                  title="Done" 
                  icon={CheckCircle2} 
                  color="status-done" 
                  tasks={tasks.done}
                  status="done"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
}
