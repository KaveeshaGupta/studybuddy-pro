import { BookOpen, Library } from "lucide-react";

import { recentStudySpaces } from "@/lib/placeholder-data";

export function RecentStudySpaces() {
  return (
    <div className="rounded-[20px] border border-[#ECECF0] bg-white p-[22px] shadow-[0_1px_2px_rgba(24,24,27,0.04)]">
      <div className="mb-[18px] flex items-center">
        <Library className="h-[18px] w-[18px] text-[var(--sb-accent)]" />
        <span className="ml-[9px] text-[15.5px] font-bold text-[var(--sb-accent)]">
          Recent Study Spaces
        </span>
        <a href="#" className="ml-auto text-[13.5px] font-semibold">
          View all
        </a>
      </div>
      <div className="flex flex-col gap-[18px]">
        {recentStudySpaces.map((s) => (
          <div key={s.title} className="flex items-center gap-[13px]">
            <div className="flex h-[42px] w-[42px] flex-none items-center justify-center rounded-xl bg-[#F1EEFD]">
              <BookOpen className="h-5 w-5" style={{ color: s.iconColor }} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[14.5px] font-semibold text-[#18181B]">
                {s.title}
              </div>
              <div className="mt-0.5 text-[13px] text-[#A1A1AA]">{s.meta}</div>
            </div>
            <div className="w-24 flex-none text-right">
              <div className="text-sm font-bold" style={{ color: s.barColor }}>
                {s.pct}%
              </div>
              <div className="mt-[7px] h-1 overflow-hidden rounded-full bg-[#F0F0F3]">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${s.pct}%`, background: s.barColor }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
