import { PageHeader } from "@/components/common/PageHeader";

export default function ChatPage() {
  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <PageHeader
        title="Chat"
        description="Ask questions and get grounded answers with citations."
      />
    </main>
  );
}
