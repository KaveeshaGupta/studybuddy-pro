export interface StudySpaceDocument {
  filename: string;
  pages: number;
}

export interface StudySpace {
  id: string;
  name: string;
  documents: StudySpaceDocument[];
  totalChunks: number;
  createdAt: string;
}
