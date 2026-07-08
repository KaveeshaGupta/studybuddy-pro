import { FileText } from "lucide-react";

import { cn } from "@/lib/utils";

interface CitationChipProps {
  file: string;
  page: string;
  selected?: boolean;
  onClick?: () => void;
}

export function CitationChip({ file, page, selected = false, onClick }: CitationChipProps) {
  const classes = cn(
    "inline-flex items-center gap-2 rounded-[10px] border px-3 py-1.5 text-[12.5px] font-semibold transition-[colors,box-shadow] duration-150",
    onClick && "hover:shadow-[0_2px_6px_rgba(24,24,27,0.10)]",
    selected
      ? "border-[var(--sb-accent)] bg-[#F5F3FE] text-[#18181B]"
      : "border-[#EAEAEE] bg-[#FBFBFC] text-[#3F3F46]",
  );
  const content = (
    <>
      <FileText className="h-3.5 w-3.5 text-[var(--sb-accent)]" />
      {file} <span className="font-medium text-[#A1A1AA]">• {page}</span>
    </>
  );

  if (!onClick) {
    return <span className={classes}>{content}</span>;
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {content}
    </button>
  );
}
