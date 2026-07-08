export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
}

export interface GenerateQuizRequest {
  sessionId: string;
  topic?: string;
  numQuestions: number;
}

export interface GenerateQuizResponse {
  status: string;
  questions: QuizQuestion[];
}

export interface QuizAnswer {
  questionId: string;
  selectedOptionIndex: number;
}

export interface EvaluateQuizRequest {
  sessionId: string;
  answers: QuizAnswer[];
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  weakTopics: string[];
}

export interface EvaluateQuizResponse {
  status: string;
  result: QuizResult;
}
