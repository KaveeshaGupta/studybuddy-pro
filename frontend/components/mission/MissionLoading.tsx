"use client";

import { motion } from "framer-motion";
import { Flag } from "lucide-react";

interface MissionLoadingProps {
  stageText: string;
  progressPercent: number;
}

export function MissionLoading({ stageText, progressPercent }: MissionLoadingProps) {
  return (
    <section className="min-w-0 flex-[2_1_520px] rounded-[20px] border border-[#ECECF0] bg-white p-10 shadow-[0_1px_2px_rgba(24,24,27,0.04)]">
      <div className="flex flex-col items-center py-20 text-center">
        <motion.div
          className="mb-[18px] flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F1EEFD]"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Flag className="h-[30px] w-[30px] text-[var(--sb-accent)]" />
        </motion.div>
        <div className="text-[19px] font-bold tracking-[-0.01em] text-[#18181B]">
          {stageText}
        </div>
        <div className="mt-[5px] text-sm text-[#A1A1AA]">
          This can take a moment for larger study spaces.
        </div>
        <div className="mt-[22px] w-full max-w-[220px]">
          <div className="h-1 overflow-hidden rounded-full bg-[#F0F0F3]">
            <div
              className="h-full rounded-full bg-[var(--sb-accent)] transition-[width] duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
