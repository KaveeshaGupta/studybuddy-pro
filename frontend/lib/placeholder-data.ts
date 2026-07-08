import {
  BarChart2,
  BookOpen,
  CheckCircle2,
  Clock,
  CircleDot,
  ClipboardList,
  FileText,
  Flag,
  Layers,
  Lightbulb,
  ListChecks,
  MessageCircle,
  PencilLine,
  Repeat,
  Target,
  Wand2,
  Zap,
  type LucideIcon,
} from "lucide-react";

/**
 * Placeholder content mirroring the approved design (Design.zip).
 * Swap these for live API data during backend integration — no
 * component below should need to change shape when that happens.
 */

export interface QuickAction {
  title: string;
  sub: string;
  icon: LucideIcon;
  tint: string;
  color: string;
  onClick?: () => void;
}

export const homeQuickActions: QuickAction[] = [
  { title: "Ask a Question", sub: "Chat with your notes", icon: MessageCircle, tint: "#F1EEFD", color: "#7C3AED" },
  { title: "Start a Quiz", sub: "Generate practice quiz", icon: PencilLine, tint: "#FEF0E4", color: "#F97316" },
  { title: "Weak Topics", sub: "Focus on what you miss", icon: Target, tint: "#FDE9EC", color: "#E11D48" },
  { title: "AI Tutor", sub: "Learn with explanations", icon: BookOpen, tint: "#E6EEFE", color: "#2563EB" },
];

export const workspaceQuickActions: QuickAction[] = [
  { title: "Start Mission", sub: "Practice with a guided quiz", icon: Flag, tint: "#F1EEFD", color: "#7C3AED" },
  { title: "Browse Notes", sub: "Open the source document", icon: FileText, tint: "#E6EEFE", color: "#2563EB" },
  { title: "Revision", sub: "Review your weak topics", icon: Repeat, tint: "#FEF0E4", color: "#F97316" },
];

export interface StudySpaceSummary {
  title: string;
  meta: string;
  pct: number;
  barColor: string;
  iconColor: string;
}

export const recentStudySpaces: StudySpaceSummary[] = [
  { title: "DBMS Midsem Notes", meta: "84 pages • 214 chunks", pct: 82, barColor: "#16A34A", iconColor: "#7C3AED" },
  { title: "Operating Systems", meta: "67 pages • 147 chunks", pct: 67, barColor: "#EAB308", iconColor: "#16A34A" },
  { title: "Computer Networks", meta: "102 pages • 301 chunks", pct: 91, barColor: "#2563EB", iconColor: "#F97316" },
];

export interface UploadFileType {
  tag: string;
  label: string;
  bg: string;
}

export const uploadFileTypes: UploadFileType[] = [
  { tag: "PDF", label: "PDF", bg: "#EF4444" },
  { tag: "PPT", label: "PPT", bg: "#F97316" },
  { tag: "DOC", label: "DOC", bg: "#2563EB" },
  { tag: "TXT", label: "TXT", bg: "#475569" },
];

export interface MissionQuestion {
  question: string;
  options: string[];
}

export const missionQuestions: MissionQuestion[] = [
  { question: "Which normal form eliminates transitive dependencies?", options: ["First Normal Form (1NF)", "Second Normal Form (2NF)", "Third Normal Form (3NF)", "Boyce-Codd Normal Form"] },
  { question: 'What does the ACID property "Isolation" guarantee?', options: ["Data survives system failure", "Concurrent transactions do not interfere", "All operations complete or none do", "Data stays valid after commit"] },
  { question: "Which SQL clause is used to filter grouped rows?", options: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"] },
  { question: "A foreign key in a table refers to what in another table?", options: ["Any indexed column", "A candidate key", "The primary key", "A composite attribute"] },
  { question: "Which join returns only matching rows from both tables?", options: ["LEFT JOIN", "FULL OUTER JOIN", "INNER JOIN", "CROSS JOIN"] },
  { question: "What is the primary purpose of database indexing?", options: ["Reduce storage size", "Speed up data retrieval", "Enforce constraints", "Encrypt records"] },
  { question: "Which command permanently saves a transaction?", options: ["SAVE", "COMMIT", "FLUSH", "PERSIST"] },
  { question: "A relation with no partial dependencies is at least in?", options: ["1NF", "2NF", "3NF", "BCNF"] },
  { question: "What does a candidate key uniquely identify?", options: ["A column", "A table", "A tuple (row)", "A schema"] },
  { question: "Which operation combines rows from two relations?", options: ["Selection", "Projection", "Join", "Division"] },
];

export interface MissionDetail {
  icon: LucideIcon;
  label: string;
  value: string;
  valueColor?: string;
}

export const missionDetails: MissionDetail[] = [
  { icon: Clock, label: "Estimated Time", value: "15 min" },
  { icon: BarChart2, label: "Difficulty", value: "Intermediate" },
  { icon: Layers, label: "Topics Covered", value: "4 topics" },
  { icon: Zap, label: "XP Earned", value: "+120 XP", valueColor: "#7C3AED" },
];

export const resultStrengths = ["Normalization", "SQL", "Relationships"];
export const resultNeedsReview = ["Transactions", "Concurrency", "Locks"];

export interface TimelineStat {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
}

export const timelineStats: TimelineStat[] = [
  { label: "Questions answered", value: "10", icon: ListChecks, color: "#18181B" },
  { label: "Correct", value: "8", icon: CheckCircle2, color: "#2563EB" },
  { label: "Incorrect", value: "2", icon: CircleDot, color: "#F97316" },
  { label: "Time", value: "12:40", icon: Clock, color: "#18181B" },
];

export interface AnswerAction {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
}

export const sampleAnswerActions: AnswerAction[] = [
  { label: "Explain Simpler", icon: Wand2 },
  { label: "Generate Example", icon: Lightbulb },
  { label: "Create Quiz Question", icon: ClipboardList },
];
