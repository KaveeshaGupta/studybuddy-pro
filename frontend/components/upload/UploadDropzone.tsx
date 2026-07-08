"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, FileUp } from "lucide-react";

import { uploadFiles } from "@/services/api";
import { useSetStudySpace } from "@/lib/store";
import { uploadFileTypes } from "@/lib/placeholder-data";
import { cn } from "@/lib/utils";
import type { UploadedFileInfo } from "@/types/upload";

const SUPPORTED_EXTENSIONS = [".pdf"];
const PICKER_ACCEPT = ".pdf,.ppt,.pptx,.doc,.docx,.txt";
const MAX_FILES = 10;
const MAX_FILE_SIZE_BYTES = 200 * 1024 * 1024;
const STAGE_INTERVAL_MS = 1100;

const PROCESSING_STAGES = [
  "Reading documents...",
  "Extracting text...",
  "Creating chunks...",
  "Generating embeddings...",
];
const READY_MESSAGE = "Knowledge base ready.";

type Phase = "idle" | "uploading" | "success" | "error";

function fileExtension(filename: string): string {
  const match = /\.[^./\\]+$/.exec(filename);
  return match ? match[0].toLowerCase() : "";
}

function studySpaceName(files: UploadedFileInfo[]): string {
  const stripExt = (name: string) => name.replace(/\.[^./\\]+$/, "");
  if (files.length === 1) return stripExt(files[0].filename);
  return `${stripExt(files[0].filename)} + ${files.length - 1} more`;
}

export function UploadDropzone() {
  const router = useRouter();
  const setStudySpace = useSetStudySpace();

  const [dragging, setDragging] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [stageIndex, setStageIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [rejectedNames, setRejectedNames] = useState<string[]>([]);

  const stageTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (stageTimer.current) clearInterval(stageTimer.current);
    };
  }, []);

  async function handleFiles(fileList: FileList | File[]) {
    if (phase === "uploading") return;

    const incoming = Array.from(fileList);
    if (incoming.length === 0) return;

    const limited = incoming.slice(0, MAX_FILES);
    const accepted: File[] = [];
    const rejected: string[] = [];

    for (const file of limited) {
      const ext = fileExtension(file.name);
      if (!SUPPORTED_EXTENSIONS.includes(ext)) {
        rejected.push(`${file.name} (unsupported format)`);
      } else if (file.size > MAX_FILE_SIZE_BYTES) {
        rejected.push(`${file.name} (over 200MB)`);
      } else {
        accepted.push(file);
      }
    }

    setRejectedNames(rejected);

    if (accepted.length === 0) {
      setPhase("error");
      setErrorMessage("No supported files to upload — only PDF is supported right now.");
      return;
    }

    setPhase("uploading");
    setErrorMessage(null);
    setProgressPercent(0);
    setStageIndex(0);

    stageTimer.current = setInterval(() => {
      setStageIndex((i) => Math.min(i + 1, PROCESSING_STAGES.length - 1));
    }, STAGE_INTERVAL_MS);

    try {
      const response = await uploadFiles(accepted, (event) => {
        setProgressPercent(event.percent);
      });

      if (stageTimer.current) clearInterval(stageTimer.current);
      setStageIndex(PROCESSING_STAGES.length - 1);
      setProgressPercent(100);
      setPhase("success");

      setStudySpace({
        id: crypto.randomUUID(),
        name: studySpaceName(response.files),
        documents: response.files,
        totalChunks: response.total_chunks,
        createdAt: new Date().toISOString(),
      });

      window.setTimeout(() => {
        router.push("/workspace");
      }, 700);
    } catch (err) {
      if (stageTimer.current) clearInterval(stageTimer.current);
      setPhase("error");
      setErrorMessage(err instanceof Error ? err.message : "Upload failed. Please try again.");
    }
  }

  function reset() {
    setPhase("idle");
    setErrorMessage(null);
    setRejectedNames([]);
    setProgressPercent(0);
    setStageIndex(0);
  }

  const busy = phase === "uploading" || phase === "success";

  return (
    <div className="rounded-[20px] border border-[#ECECF0] bg-white p-3.5 shadow-[0_1px_2px_rgba(24,24,27,0.04)]">
      <label
        onDragOver={(e) => {
          e.preventDefault();
          if (!busy) setDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (!busy) void handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex flex-col items-center rounded-2xl border-[1.5px] border-dashed px-5 py-[38px] text-center transition-colors duration-200",
          busy ? "cursor-default" : "cursor-pointer",
          dragging
            ? "border-[rgba(124,58,237,0.6)] bg-[rgba(124,58,237,0.05)]"
            : "border-[#D6D3EA] bg-[#FCFBFF]",
        )}
      >
        <input
          type="file"
          multiple
          className="sr-only"
          accept={PICKER_ACCEPT}
          disabled={busy}
          onChange={(e) => {
            if (e.target.files) void handleFiles(e.target.files);
            e.target.value = "";
          }}
        />

        <div className="mb-[18px] flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F3F1FD]">
          {phase === "success" ? (
            <CheckCircle2 className="h-[30px] w-[30px] text-[var(--sb-accent)]" />
          ) : (
            <FileUp className="h-[30px] w-[30px] text-[var(--sb-accent)]" />
          )}
        </div>

        {phase === "idle" && (
          <>
            <div className="text-[19px] font-bold tracking-[-0.01em] text-[#18181B]">
              Drop your PDF or DOC here
            </div>
            <div className="mt-[5px] text-sm text-[#A1A1AA]">or click to browse</div>

            <div className="mt-[22px] flex flex-wrap justify-center gap-2.5">
              {uploadFileTypes.map((t) => (
                <span
                  key={t.tag}
                  className="inline-flex items-center gap-2 rounded-[11px] border border-[#E9E9EE] bg-white py-2 pl-2 pr-[13px] text-[13px] font-semibold text-[#3F3F46] shadow-[0_1px_2px_rgba(24,24,27,0.04)]"
                >
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded-[7px] text-[9px] font-bold text-white"
                    style={{ background: t.bg }}
                  >
                    {t.tag}
                  </span>
                  {t.label}
                </span>
              ))}
            </div>

            <div className="mt-[22px] text-[13px] text-[#A1A1AA]">
              Max 10 files &nbsp;•&nbsp; Up to 200MB each
            </div>
          </>
        )}

        {(phase === "uploading" || phase === "success") && (
          <>
            <div className="text-[19px] font-bold tracking-[-0.01em] text-[#18181B]">
              {phase === "success" ? READY_MESSAGE : PROCESSING_STAGES[stageIndex]}
            </div>
            <div className="mt-[5px] text-sm text-[#A1A1AA]">
              {phase === "success" ? "Redirecting to your workspace…" : "This can take a moment for larger files."}
            </div>
            <div className="mt-[22px] w-full max-w-[220px]">
              <div className="h-1 overflow-hidden rounded-full bg-[#F0F0F3]">
                <div
                  className="h-full rounded-full bg-[var(--sb-accent)] transition-[width] duration-300 ease-out"
                  style={{ width: `${phase === "success" ? 100 : progressPercent}%` }}
                />
              </div>
            </div>
          </>
        )}

        {phase === "error" && (
          <>
            <div className="text-[19px] font-bold tracking-[-0.01em] text-[#18181B]">
              Upload failed
            </div>
            <div className="mt-[5px] max-w-[260px] text-sm text-[#E11D48]">{errorMessage}</div>
            {rejectedNames.length > 0 && (
              <ul className="mt-3 max-w-[260px] text-[12.5px] text-[#A1A1AA]">
                {rejectedNames.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                reset();
              }}
              className="mt-[18px] text-[13.5px] font-semibold text-[var(--sb-accent)]"
            >
              Try again
            </button>
          </>
        )}
      </label>
    </div>
  );
}
