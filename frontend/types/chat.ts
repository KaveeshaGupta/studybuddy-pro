export interface Citation {
  documentId: string;
  filename: string;
  page: number;
  snippet: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations: Citation[];
}

export interface ChatRequest {
  sessionId: string;
  message: string;
}

export interface ChatResponse {
  status: string;
  message: ChatMessage;
}
