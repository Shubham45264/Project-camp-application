import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, CheckCircle2 } from "lucide-react";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    sessionStorage.setItem("resetEmail", email);

    // Show success popup
    setShowPopup(true);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
      <div className="absolute inset-0 bg-[var(--gradient-glow)]" />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md mx-auto glass-card p-8 border border-border"
      >
        <div className="flex justify-center mb-6">
          <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Lock className="h-6 w-6 text-primary" />
          </div>
        </div>

        <h2 className="font-display text-2xl font-bold text-center mb-2">
          Forgot Password
        </h2>
        <p className="text-sm text-muted-foreground text-center mb-6">
          Enter your registered email to receive a verification link
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-4 py-2 pl-10
                         focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-lg bg-primary py-2 font-medium text-primary-foreground
                       hover:bg-primary/90 transition"
          >
            Send Verification
          </button>
        </form>
      </motion.div>

      {/* SUCCESS POPUP */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="glass-card p-6 max-w-sm w-full border border-border text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-status-done/10 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-status-done" />
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-2">
                Email Sent Successfully
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                If the email is registered, a password reset link has been sent.
              </p>

              <button
                onClick={() => setShowPopup(false)}
                className="w-full rounded-lg bg-primary py-2 text-primary-foreground
                           hover:bg-primary/90 transition"
              >
                OK
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default ForgotPassword;
