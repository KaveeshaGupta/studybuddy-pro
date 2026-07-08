/** Shapes matching the real backend (POST /api/quiz, POST /api/evaluate). */
export interface QuizQuestion {
  id: number;
  type: "mcq" | "short_answer";
  question: string;
  options?: string[];
  correct_answer: string;
  topic: string;
}

export interface QuizProgress {
  questions: QuizQuestion[];
  currentIndex: number;
  answers: Record<number, string>;
}

export interface QuizResultItem {
  question_id: number;
  correct: boolean;
  topic: string;
  correct_answer: string;
  user_answer: string;
}

export interface QuizResults {
  results: QuizResultItem[];
  weak_topics: string[];
  score: number;
  total: number;
}
