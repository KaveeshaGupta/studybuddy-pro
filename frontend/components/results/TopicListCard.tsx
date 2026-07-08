import { CheckCircle2, CircleDot, Target, TrendingUp, type LucideIcon } from "lucide-react";

interface TopicListCardProps {
  title: string;
  topics: string[];
  variant: "strength" | "review";
}

interface VariantStyle {
  iconBg: string;
  iconColor: string;
  itemBg: string;
  itemBorder: string;
  textColor: string;
  headerIcon: LucideIcon;
  itemIcon: LucideIcon;
}

const VARIANTS: Record<TopicListCardProps["variant"], VariantStyle> = {
  strength: {
    iconBg: "#E6EEFE",
    iconColor: "#2563EB",
    itemBg: "#F5F9FF",
    itemBorder: "#E4EDFB",
    textColor: "#1E3A8A",
    headerIcon: TrendingUp,
    itemIcon: CheckCircle2,
  },
  review: {
    iconBg: "#FEF0E4",
    iconColor: "#F97316",
    itemBg: "#FFF8F1",
    itemBorder: "#FBEAD7",
    textColor: "#9A3412",
    headerIcon: Target,
    itemIcon: CircleDot,
  },
};

export function TopicListCard({ title, topics, variant }: TopicListCardProps) {
  const s = VARIANTS[variant];

  return (
    <div className="min-w-0 flex-[1_1_320px] rounded-[20px] border border-[#ECECF0] bg-white p-[26px] shadow-[0_1px_2px_rgba(24,24,27,0.04)]">
      <div className="mb-[18px] flex items-center gap-2.5">
        <div
          className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px]"
          style={{ background: s.iconBg }}
        >
          <s.headerIcon className="h-[18px] w-[18px]" style={{ color: s.iconColor }} />
        </div>
        <span className="text-[15.5px] font-bold">{title}</span>
      </div>
      <div className="flex flex-col gap-2.5">
        {topics.map((t) => (
          <div
            key={t}
            className="flex items-center gap-3 rounded-[13px] border px-4 py-3.5"
            style={{ background: s.itemBg, borderColor: s.itemBorder }}
          >
            <s.itemIcon className="h-[19px] w-[19px] flex-none" style={{ color: s.iconColor }} />
            <span className="text-[14.5px] font-semibold" style={{ color: s.textColor }}>
              {t}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
