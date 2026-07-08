"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/common/PageHeader";
import { RevisionSummaryCard } from "@/components/revision/RevisionSummaryCard";
import { useQuizResults } from "@/lib/store";
import { generateRevision } from "@/services/api";
import type { RevisionSummary } from "@/types/revision";

export default function RevisionPage() {
  const router = useRouter();
  const results = useQuizResults();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summaries, setSummaries] = useState<RevisionSummary[]>([]);

  useEffect(() => {
    if (!results || !results.weak_topics || results.weak_topics.length === 0) {
      router.replace("/workspace");
      return;
    }

    async function loadRevision() {
      setLoading(true);
      setError(null);
      try {
        const response = await generateRevision({
          weak_topics: results!.weak_topics,
        });
        setSummaries(response.summaries);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load revision summaries.");
      } finally {
        setLoading(false);
      }
    }

    void loadRevision();
  }, [results, router]);

  if (!results) return null;

  return (
    <main className="mx-auto w-full max-w-[960px] flex-1 px-7 pb-14 pt-9 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Revision Coach"
          description={`Personalized revision summaries for ${results.weak_topics.length} topics that need review.`}
        />
        <Link
          href="/workspace"
          className="inline-flex items-center gap-[9px] rounded-xl border border-[#E4E4E7] bg-white px-5 py-2.5 text-[14px] font-semibold text-[#3F3F46]"
        >
          <ArrowLeft className="h-4.5 w-4.5" /> Return to Workspace
        </Link>
      </div>

      {loading ? (
        <section className="flex flex-col items-center justify-center py-24 text-center rounded-[20px] border border-[#ECECF0] bg-white shadow-[0_1px_2px_rgba(24,24,27,0.04)]">
          <div className="flex h-12 w-12 animate-bounce items-center justify-center rounded-full bg-[#F5F3FF] text-[var(--sb-accent)]">
            <Sparkles className="h-6 w-6 animate-pulse" />
          </div>
          <h3 className="mt-5 text-[18px] font-bold text-[#18181B]">Generating Study Guide...</h3>
          <p className="mt-2 max-w-[340px] text-[14.5px] text-[#71717A]">
            We are analyzing your incorrect answers and extracting context-only revision notes from your source documents.
          </p>
        </section>
      ) : error ? (
        <section className="flex flex-col items-center justify-center py-16 text-center rounded-[20px] border border-[#ECECF0] bg-[#FEF2F2] shadow-[0_1px_2px_rgba(24,24,27,0.04)]">
          <h3 className="text-[17px] font-bold text-[#991B1B]">Unable to Generate Revision</h3>
          <p className="mt-2 max-w-[340px] text-[14.5px] text-[#B91C1C]">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-5 inline-flex items-center rounded-xl bg-white border border-[#FCA5A5] px-5 py-2.5 text-[14px] font-semibold text-[#991B1B]"
          >
            Try Again
          </button>
        </section>
      ) : (
        <div className="flex flex-col gap-5">
          {summaries.map((summary, idx) => (
            <RevisionSummaryCard key={idx} summary={summary} />
          ))}
        </div>
      )}
    </main>
  );
}
