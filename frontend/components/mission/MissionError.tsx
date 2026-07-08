"use client";

import { ArrowLeft, RotateCw } from "lucide-react";

interface MissionErrorProps {
  message: string;
  onRetry: () => void;
  onReturnToWorkspace: () => void;
}

export function MissionError({ message, onRetry, onReturnToWorkspace }: MissionErrorProps) {
  return (
    <section className="min-w-0 flex-[2_1_520px] rounded-[20px] border border-[#ECECF0] bg-white p-10 shadow-[0_1px_2px_rgba(24,24,27,0.04)]">
      <div className="flex flex-col items-center py-20 text-center">
        <div className="text-[19px] font-bold tracking-[-0.01em] text-[#18181B]">
          Couldn&apos;t prepare your mission
        </div>
        <div className="mt-[5px] max-w-[320px] text-sm text-[#E11D48]">{message}</div>

        <div className="mt-8 flex items-center gap-4">
          <button
            type="button"
            onClick={onReturnToWorkspace}
            className="inline-flex items-center gap-[9px] rounded-xl border border-[#E4E4E7] bg-white px-[22px] py-[13px] text-[15px] font-semibold text-[#3F3F46]"
          >
            <ArrowLeft className="h-[18px] w-[18px]" /> Return to Workspace
          </button>
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-[9px] rounded-xl bg-[var(--sb-accent)] px-6 py-[13px] text-[15px] font-semibold text-white shadow-[0_4px_14px_rgba(124,58,237,0.30)]"
          >
            <RotateCw className="h-[18px] w-[18px]" /> Retry
          </button>
        </div>
      </div>
    </section>
  );
}
