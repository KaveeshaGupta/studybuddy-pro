"use client";

import { ArrowLeft, ArrowRight, Check, CheckCircle2, Flag } from "lucide-react";

import { cn } from "@/lib/utils";

const LETTERS = ["A", "B", "C", "D"];

/** Backend MCQ options already arrive as "A. actual text" — strip that
 * since the letter is rendered separately via the badge. */
function stripLeadingLetter(text: string): string {
  return text.replace(/^[A-D]\.\s*/, "");
}

interface MissionCardProps {
  subtitle: string;
  current: number;
  total: number;
  questionType: "mcq" | "short_answer";
  question: string;
  options: string[];
  selectedLetter: string | null;
  onSelectLetter: (letter: string) => void;
  shortAnswerValue: string;
  onShortAnswerChange: (value: string) => void;
  onPrev: () => void;
  onNext: () => void;
  isLast: boolean;
  canFinish: boolean;
}

export function MissionCard({
  subtitle,
  current,
  total,
  questionType,
  question,
  options,
  selectedLetter,
  onSelectLetter,
  shortAnswerValue,
  onShortAnswerChange,
  onPrev,
  onNext,
  isLast,
  canFinish,
}: MissionCardProps) {
  const progressPct = Math.round((current / total) * 100);
  const prevDisabled = current === 1;
  const nextDisabled = isLast && !canFinish;

  return (
    <section className="min-w-0 flex-[2_1_520px] rounded-[20px] border border-[#ECECF0] bg-white p-10 shadow-[0_1px_2px_rgba(24,24,27,0.04)]">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1EEFD]">
          <Flag className="h-5 w-5 text-[var(--sb-accent)]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-[-0.02em]">Mission</h1>
          <div className="mt-0.5 text-sm text-[#A1A1AA]">{subtitle}</div>
        </div>
      </div>

      <div className="mt-[34px]">
        <div className="mb-3 flex items-baseline justify-between text-sm font-semibold text-[#52525B]">
          <span>Question</span>
          <span>
            <span className="font-bold text-[var(--sb-accent)]">{current}</span> / {total}
          </span>
        </div>
        <div className="h-4 overflow-hidden rounded-full bg-[#F0F0F3]">
          <div
            className="h-full rounded-full bg-[var(--sb-accent)] transition-[width] duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div className="mt-10 rounded-[18px] border border-[#EEEEF2] bg-[#FBFBFC] p-8">
        <div className="mb-3.5 text-[13px] font-semibold uppercase tracking-[0.04em] text-[#A1A1AA]">
          {questionType === "mcq" ? "Select the correct answer" : "Answer in your own words"}
        </div>
        <div className="text-pretty text-[22px] font-semibold leading-[1.45] tracking-[-0.01em] text-[#18181B]">
          {question}
        </div>
      </div>

      {questionType === "mcq" ? (
        <div className="mt-6 flex flex-col gap-3.5">
          {options.map((rawText, i) => {
            const letter = LETTERS[i];
            const selected = selectedLetter === letter;
            const text = stripLeadingLetter(rawText);
            return (
              <button
                key={rawText}
                type="button"
                onClick={() => onSelectLetter(letter)}
                className={cn(
                  "flex w-full items-center gap-4 rounded-2xl border-[1.5px] px-5 py-[18px] text-left transition-colors duration-150",
                  selected
                    ? "border-[var(--sb-accent)] bg-[#FAF8FF] shadow-[0_4px_14px_rgba(124,58,237,0.12)]"
                    : "border-[#E9E9EE] bg-white shadow-[0_1px_2px_rgba(24,24,27,0.03)]",
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 flex-none items-center justify-center rounded-[10px] text-sm font-bold transition-colors duration-150",
                    selected ? "bg-[var(--sb-accent)] text-white" : "bg-[#F4F4F5] text-[#71717A]",
                  )}
                >
                  {letter}
                </span>
                <span className="flex-1 text-base font-medium text-[#27272A]">{text}</span>
                <Check
                  className={cn(
                    "h-5 w-5 flex-none text-[var(--sb-accent)] transition-opacity duration-150",
                    selected ? "opacity-100" : "opacity-0",
                  )}
                />
              </button>
            );
          })}
        </div>
      ) : (
        <div className="mt-6">
          <textarea
            value={shortAnswerValue}
            onChange={(e) => onShortAnswerChange(e.target.value)}
            placeholder="Type your answer…"
            rows={4}
            className="w-full resize-none rounded-2xl border-[1.5px] border-[#E9E9EE] bg-white px-5 py-[18px] text-base font-medium text-[#27272A] shadow-[0_1px_2px_rgba(24,24,27,0.03)] outline-none transition-colors duration-150 focus:border-[var(--sb-accent)]"
          />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onPrev}
          disabled={prevDisabled}
          className={cn(
            "inline-flex items-center gap-[9px] rounded-xl border border-[#E4E4E7] bg-white px-[22px] py-[13px] text-[15px] font-semibold",
            prevDisabled ? "cursor-not-allowed text-[#C4C4CC]" : "cursor-pointer text-[#3F3F46]",
          )}
        >
          <ArrowLeft className="h-[18px] w-[18px]" /> Previous
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          className={cn(
            "inline-flex items-center gap-[9px] rounded-xl bg-[var(--sb-accent)] px-6 py-[13px] text-[15px] font-semibold text-white shadow-[0_4px_14px_rgba(124,58,237,0.30)]",
            nextDisabled && "cursor-not-allowed opacity-50",
          )}
        >
          {isLast ? (
            <>
              Finish Mission <CheckCircle2 className="h-[18px] w-[18px]" />
            </>
          ) : (
            <>
              Next <ArrowRight className="h-[18px] w-[18px]" />
            </>
          )}
        </button>
      </div>
      {isLast && nextDisabled && (
        <div className="mt-3 text-right text-[13px] text-[#A1A1AA]">
          Answer every question to finish your mission.
        </div>
      )}
    </section>
  );
}
