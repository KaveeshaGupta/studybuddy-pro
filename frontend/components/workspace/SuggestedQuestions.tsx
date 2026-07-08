import { ArrowUpRight, Lightbulb, MessageCircle } from "lucide-react";

interface SuggestedQuestionsProps {
  questions: string[];
  onSelect?: (question: string) => void;
  disabled?: boolean;
}

export function SuggestedQuestions({ questions, onSelect, disabled = false }: SuggestedQuestionsProps) {
  return (
    <div className="rounded-[20px] border border-[#ECECF0] bg-white p-[22px] shadow-[0_1px_2px_rgba(24,24,27,0.04)]">
      <div className="mb-4 flex items-center gap-[9px]">
        <Lightbulb className="h-[17px] w-[17px] text-[#F59E0B]" />
        <span className="text-[15.5px] font-bold text-[#18181B]">Suggested Questions</span>
      </div>
      <div className="flex flex-col gap-2.5">
        {questions.map((q) => (
          <button
            key={q}
            type="button"
            disabled={disabled}
            onClick={() => onSelect?.(q)}
            className="flex w-full items-center gap-[11px] rounded-2xl border border-[#E9E9EE] bg-white px-[15px] py-3.5 text-left disabled:opacity-60"
          >
            <MessageCircle className="h-4 w-4 flex-none text-[var(--sb-accent)]" />
            <span className="flex-1 text-sm font-medium text-[#27272A]">{q}</span>
            <ArrowUpRight className="h-[15px] w-[15px] flex-none text-[#C4C4CC]" />
          </button>
        ))}
      </div>
    </div>
  );
}
