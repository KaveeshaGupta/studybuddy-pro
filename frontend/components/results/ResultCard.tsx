import type { TimelineStat } from "@/lib/placeholder-data";

export function ResultCard({ label, value, icon: Icon, color }: TimelineStat) {
  return (
    <div className="rounded-2xl border border-[#EEEEF2] bg-[#FBFBFC] p-5">
      <div className="mb-3 flex items-center gap-[9px] text-[#A1A1AA]">
        <Icon className="h-4 w-4" style={{ color }} />
        <span className="text-[13px] font-semibold">{label}</span>
      </div>
      <div className="text-[28px] font-bold tracking-[-0.02em]" style={{ color }}>
        {value}
      </div>
    </div>
  );
}
