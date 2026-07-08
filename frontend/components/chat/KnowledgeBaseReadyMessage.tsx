import { CheckCircle2 } from "lucide-react";

interface KnowledgeBaseReadyMessageProps {
  pages: number;
  chunks: number;
  prompts: string[];
  onSelectPrompt: (prompt: string) => void;
  disabled?: boolean;
}

export function KnowledgeBaseReadyMessage({
  pages,
  chunks,
  prompts,
  onSelectPrompt,
  disabled = false,
}: KnowledgeBaseReadyMessageProps) {
  return (
    <div>
      <div className="flex items-center gap-2 text-[15px] font-semibold text-[#18181B]">
        <CheckCircle2 className="h-[18px] w-[18px] text-[#16A34A]" />
        Knowledge Base Ready
      </div>
      <div className="mt-1.5 text-[15px] leading-[1.6] text-[#27272A]">
        Your study material has been indexed successfully.
      </div>
      <div className="mt-2 text-[13px] text-[#A1A1AA]">
        {pages} pages • {chunks} chunks
      </div>

      {prompts.length > 0 && (
        <>
          <div className="mt-3.5 text-[13px] font-semibold text-[#52525B]">Try asking:</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {prompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                disabled={disabled}
                onClick={() => onSelectPrompt(prompt)}
                className="inline-flex items-center gap-2 rounded-[11px] border border-[#E9E9EE] bg-white px-3.5 py-2.5 text-left text-[13.5px] font-semibold text-[#3F3F46] shadow-[0_1px_2px_rgba(24,24,27,0.03)] transition-shadow duration-150 hover:shadow-[0_2px_6px_rgba(24,24,27,0.10)] disabled:opacity-60"
              >
                {prompt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
