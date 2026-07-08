export interface TopicMastery {
  topic: string;
  masteryPercent: number;
}

export interface ProgressSnapshot {
  sessionId: string;
  topics: TopicMastery[];
}
