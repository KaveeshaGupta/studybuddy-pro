import { ChevronRight, Sparkles } from "lucide-react";

import type { QuickAction } from "@/lib/placeholder-data";
import { cn } from "@/lib/utils";

interface QuickActionsProps {
  title?: string;
  actions: QuickAction[];
  columns?: 1 | 2;
}

export function QuickActions({
  title = "Quick Actions",
  actions,
  columns = 2,
}: QuickActionsProps) {
  return (
    <div className="rounded-[20px] border border-[#ECECF0] bg-white p-[22px] shadow-[0_1px_2px_rgba(24,24,27,0.04)]">
      <div className="mb-4 flex items-center gap-[9px]">
        <Sparkles className="h-[17px] w-[17px] text-[#F59E0B]" />
        <span className="text-[15.5px] font-bold text-[#18181B]">{title}</span>
      </div>
      <div className={cn("grid gap-3", columns === 2 ? "grid-cols-2" : "grid-cols-1")}>
        {actions.map((a) => (
          <button
            key={a.title}
            type="button"
            onClick={a.onClick}
            className="flex items-center gap-[11px] rounded-2xl border border-[#E9E9EE] bg-white p-3.5 text-left"
          >
            <div
              className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-[10px]"
              style={{ background: a.tint }}
            >
              <a.icon className="h-[17px] w-[17px]" style={{ color: a.color }} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-[#18181B]">{a.title}</div>
              <div className="mt-0.5 truncate text-xs text-[#A1A1AA]">{a.sub}</div>
            </div>
            <ChevronRight className="h-4 w-4 flex-none text-[#C4C4CC]" />
          </button>
        ))}
      </div>
    </div>
  );
}
