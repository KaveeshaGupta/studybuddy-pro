import type { UploadFilesResponse } from "@/types/upload";
import type { ChatRequest, ChatResponse } from "@/types/chat";
import type {
  EvaluateQuizRequest,
  EvaluateQuizResponse,
  GenerateQuizRequest,
  GenerateQuizResponse,
} from "@/types/quiz";
import type {
  GenerateRevisionResponse,
  RevisionRequest,
} from "@/types/revision";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function uploadFiles(
  _files: File[],
): Promise<UploadFilesResponse> {
  throw new Error("Not implemented");
}

export async function chat(_request: ChatRequest): Promise<ChatResponse> {
  throw new Error("Not implemented");
}

export async function generateQuiz(
  _request: GenerateQuizRequest,
): Promise<GenerateQuizResponse> {
  throw new Error("Not implemented");
}

export async function evaluateQuiz(
  _request: EvaluateQuizRequest,
): Promise<EvaluateQuizResponse> {
  throw new Error("Not implemented");
}

export async function generateRevision(
  _request: RevisionRequest,
): Promise<GenerateRevisionResponse> {
  throw new Error("Not implemented");
}
