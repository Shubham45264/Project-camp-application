import { motion } from "framer-motion";
import { 
  FolderKanban, 
  Users, 
  ListTodo, 
  Shield, 
  FileText, 
  Bell,
  Zap,
  Lock
} from "lucide-react";
import { Footer } from "@/components/landing/Footer"; // adjust path if needed

const features = [
  {
    icon: FolderKanban,
    title: "Project Management",
    description: "Create and organize projects with ease. Track progress, set milestones, and keep everything in one place.",
    color: "primary",
  },
  {
    icon: ListTodo,
    title: "Task & Subtasks",
    description: "Break down complex work into manageable tasks and subtasks. Assign, track, and complete with clarity.",
    color: "status-progress",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Invite team members, assign roles, and collaborate seamlessly. Everyone stays on the same page.",
    color: "accent",
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    description: "Admin, Project Admin, and Member roles ensure the right people have the right access level.",
    color: "status-done",
  },
  {
    icon: FileText,
    title: "Project Notes",
    description: "Keep important information documented with project notes. Share knowledge across your team.",
    color: "status-todo",
  },
  {
    icon: Lock,
    title: "Secure by Design",
    description: "JWT authentication, email verification, and secure password management protect your data.",
    color: "destructive",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export function Features() {
  return (
    <>
      <section className="py-24 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-[var(--gradient-glow)] rotate-180" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary border border-border mb-6">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Powerful Features</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Everything you need to
              <br />
              <span className="gradient-text">manage projects</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              From task management to team collaboration, Project Camp provides 
              all the tools your team needs to succeed.
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="group glass-card p-6 hover:border-primary/30 transition-all duration-300"
              >
                <div 
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl mb-4 transition-transform group-hover:scale-110`}
                  style={{ backgroundColor: `hsl(var(--${feature.color}) / 0.1)` }}
                >
                  <feature.icon 
                    className="w-6 h-6" 
                    style={{ color: `hsl(var(--${feature.color}))` }}
                  />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
}
