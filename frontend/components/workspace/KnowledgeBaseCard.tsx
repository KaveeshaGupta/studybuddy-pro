import { BookOpen, CheckCircle2, Database } from "lucide-react";

interface KnowledgeBaseCardProps {
  title: string;
  pages: number;
  chunks: number;
}

export function KnowledgeBaseCard({ title, pages, chunks }: KnowledgeBaseCardProps) {
  return (
    <div className="rounded-[20px] border border-[#ECECF0] bg-white p-[22px] shadow-[0_1px_2px_rgba(24,24,27,0.04)]">
      <div className="mb-[18px] flex items-center gap-[9px]">
        <Database className="h-[18px] w-[18px] text-[var(--sb-accent)]" />
        <span className="text-[15.5px] font-bold text-[var(--sb-accent)]">Knowledge Base</span>
      </div>
      <div className="mb-5 flex items-center gap-[13px]">
        <div className="flex h-[42px] w-[42px] flex-none items-center justify-center rounded-xl bg-[#F1EEFD]">
          <BookOpen className="h-5 w-5 text-[var(--sb-accent)]" />
        </div>
        <div className="min-w-0">
          <div className="text-[14.5px] font-bold text-[#18181B]">{title}</div>
          <div className="mt-[3px] inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#16A34A]">
            <CheckCircle2 className="h-3.5 w-3.5" /> Indexed &amp; Ready
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-[#EEEEF2] bg-[#FBFBFC] p-4">
          <div className="text-[22px] font-bold tracking-[-0.02em]">{pages}</div>
          <div className="mt-[3px] text-[12.5px] text-[#A1A1AA]">Pages</div>
        </div>
        <div className="rounded-2xl border border-[#EEEEF2] bg-[#FBFBFC] p-4">
          <div className="text-[22px] font-bold tracking-[-0.02em]">{chunks}</div>
          <div className="mt-[3px] text-[12.5px] text-[#A1A1AA]">Chunks</div>
        </div>
      </div>
    </div>
  );
}
