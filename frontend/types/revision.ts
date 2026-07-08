export interface RevisionRequest {
  weak_topics: string[];
}

export interface RevisionSummary {
  topic: string;
  summary: string;
  citations: string[];
}

export interface GenerateRevisionResponse {
  summaries: RevisionSummary[];
}
