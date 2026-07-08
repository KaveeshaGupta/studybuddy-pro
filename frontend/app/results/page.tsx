"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Activity, ArrowLeft, PartyPopper, Repeat, RotateCw, CheckCircle2, CircleDot, ListChecks } from "lucide-react";

import { ResultCard } from "@/components/results/ResultCard";
import { ScoreGauge } from "@/components/results/ScoreGauge";
import { TopicListCard } from "@/components/results/TopicListCard";
import { useQuizResults } from "@/lib/store";

export default function ResultsPage() {
  const router = useRouter();
  const results = useQuizResults();

  useEffect(() => {
    if (!results) {
      router.replace("/workspace");
    }
  }, [results, router]);

  if (!results) return null;

  const scorePercentage = Math.round((results.score / results.total) * 100);

  const strengths = Array.from(
    new Set(
      results.results
        .filter((r) => r.correct)
        .map((r) => r.topic)
        .filter(Boolean)
    )
  );
  const needsReview = results.weak_topics;

  const stats = [
    { label: "Questions", value: `${results.total}`, icon: ListChecks, color: "#18181B" },
    { label: "Correct", value: `${results.score}`, icon: CheckCircle2, color: "#10B981" },
    { label: "Incorrect", value: `${results.total - results.score}`, icon: CircleDot, color: "#EF4444" },
  ];

  return (
    <main className="mx-auto w-full max-w-[1080px] flex-1 px-7 pb-14 pt-9">
      <section className="rounded-[20px] border border-[#ECECF0] bg-white px-10 py-12 text-center shadow-[0_1px_2px_rgba(24,24,27,0.04)]">
        <ScoreGauge score={scorePercentage} />
        <div className="mt-[26px] inline-flex items-center gap-[9px] rounded-full bg-[#FEF4E7] px-4 py-2 text-[#C2740C]">
          <PartyPopper className="h-[17px] w-[17px]" />
          <span className="text-[15px] font-bold">
            {scorePercentage >= 80 ? "Excellent Progress" : scorePercentage >= 50 ? "Good Effort" : "Review Needed"}
          </span>
        </div>
        <p className="mx-auto mt-3.5 max-w-[440px] text-[15px] leading-relaxed text-[#A1A1AA]">
          {scorePercentage >= 80
            ? "Fantastic job! You've mastered most of the concepts in this study space."
            : "Reviewing your weak topics below will help reinforce these concepts for your exam."}
        </p>
      </section>

      <div className="mt-6 flex flex-wrap gap-6">
        <TopicListCard title="Strengths" topics={strengths} variant="strength" />
        <TopicListCard title="Needs Review" topics={needsReview} variant="review" />
      </div>

      <section className="mt-6 rounded-[20px] border border-[#ECECF0] bg-white p-[26px] shadow-[0_1px_2px_rgba(24,24,27,0.04)]">
        <div className="mb-5 flex items-center gap-[10px]">
          <Activity className="h-[18px] w-[18px] text-[var(--sb-accent)]" />
          <span className="text-[15.5px] font-bold">Timeline</span>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-[14px]">
          {stats.map((stat) => (
            <ResultCard key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      <div className="mt-8 flex flex-wrap justify-center gap-3.5">
        <Link
          href="/revision"
          className="inline-flex items-center gap-[9px] rounded-xl bg-[var(--sb-accent)] px-[26px] py-3.5 text-[15px] font-semibold text-white shadow-[0_4px_14px_rgba(124,58,237,0.30)]"
        >
          <Repeat className="h-[18px] w-[18px]" /> Continue Revision
        </Link>
        <Link
          href="/mission"
          className="inline-flex items-center gap-[9px] rounded-xl border border-[#E4E4E7] bg-white px-6 py-3.5 text-[15px] font-semibold text-[#3F3F46]"
        >
          <RotateCw className="h-[18px] w-[18px]" /> Retake Mission
        </Link>
        <Link
          href="/workspace"
          className="inline-flex items-center gap-[9px] rounded-xl border border-[#E4E4E7] bg-white px-6 py-3.5 text-[15px] font-semibold text-[#3F3F46]"
        >
          <ArrowLeft className="h-[18px] w-[18px]" /> Return to Workspace
        </Link>
      </div>
    </main>
  );
}
