"use client";

import { useState } from "react";

import { MissionCard } from "@/components/mission/MissionCard";
import { MissionDetailsCard } from "@/components/mission/MissionDetailsCard";
import { missionDetails, missionQuestions } from "@/lib/placeholder-data";

export default function MissionPage() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const total = missionQuestions.length;
  const question = missionQuestions[current];

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-wrap items-start gap-6 px-7 pb-10 pt-[26px]">
      <MissionCard
        subtitle="DBMS Midsem Notes"
        current={current + 1}
        total={total}
        question={question.question}
        options={question.options}
        selectedIndex={answers[current] ?? null}
        onSelect={(index) =>
          setAnswers((prev) => ({ ...prev, [current]: index }))
        }
        onPrev={() => setCurrent((c) => Math.max(0, c - 1))}
        onNext={() => setCurrent((c) => Math.min(total - 1, c + 1))}
      />
      <MissionDetailsCard details={missionDetails} />
    </main>
  );
}
