import type { RevisionSummary } from "@/types/revision";

interface RevisionSummaryCardProps {
  summary: RevisionSummary;
}

export function RevisionSummaryCard(_props: RevisionSummaryCardProps) {
  return <div className="rounded-lg border p-4" />;
}
