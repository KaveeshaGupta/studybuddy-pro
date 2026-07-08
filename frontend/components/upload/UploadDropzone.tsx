interface UploadDropzoneProps {
  onFilesSelected?: (files: File[]) => void;
}

export function UploadDropzone(_props: UploadDropzoneProps) {
  return <div className="rounded-lg border border-dashed p-8 text-center" />;
}
