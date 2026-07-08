export interface UploadedDocument {
  id: string;
  filename: string;
  status: "processing" | "ready" | "failed";
}

export interface UploadFilesResponse {
  status: string;
  documents: UploadedDocument[];
}
