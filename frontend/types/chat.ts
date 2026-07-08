/** Shape actually sent to / returned by the backend's POST /api/chat. */
export interface ChatHistoryTurn {
  role: "user" | "assistant";
  content: string;
}

export interface ChatApiRequest {
  question: string;
  chat_history?: ChatHistoryTurn[];
}

export interface ChatApiResponse {
  answer: string;
  citations: string[];
}

/** A parsed citation ready for display — backend citations arrive as a
 * single formatted string (e.g. "DBMS.pdf p.17"); we split that once here
 * so components never need to know the wire format. */
export interface ParsedCitation {
  key: string;
  file: string;
  page: string;
}

/** A chat turn as kept in the persisted store.
 * `kind` distinguishes special assistant renderings: "kb-ready" is the
 * structured post-upload message, "fallback" is a no-answer/error turn
 * (shows recovery actions instead of the normal answer chips), "text" is
 * a normal markdown-rendered answer. Absent on older persisted messages —
 * treat as "text". */
export interface StoredChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations: ParsedCitation[];
  createdAt: string;
  kind?: "text" | "kb-ready" | "fallback";
}
