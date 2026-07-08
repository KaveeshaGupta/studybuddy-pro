import { ArrowRight, FileText } from "lucide-react";

import { ChatInput } from "@/components/chat/ChatInput";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentStudySpaces } from "@/components/dashboard/RecentStudySpaces";
import { UploadDropzone } from "@/components/upload/UploadDropzone";
import { homeQuickActions } from "@/lib/placeholder-data";

export default function LandingPage() {
  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-wrap items-stretch gap-6 px-7 pb-10 pt-[26px]">
      <section className="flex min-h-[760px] min-w-0 flex-[2_1_480px] flex-col rounded-[20px] border border-[#ECECF0] bg-white shadow-[0_1px_2px_rgba(24,24,27,0.04)]">
        <div className="flex-1 overflow-auto px-[30px] pb-2 pt-[30px]">
          <ChatMessage role="assistant">
            Hi! I&apos;m StudyBuddy, your AI learning companion. Upload your notes
            and I&apos;ll help you understand, practice and master every topic.
          </ChatMessage>

          <ChatMessage role="assistant" rowLayout>
            <FileText className="h-[19px] w-[19px] flex-none text-[var(--sb-accent)]" />
            <span className="text-[15px] leading-normal text-[#27272A]">
              Ready to learn your lessons?{" "}
              <a href="/workspace" className="font-semibold">
                Explore My Workspace
              </a>
            </span>
            <ArrowRight className="ml-auto h-[18px] w-[18px] flex-none text-[#52525B]" />
          </ChatMessage>
        </div>

        <ChatInput placeholder="How can StudyBuddy help you today?" />
      </section>

      <aside className="flex min-w-0 flex-[1_1_360px] flex-col gap-[22px]">
        <UploadDropzone />
        <RecentStudySpaces />
        <QuickActions actions={homeQuickActions} columns={2} />
      </aside>
    </main>
  );
}
