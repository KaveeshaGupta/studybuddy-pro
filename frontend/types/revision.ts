export interface RevisionRequest {
  sessionId: string;
}

export interface RevisionSummary {
  topic: string;
  summary: string;
}

export interface GenerateRevisionResponse {
  status: string;
  summaries: RevisionSummary[];
}
