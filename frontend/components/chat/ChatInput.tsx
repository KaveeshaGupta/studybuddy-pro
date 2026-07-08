"use client";

import { forwardRef, useState } from "react";
import { Mic, Plus, Send } from "lucide-react";

import { cn } from "@/lib/utils";

interface ChatInputProps {
  placeholder?: string;
  disabled?: boolean;
  onSend?: (message: string) => void;
}

export const ChatInput = forwardRef<HTMLInputElement, ChatInputProps>(function ChatInput(
  { placeholder = "How can StudyBuddy help you today?", disabled = false, onSend },
  ref,
) {
  const [value, setValue] = useState("");

  function submit() {
    const trimmed = value.trim();
    if (!trimmed || disabled || !onSend) return;
    onSend(trimmed);
    setValue("");
  }

  return (
    <div className="flex-none px-[30px] pb-6 pt-4">
      <div className="rounded-2xl border border-[#E4E4E7] bg-white p-3.5 shadow-[0_1px_2px_rgba(24,24,27,0.03)]">
        <input
          ref={ref}
          type="text"
          value={value}
          disabled={disabled}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder={placeholder}
          className={cn(
            "w-full border-none bg-transparent pb-3.5 pt-0.5 text-base text-[#18181B] outline-none placeholder:text-[#A1A1AA]",
            disabled && "cursor-not-allowed opacity-60",
          )}
        />
        <div className="flex items-center">
          <button
            type="button"
            disabled={disabled}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#E4E4E7] bg-[#F4F4F5] text-[#52525B]",
              disabled && "opacity-60",
            )}
          >
            <Plus className="h-[18px] w-[18px]" />
          </button>
          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              disabled={disabled}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-[10px] text-[#71717A]",
                disabled && "opacity-60",
              )}
            >
              <Mic className="h-[19px] w-[19px]" />
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={submit}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-[11px] bg-[var(--sb-accent)] shadow-[0_4px_12px_rgba(124,58,237,0.30)]",
                disabled && "opacity-60",
              )}
            >
              <Send className="h-[18px] w-[18px] text-white" />
            </button>
          </div>
        </div>
      </div>
      <div className="mt-3.5 text-center text-[12.5px] text-[#A1A1AA]">
        StudyBuddy can make mistakes. Please verify important information.
      </div>
    </div>
  );
});
