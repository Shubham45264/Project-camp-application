import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Footer } from "@/components/landing/Footer";
import { useNavigate } from "react-router-dom";

const pathsData = [
  {
    title: "From Spreadsheets to Structured Projects",
    image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
    steps: [
      "Started with Excel / Google Sheets",
      "Tasks got duplicated",
      "No real ownership or tracking",
      "Deadlines started slipping",
    ],
    result:
      "ProjectCamp brought tasks, timelines, and teams into one clear dashboard.",
    quote:
      "ProjectCamp helped me move from chaos to clarity without extra effort.",
  },
  {
    title: "From Overloaded Tools to Simple Control",
    image: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg",
    steps: [
      "Tried Jira for tracking",
      "Too many settings and workflows",
      "Spent more time managing tools than projects",
    ],
    result:
      "ProjectCamp focuses on what matters — planning, tracking, and execution.",
    quote:
      "Finally a tool that doesn’t feel heavier than the project itself.",
  },
  {
    title: "From Freelance Chaos to Organized Delivery",
    image: "https://images.pexels.com/photos/4050291/pexels-photo-4050291.jpeg",
    steps: [
      "Managing clients via email & WhatsApp",
      "Separate task lists for each project",
      "No centralized view of work",
    ],
    result:
      "With ProjectCamp, freelancers manage all clients and projects in one place.",
    quote:
      "I can finally see all my work clearly without switching apps.",
  },
  {
    title: "From Team Confusion to Clear Collaboration",
    image: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg",
    steps: [
      "Team members unaware of responsibilities",
      "Files scattered across drives",
      "Meetings more frequent than progress",
    ],
    result:
      "ProjectCamp centralizes communication and clarifies ownership for everyone.",
    quote:
      "Our team now collaborates efficiently without constant follow-ups.",
  },
  {
    title: "From Missed Deadlines to Consistent Delivery",
    image: "https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg",
    steps: [
      "Projects often delayed",
      "No visibility on bottlenecks",
      "Stress increased for both team and clients",
    ],
    result:
      "ProjectCamp ensures timelines are tracked and milestones are met reliably.",
    quote:
      "Deadlines are no longer a worry — everything is visible and actionable.",
  },
];

export default function Paths() {
  const navigate = useNavigate();

  return (
    <>
      <main className="pt-28 pb-20 bg-background">
        {/* Header */}
        <section className="container mx-auto px-4 text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Every Project Has a Path
          </motion.h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            People arrive at ProjectCamp in different ways — through chaos,
            complexity, or burnout. These are some of the paths they took.
          </p>
        </section>

        {/* Paths */}
        <section className="container mx-auto px-4 space-y-14">
          {pathsData.map((path, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="border rounded-2xl p-8 bg-card shadow-sm flex flex-col md:flex-row items-center gap-8"
            >
              {/* Left Content */}
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-4">{path.title}</h2>

                <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-6">
                  {path.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>

                <p className="font-medium mb-4 text-primary">
                  {path.result}
                </p>

                <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground mb-6">
                  “{path.quote}”
                </blockquote>

                <Button
                  variant="hero"
                  onClick={() => navigate("/login")}
                >
                  Start Your Path
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {/* Right Image */}
              <div className="w-full md:w-1/3">
                <img
                  src={path.image}
                  alt={path.title}
                  className="rounded-2xl object-cover w-full h-64 shadow-md"
                />
              </div>
            </motion.div>
          ))}
        </section>
      </main>

      <Footer />
    </>
  );
}
