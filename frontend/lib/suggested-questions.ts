import type { StudySpace } from "@/types/study-space";

function stripExtension(filename: string): string {
  return filename.replace(/\.[^./\\]+$/, "");
}

/** Generic questions grounded in the real uploaded document names — there's
 * no backend topic-extraction endpoint yet, so this is the most honest
 * "metadata-driven" set we can offer today. */
export function deriveSuggestedQuestions(studySpace: StudySpace): string[] {
  const [first, second] = studySpace.documents.map((d) => stripExtension(d.filename));
  if (!first) return [];

  const questions = [
    `Summarize the key ideas in ${first}.`,
    `What topics should I focus on for ${studySpace.name}?`,
  ];

  questions.push(second ? `How does ${first} relate to ${second}?` : `Quiz me on ${first}.`);

  return questions;
}
