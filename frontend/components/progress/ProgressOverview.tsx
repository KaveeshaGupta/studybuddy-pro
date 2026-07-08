import type { ProgressSnapshot } from "@/types/progress";

interface ProgressOverviewProps {
  snapshot: ProgressSnapshot;
}

export function ProgressOverview(_props: ProgressOverviewProps) {
  return <div className="flex flex-col gap-4" />;
}
