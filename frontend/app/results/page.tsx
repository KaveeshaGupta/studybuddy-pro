import { PageHeader } from "@/components/common/PageHeader";

export default function ResultsPage() {
  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <PageHeader
        title="Results"
        description="Review your quiz performance and weak topics."
      />
    </main>
  );
}
