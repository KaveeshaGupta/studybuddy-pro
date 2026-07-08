import { ClipboardCheck } from "lucide-react";

import type { MissionDetail } from "@/lib/placeholder-data";

interface MissionDetailsCardProps {
  details: MissionDetail[];
}

export function MissionDetailsCard({ details }: MissionDetailsCardProps) {
  return (
    <aside className="min-w-0 flex-[1_1_340px]">
      <div className="rounded-[20px] border border-[#ECECF0] bg-white p-[26px] shadow-[0_1px_2px_rgba(24,24,27,0.04)]">
        <div className="mb-6 flex items-center gap-[9px]">
          <ClipboardCheck className="h-[18px] w-[18px] text-[var(--sb-accent)]" />
          <span className="text-[15.5px] font-bold text-[#18181B]">Mission Details</span>
        </div>
        <div className="flex flex-col">
          {details.map((d) => (
            <div
              key={d.label}
              className="flex items-center gap-[14px] border-b border-[#F2F2F5] py-[18px]"
            >
              <div className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-[11px] bg-[#F4F4F5]">
                <d.icon className="h-[18px] w-[18px] text-[#71717A]" />
              </div>
              <span className="text-[14.5px] text-[#52525B]">{d.label}</span>
              <span
                className="ml-auto text-[14.5px] font-bold"
                style={{ color: d.valueColor ?? "#18181B" }}
              >
                {d.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
