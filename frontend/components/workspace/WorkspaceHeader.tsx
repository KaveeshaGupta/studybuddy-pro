import { BookOpen } from "lucide-react";

interface WorkspaceHeaderProps {
  title: string;
  status?: string;
}

export function WorkspaceHeader({
  title,
  status = "Active Study Space",
}: WorkspaceHeaderProps) {
  return (
    <div className="flex flex-none items-center gap-[13px] border-b border-[#F2F2F5] px-[30px] py-5">
      <div className="flex h-[42px] w-[42px] flex-none items-center justify-center rounded-xl bg-[#F1EEFD]">
        <BookOpen className="h-5 w-5 text-[var(--sb-accent)]" />
      </div>
      <div className="min-w-0">
        <div className="text-base font-bold tracking-[-0.01em]">{title}</div>
        <div className="mt-0.5 text-[13px] text-[#A1A1AA]">{status}</div>
      </div>
      <span className="ml-auto inline-flex items-center gap-[7px] rounded-full bg-[#E9F8EF] px-3 py-1.5 text-[12.5px] font-semibold text-[#16A34A]">
        <span className="h-[7px] w-[7px] rounded-full bg-[#16A34A]" /> Ready
      </span>
    </div>
  );
}
