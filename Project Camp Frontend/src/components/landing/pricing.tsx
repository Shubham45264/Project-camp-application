import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/landing/Footer"; // Make sure path is correct

interface PricingPlan {
  title: string;
  price: string;
  period: string;
  features: string[];
  color: string;
}

const pricingPlans: PricingPlan[] = [
  {
    title: "Basic",
    price: "$9",
    period: "per month",
    features: ["1 Project", "Basic Task Management", "Email Support"],
    color: "primary",
  },
  {
    title: "Pro",
    price: "$29",
    period: "per month",
    features: [
      "Up to 10 Projects",
      "Advanced Task Management",
      "Team Collaboration",
      "Priority Support",
    ],
    color: "accent",
  },
  {
    title: "Enterprise",
    price: "$99",
    period: "per month",
    features: [
      "Unlimited Projects",
      "Full Task & Subtask Management",
      "Dedicated Account Manager",
      "24/7 Support",
      "Custom Integrations",
    ],
    color: "status-done",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Pricing: React.FC = () => {
  return (
    <>
      <section className="py-24 relative overflow-hidden">
        {/* Background Glow */}
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
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Choose the plan that <span className="gradient-text">fits your team</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Flexible pricing plans for teams of all sizes. Upgrade anytime as your team grows.
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {pricingPlans.map((plan) => (
              <motion.div
                key={plan.title}
                variants={itemVariants}
                className="group glass-card p-8 flex flex-col rounded-2xl border border-border hover:shadow-lg transition-all duration-300"
              >
                <h3 className="text-xl font-semibold mb-4 text-foreground">{plan.title}</h3>

                <div className="mb-6">
                  <span
                    className="text-4xl font-bold"
                    style={{ color: `hsl(var(--${plan.color}))` }}
                  >
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground"> / {plan.period}</span>
                </div>

                <ul className="mb-6 flex-1 space-y-2 text-muted-foreground">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span
                        className="inline-block w-2 h-2 rounded-full"
                        style={{ backgroundColor: `hsl(var(--${plan.color}))` }}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button variant="hero" className="mt-auto w-full text-center">
                  Get Started
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default Pricing;
