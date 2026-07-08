"use client";

import { motion } from "framer-motion";

interface ScoreGaugeProps {
  score: number;
}

const RADIUS = 85;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ScoreGauge({ score }: ScoreGaugeProps) {
  const offset = CIRCUMFERENCE * (1 - score / 100);

  return (
    <div className="relative mx-auto h-[200px] w-[200px]">
      <svg width={200} height={200} viewBox="0 0 200 200" className="-rotate-90">
        <circle cx={100} cy={100} r={RADIUS} fill="none" stroke="#F0F0F3" strokeWidth={16} />
        <motion.circle
          cx={100}
          cy={100}
          r={RADIUS}
          fill="none"
          stroke="#7C3AED"
          strokeWidth={16}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          initial={{ strokeDashoffset: CIRCUMFERENCE }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.1, ease: [0.4, 0, 0.2, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-[52px] font-bold leading-none tracking-[-0.03em] text-[#18181B]">
          {score}
          <span className="text-[26px] text-[#A1A1AA]">%</span>
        </div>
        <div className="mt-1.5 text-[13px] font-semibold text-[#A1A1AA]">Score</div>
      </div>
    </div>
  );
}
