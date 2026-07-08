export interface UploadedFileInfo {
  filename: string;
  pages: number;
}

export interface UploadFilesResponse {
  success: boolean;
  files: UploadedFileInfo[];
  total_chunks: number;
}

export interface UploadProgressEvent {
  loaded: number;
  total: number;
  percent: number;
}
