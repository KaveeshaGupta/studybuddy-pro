import { PageHeader } from "@/components/common/PageHeader";

export default function QuizPage() {
  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <PageHeader
        title="Quiz"
        description="Test your understanding with generated questions."
      />
    </main>
  );
}
