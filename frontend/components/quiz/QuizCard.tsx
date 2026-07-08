import type { QuizQuestion } from "@/types/quiz";

interface QuizCardProps {
  question: QuizQuestion;
}

export function QuizCard(_props: QuizCardProps) {
  return <div className="rounded-lg border p-4" />;
}
