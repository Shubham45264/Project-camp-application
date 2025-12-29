import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface QuoteItem {
  text: string;
  author: string;
}

const quotes: QuoteItem[] = [
  {
    text: "Sooner or later, those who win are those who think they can.",
    author: "— Paul Tournier",
  },
  {
    text: "You gain strength, courage, and confidence by every experience in which you stop to look fear in the face. You must do the thing you think you cannot do.",
    author: "— Eleanor Roosevelt",
  },
  {
    text:"Progress doesn’t come from early risers — progress is made by lazy men looking for easier ways to do things.” — Robert Heinlein",
    author:"Robert Heinlein"
  },
  {
    text:"Of all the things I’ve done, the most vital is coordinating the talents of those who work for us and pointing them towards a certain goal.",
    author:"Walt Disney"
  },{
    text:"The secret of getting ahead is getting started.",
    author:"Mark Twain"
  }
];

export default function MultiQuote() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % quotes.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full py-32 flex items-center justify-center bg-[var(--gradient-hero)] overflow-hidden">
      {/* Animated Background Shapes */}
      <motion.div
        className="absolute w-24 h-24 bg-blue-600 rounded-xl opacity-20 top-10 left-10"
        animate={{ x: [0, 50, 0], y: [0, 30, 0], rotate: [0, 360, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-16 h-16 bg-purple-500 rounded-xl opacity-15 bottom-20 right-20"
        animate={{ x: [0, -40, 0], y: [0, -20, 0], rotate: [0, -360, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-28 h-28 bg-pink-500 rounded-full opacity-20 top-1/2 left-1/4"
        animate={{ x: [-30, 30, -30], y: [0, 20, 0], rotate: [0, 180, 0] }}
        transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-32 h-32 bg-green-400 rounded-full opacity-15 top-1/3 right-1/4"
        animate={{ x: [0, -50, 0], y: [0, 25, 0], rotate: [0, 360, 0] }}
        transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Subtle Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                            linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Quote Content */}
      <div className="relative z-10 max-w-4xl w-full px-6 md:px-12 text-center bg-card backdrop-blur-md rounded-3xl shadow-xl">
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={index}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="text-2xl md:text-4xl font-semibold italic text-foreground mb-6"
          >
            “{quotes[index].text}”
          </motion.blockquote>
        </AnimatePresence>
        <motion.p
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="text-muted-foreground text-lg md:text-xl"
        >
          {quotes[index].author}
        </motion.p>
      </div>
    </section>
  );
}
