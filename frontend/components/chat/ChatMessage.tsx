"use client";

import { Bot, Copy, RotateCw, ThumbsDown, ThumbsUp } from "lucide-react";
import { motion } from "framer-motion";

import type { AnswerAction } from "@/lib/placeholder-data";
import type { ParsedCitation } from "@/types/chat";
import { cn } from "@/lib/utils";

import { CitationChip } from "./CitationChip";

const ENTRANCE = {
  initial: { opacity: 0, y: 8, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.22, ease: "easeOut" as const },
};

interface ChatMessageProps {
  role: "user" | "assistant";
  children: React.ReactNode;
  /** Landing-style tinted bubble (default). Set false for the plain-text
   * answer style used inside an active Workspace conversation. */
  bubble?: boolean;
  /** Lays the bubble content out as a row (icon + text + affordance). */
  rowLayout?: boolean;
  citations?: ParsedCitation[];
  activeCitationKey?: string | null;
  onCitationClick?: (key: string) => void;
  actions?: AnswerAction[];
  showToolbar?: boolean;
}

export function ChatMessage({
  role,
  children,
  bubble = true,
  rowLayout = false,
  citations,
  activeCitationKey = null,
  onCitationClick,
  actions,
  showToolbar = false,
}: ChatMessageProps) {
  if (role === "user") {
    return (
      <motion.div className="mb-7 flex justify-end" {...ENTRANCE}>
        <div className="max-w-[70%] rounded-2xl rounded-br-[4px] border border-[#E7E2FB] bg-[#F1EEFD] px-[18px] py-3.5 text-[15px] leading-relaxed text-[#27272A]">
          {children}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div className="mb-5 flex gap-3.5" {...ENTRANCE}>
      <div className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-full bg-[#F1EEFD]">
        <Bot className="h-5 w-5 text-[var(--sb-accent)]" />
      </div>
      <div className="min-w-0 flex-1">
        <div
          className={cn(
            "text-[15px] leading-[1.7] text-[#27272A]",
            bubble &&
              "rounded-[4px_16px_16px_16px] border border-[#ECE9FB] bg-[#F5F3FE] px-[18px] py-4",
            bubble && !rowLayout && "max-w-[460px]",
            bubble && rowLayout && "flex max-w-[560px] items-center gap-3",
          )}
        >
          {children}
        </div>

        {citations && citations.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {citations.map((c) => (
              <CitationChip
                key={c.key}
                file={c.file}
                page={c.page}
                selected={activeCitationKey === c.key}
                onClick={onCitationClick ? () => onCitationClick(c.key) : undefined}
              />
            ))}
          </div>
        ) : null}

        {actions && actions.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2.5">
            {actions.map((a) => (
              <button
                key={a.label}
                type="button"
                onClick={a.onClick}
                className="inline-flex items-center gap-2 rounded-[11px] border border-[#E9E9EE] bg-white px-3.5 py-2.5 text-[13.5px] font-semibold text-[#3F3F46] shadow-[0_1px_2px_rgba(24,24,27,0.03)] transition-shadow duration-150 hover:shadow-[0_2px_6px_rgba(24,24,27,0.10)]"
              >
                <a.icon className="h-[15px] w-[15px] text-[var(--sb-accent)]" />
                {a.label}
              </button>
            ))}
          </div>
        ) : null}

        {showToolbar ? (
          <div className="mt-4 flex items-center gap-1 text-[#A1A1AA]">
            {[Copy, ThumbsUp, ThumbsDown, RotateCw].map((Icon, i) => (
              <button
                key={i}
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-[9px] text-inherit"
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
