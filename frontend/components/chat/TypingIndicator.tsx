import { Bot } from "lucide-react";
import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <div className="mb-5 flex gap-3.5">
      <div className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-full bg-[#F1EEFD]">
        <Bot className="h-5 w-5 text-[var(--sb-accent)]" />
      </div>
      <div className="flex items-center gap-1.5 py-2">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-2 w-2 rounded-full bg-[#C4C4CC]"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
