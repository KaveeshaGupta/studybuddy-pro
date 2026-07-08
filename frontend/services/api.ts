import type { UploadFilesResponse, UploadProgressEvent } from "@/types/upload";
import type { ChatApiRequest, ChatApiResponse, ChatHistoryTurn } from "@/types/chat";
import type { QuizQuestion, QuizResults } from "@/types/quiz";
import type {
  GenerateRevisionResponse,
  RevisionRequest,
} from "@/types/revision";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/**
 * All network access for the app lives in this module — components call
 * these functions, never `fetch`/`XMLHttpRequest` directly.
 */

export function uploadFiles(
  files: File[],
  onProgress?: (event: UploadProgressEvent) => void,
): Promise<UploadFilesResponse> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    for (const file of files) {
      formData.append("files", file);
    }

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_BASE_URL}/api/upload`);

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || !onProgress) return;
      onProgress({
        loaded: event.loaded,
        total: event.total,
        percent: Math.round((event.loaded / event.total) * 100),
      });
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText) as UploadFilesResponse);
        } catch {
          reject(new Error("The server returned an unexpected response."));
        }
      } else {
        reject(
          new Error(
            `Upload failed (${xhr.status}). The file may be in an unsupported format.`,
          ),
        );
      }
    };

    xhr.onerror = () => {
      reject(new Error("Couldn't reach the server. Is the backend running?"));
    };

    xhr.send(formData);
  });
}

export async function sendChatMessage(
  question: string,
  chatHistory: ChatHistoryTurn[] = [],
): Promise<ChatApiResponse> {
  const body: ChatApiRequest = { question, chat_history: chatHistory };

  const res = await fetch(`${API_BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Chat request failed (${res.status}).`);
  }

  return (await res.json()) as ChatApiResponse;
}

export async function generateQuiz(): Promise<{ questions: QuizQuestion[] }> {
  throw new Error("Not implemented");
}

export async function evaluateQuiz(_request: {
  questions: QuizQuestion[];
  answers: string[];
}): Promise<QuizResults> {
  throw new Error("Not implemented");
}

export async function generateRevision(
  _request: RevisionRequest,
): Promise<GenerateRevisionResponse> {
  throw new Error("Not implemented");
}
