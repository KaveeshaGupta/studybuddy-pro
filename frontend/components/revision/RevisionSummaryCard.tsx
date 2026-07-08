import type { RevisionSummary } from "@/types/revision";
import { BookOpen } from "lucide-react";

interface RevisionSummaryCardProps {
  summary: RevisionSummary;
}

export function RevisionSummaryCard({ summary }: RevisionSummaryCardProps) {
  return (
    <div className="rounded-[20px] border border-[#ECECF0] bg-white p-[26px] shadow-[0_1px_2px_rgba(24,24,27,0.04)]">
      <div className="flex items-center gap-[10px] mb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5F3FF] text-[var(--sb-accent)]">
          <BookOpen className="h-4.5 w-4.5" />
        </div>
        <h3 className="text-[17px] font-bold text-[#18181B]">{summary.topic}</h3>
      </div>
      <p className="text-[15px] leading-relaxed text-[#3F3F46] whitespace-pre-line">
        {summary.summary}
      </p>
      {summary.citations && summary.citations.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 pt-3 border-t border-[#F4F4F5]">
          <span className="text-[12px] font-semibold text-[#71717A] self-center">Sources:</span>
          {summary.citations.map((cite, idx) => (
            <span
              key={idx}
              className="inline-flex items-center rounded-md bg-[#F4F4F5] px-2.5 py-0.5 text-[12px] font-medium text-[#18181B]"
            >
              {cite}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
