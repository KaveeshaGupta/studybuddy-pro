import type { ParsedCitation } from "@/types/chat";

/** Backend citations arrive as one formatted string, e.g. "DBMS.pdf p.17". */
const CITATION_PATTERN = /^(.*)\s+p\.(.+)$/;

export function parseCitation(raw: string, index: number): ParsedCitation {
  const match = CITATION_PATTERN.exec(raw);
  if (!match) {
    return { key: `${raw}-${index}`, file: raw, page: "" };
  }
  const [, file, page] = match;
  return { key: `${file}-${page}-${index}`, file, page: `Page ${page}` };
}

export function parseCitations(raw: string[]): ParsedCitation[] {
  return raw.map(parseCitation);
}
