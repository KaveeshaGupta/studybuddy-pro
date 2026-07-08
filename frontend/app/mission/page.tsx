"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { MissionCard } from "@/components/mission/MissionCard";
import { MissionDetailsCard } from "@/components/mission/MissionDetailsCard";
import { MissionError } from "@/components/mission/MissionError";
import { MissionLoading } from "@/components/mission/MissionLoading";
import { missionDetails } from "@/lib/placeholder-data";
import {
  useHasHydrated,
  useQuizProgress,
  useSetQuizAnswer,
  useSetQuizCurrentIndex,
  useSetQuizProgress,
  useStudySpace,
} from "@/lib/store";
import { generateQuiz } from "@/services/api";

const STAGES = [
  "Preparing your mission...",
  "Analyzing notes...",
  "Generating grounded questions...",
];
const READY_MESSAGE = "Mission Ready.";
const STAGE_INTERVAL_MS = 900;
const READY_FLASH_MS = 600;

type Phase = "loading" | "ready" | "error";

function isAnswered(value: string | undefined): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

export default function MissionPage() {
  const router = useRouter();
  const hasHydrated = useHasHydrated();
  const studySpace = useStudySpace();
  const quizProgress = useQuizProgress();
  const setQuizProgress = useSetQuizProgress();
  const setQuizAnswer = useSetQuizAnswer();
  const setQuizCurrentIndex = useSetQuizCurrentIndex();

  const [phase, setPhase] = useState<Phase>("loading");
  const [stageIndex, setStageIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const stageTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (hasHydrated && !studySpace) {
      router.replace("/");
    }
  }, [hasHydrated, studySpace, router]);

  async function fetchQuiz() {
    setPhase("loading");
    setErrorMessage(null);
    setStageIndex(0);

    if (stageTimer.current) clearInterval(stageTimer.current);
    stageTimer.current = setInterval(() => {
      setStageIndex((i) => Math.min(i + 1, STAGES.length - 1));
    }, STAGE_INTERVAL_MS);

    try {
      const response = await generateQuiz();
      if (stageTimer.current) clearInterval(stageTimer.current);
      setStageIndex(STAGES.length);
      setQuizProgress({ questions: response.questions, currentIndex: 0, answers: {} });
      window.setTimeout(() => setPhase("ready"), READY_FLASH_MS);
    } catch (err) {
      if (stageTimer.current) clearInterval(stageTimer.current);
      setPhase("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong generating your mission.",
      );
    }
  }

  useEffect(() => {
    if (!hasHydrated || !studySpace || fetchedRef.current) return;
    fetchedRef.current = true;

    if (quizProgress) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time resume, guarded by fetchedRef, not derived state
      setPhase("ready");
      return;
    }
    void fetchQuiz();

    return () => {
      if (stageTimer.current) clearInterval(stageTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally runs once; fetchedRef guards re-entry
  }, [hasHydrated, studySpace]);

  if (!studySpace) {
    return null;
  }

  if (phase === "error") {
    return (
      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-wrap items-start gap-6 px-7 pb-10 pt-[26px]">
        <MissionError
          message={errorMessage ?? "Something went wrong generating your mission."}
          onRetry={fetchQuiz}
          onReturnToWorkspace={() => router.push("/workspace")}
        />
      </main>
    );
  }

  if (phase === "loading" || !quizProgress) {
    const stageText = stageIndex < STAGES.length ? STAGES[stageIndex] : READY_MESSAGE;
    const progressPercent = Math.min(
      100,
      Math.round(((stageIndex + 1) / (STAGES.length + 1)) * 100),
    );
    return (
      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-wrap items-start gap-6 px-7 pb-10 pt-[26px]">
        <MissionLoading stageText={stageText} progressPercent={progressPercent} />
      </main>
    );
  }

  const { questions, currentIndex, answers } = quizProgress;
  const total = questions.length;
  const question = questions[currentIndex];
  const isLast = currentIndex === total - 1;
  const allAnswered = questions.every((q) => isAnswered(answers[q.id]));

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-wrap items-start gap-6 px-7 pb-10 pt-[26px]">
      <MissionCard
        subtitle={studySpace.name}
        current={currentIndex + 1}
        total={total}
        questionType={question.type}
        question={question.question}
        options={question.options ?? []}
        selectedLetter={question.type === "mcq" ? (answers[question.id] ?? null) : null}
        onSelectLetter={(letter) => setQuizAnswer(question.id, letter)}
        shortAnswerValue={question.type === "short_answer" ? (answers[question.id] ?? "") : ""}
        onShortAnswerChange={(value) => setQuizAnswer(question.id, value)}
        onPrev={() => setQuizCurrentIndex(Math.max(0, currentIndex - 1))}
        onNext={() => {
          if (isLast) {
            if (!allAnswered) return;
            router.push("/results");
            return;
          }
          setQuizCurrentIndex(Math.min(total - 1, currentIndex + 1));
        }}
        isLast={isLast}
        canFinish={allAnswered}
      />
      <MissionDetailsCard details={missionDetails} />
    </main>
  );
}
