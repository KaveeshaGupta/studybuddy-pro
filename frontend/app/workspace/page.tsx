"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, MessageCircle } from "lucide-react";

import { ChatInput } from "@/components/chat/ChatInput";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { KnowledgeBaseReadyMessage } from "@/components/chat/KnowledgeBaseReadyMessage";
import { MarkdownContent } from "@/components/chat/MarkdownContent";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { KnowledgeBaseCard } from "@/components/workspace/KnowledgeBaseCard";
import { SuggestedQuestions } from "@/components/workspace/SuggestedQuestions";
import { WorkspaceHeader } from "@/components/workspace/WorkspaceHeader";
import { parseCitations } from "@/lib/citations";
import { sampleAnswerActions, workspaceQuickActions, type AnswerAction } from "@/lib/placeholder-data";
import {
  useAddChatMessage,
  useChatMessages,
  useHasHydrated,
  useStudySpace,
} from "@/lib/store";
import { deriveSuggestedQuestions } from "@/lib/suggested-questions";
import { sendChatMessage } from "@/services/api";
import type { ChatHistoryTurn, StoredChatMessage } from "@/types/chat";

const NO_ANSWER_MESSAGE =
  "I couldn't find this information in your uploaded study material.";

function makeMessage(
  role: StoredChatMessage["role"],
  content: string,
  citations: StoredChatMessage["citations"] = [],
  kind: StoredChatMessage["kind"] = "text",
): StoredChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    citations,
    createdAt: new Date().toISOString(),
    kind,
  };
}

export default function WorkspacePage() {
  const router = useRouter();
  const hasHydrated = useHasHydrated();
  const studySpace = useStudySpace();
  const messages = useChatMessages();
  const addMessage = useAddChatMessage();

  const [isWaiting, setIsWaiting] = useState(false);
  const [activeCitationKey, setActiveCitationKey] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const kbCardRef = useRef<HTMLDivElement>(null);
  const seededRef = useRef(false);
  const sendingRef = useRef(false);

  useEffect(() => {
    if (hasHydrated && !studySpace) {
      router.replace("/");
    }
  }, [hasHydrated, studySpace, router]);

  useEffect(() => {
    if (!studySpace || seededRef.current || messages.length > 0) return;
    seededRef.current = true;
    addMessage(
      makeMessage(
        "assistant",
        "Knowledge base ready. Ask me anything about your uploaded material.",
        [],
        "kb-ready",
      ),
    );
  }, [studySpace, messages.length, addMessage]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, isWaiting]);

  async function handleSend(question: string) {
    if (sendingRef.current || isWaiting) return;
    sendingRef.current = true;

    const history: ChatHistoryTurn[] = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    addMessage(makeMessage("user", question));
    setIsWaiting(true);

    try {
      const response = await sendChatMessage(question, history);
      const answer = response.answer?.trim();
      if (!answer) {
        addMessage(makeMessage("assistant", NO_ANSWER_MESSAGE, [], "fallback"));
      } else {
        addMessage(
          makeMessage("assistant", answer, parseCitations(response.citations ?? []), "text"),
        );
      }
    } catch {
      addMessage(makeMessage("assistant", NO_ANSWER_MESSAGE, [], "fallback"));
    } finally {
      setIsWaiting(false);
      sendingRef.current = false;
    }
  }

  if (!studySpace) {
    return null;
  }

  const totalPages = studySpace.documents.reduce((sum, doc) => sum + doc.pages, 0);
  const suggestedQuestions = deriveSuggestedQuestions(studySpace);

  const quickActions = workspaceQuickActions.map((action) =>
    action.title === "Start Mission"
      ? { ...action, onClick: () => router.push("/mission") }
      : action,
  );

  const fallbackActions: AnswerAction[] = [
    {
      label: "Try another question",
      icon: MessageCircle,
      onClick: () => inputRef.current?.focus(),
    },
    {
      label: "Browse uploaded notes",
      icon: FileText,
      onClick: () => kbCardRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }),
    },
  ];

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-1 min-h-0 gap-6 px-7 py-[26px]">
      <section className="flex min-h-0 min-w-0 flex-[2_1_520px] flex-col rounded-[20px] border border-[#ECECF0] bg-white shadow-[0_1px_2px_rgba(24,24,27,0.04)]">
        <WorkspaceHeader title={studySpace.name} />

        <div ref={scrollRef} className="sb-scroll min-h-0 flex-1 overflow-auto p-[30px]">
          {messages.map((message) => {
            if (message.role === "assistant" && message.kind === "kb-ready") {
              return (
                <ChatMessage key={message.id} role="assistant" bubble>
                  <KnowledgeBaseReadyMessage
                    pages={totalPages}
                    chunks={studySpace.totalChunks}
                    prompts={suggestedQuestions}
                    onSelectPrompt={handleSend}
                    disabled={isWaiting}
                  />
                </ChatMessage>
              );
            }

            const isFallback = message.role === "assistant" && message.kind === "fallback";

            return (
              <ChatMessage
                key={message.id}
                role={message.role}
                bubble={false}
                citations={message.role === "assistant" ? message.citations : undefined}
                activeCitationKey={activeCitationKey}
                onCitationClick={(key) =>
                  setActiveCitationKey((current) => (current === key ? null : key))
                }
                actions={
                  message.role === "assistant"
                    ? isFallback
                      ? fallbackActions
                      : sampleAnswerActions
                    : undefined
                }
                showToolbar={message.role === "assistant"}
              >
                {message.role === "assistant" ? (
                  <MarkdownContent content={message.content} />
                ) : (
                  message.content
                )}
              </ChatMessage>
            );
          })}
          <AnimatePresence>
            {isWaiting && (
              <motion.div
                key="typing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <TypingIndicator />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <ChatInput
          ref={inputRef}
          placeholder={`Ask anything about ${studySpace.name}…`}
          disabled={isWaiting}
          onSend={handleSend}
        />
      </section>

      <aside className="sb-scroll flex min-h-0 min-w-0 flex-[1_1_340px] flex-col gap-[22px] overflow-auto pr-0.5">
        <div ref={kbCardRef}>
          <KnowledgeBaseCard
            title={studySpace.name}
            pages={totalPages}
            chunks={studySpace.totalChunks}
          />
        </div>
        <SuggestedQuestions
          questions={suggestedQuestions}
          onSelect={handleSend}
          disabled={isWaiting}
        />
        <QuickActions
          title="Quick Actions"
          actions={quickActions}
          columns={1}
        />
      </aside>
    </main>
  );
}
