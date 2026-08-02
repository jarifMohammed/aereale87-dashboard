"use client";

import { useState, useRef, useCallback } from "react";
import {
  Upload,
  FileImage,
  X,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Loader2,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";

type UploadStatus = "idle" | "uploading" | "success" | "error";

type FileState = {
  file: File | null;
  preview: string | null;
  status: UploadStatus;
  errorMessage: string | null;
};

const initialFileState: FileState = {
  file: null,
  preview: null,
  status: "idle",
  errorMessage: null,
};

type DropZoneProps = {
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  state: FileState;
  onFileSelect: (file: File) => void;
  onClear: () => void;
  id: string;
};

function DropZone({ label, sublabel, icon, state, onFileSelect, onClear, id }: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  const hasFile = !!state.file;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        {icon}
        <div>
          <p className="text-sm font-bold text-neutral-800">{label}</p>
          <p className="text-xs text-neutral-500">{sublabel}</p>
        </div>
      </div>

      {hasFile && state.preview ? (
        <div className="relative overflow-hidden rounded-xl border-2 border-[#66756d] bg-neutral-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={state.preview}
            alt={label}
            className="h-48 w-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-between p-3">
            <button
              type="button"
              onClick={onClear}
              className="ml-auto flex size-7 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition-colors hover:bg-red-600"
              aria-label="Remove file"
            >
              <X className="size-4" />
            </button>
            <div className="flex items-center justify-between rounded-lg bg-black/50 px-3 py-2 backdrop-blur-sm">
              <span className="truncate text-xs font-medium text-white">{state.file?.name}</span>
              {state.status === "success" && (
                <CheckCircle className="ml-2 size-4 shrink-0 text-green-400" />
              )}
              {state.status === "uploading" && (
                <Loader2 className="ml-2 size-4 shrink-0 animate-spin text-white" />
              )}
              {state.status === "error" && (
                <AlertCircle className="ml-2 size-4 shrink-0 text-red-400" />
              )}
            </div>
          </div>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "flex h-48 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-all",
            isDragging
              ? "border-[#cfaf45] bg-[#cfaf45]/5"
              : "border-stone-300 bg-stone-50 hover:border-[#66756d] hover:bg-[#66756d]/5"
          )}
        >
          <div className="flex size-12 items-center justify-center rounded-full bg-stone-200">
            <Upload className="size-5 text-stone-500" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-neutral-700">
              Drop your file here, or{" "}
              <span className="text-[#66756d] underline underline-offset-2">browse</span>
            </p>
            <p className="mt-1 text-xs text-neutral-400">JPG, PNG, WEBP or PDF — max 5MB</p>
          </div>
        </div>
      )}

      {state.status === "error" && state.errorMessage && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 ring-1 ring-red-200">
          <AlertCircle className="size-3.5 shrink-0" />
          {state.errorMessage}
        </div>
      )}

      {state.status === "success" && (
        <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-xs text-green-700 ring-1 ring-green-200">
          <CheckCircle className="size-3.5 shrink-0" />
          Uploaded successfully!
        </div>
      )}

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        className="sr-only"
        onChange={handleChange}
      />
    </div>
  );
}

type TaxFormsPageProps = {
  accessToken: string;
};

export function TaxFormsPage({ accessToken }: TaxFormsPageProps) {
  const [idFront, setIdFront] = useState<FileState>(initialFileState);
  const [idBack, setIdBack] = useState<FileState>(initialFileState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const handleFileSelect = (side: "front" | "back") => (file: File) => {
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      const setter = side === "front" ? setIdFront : setIdBack;
      setter({
        file: null,
        preview: null,
        status: "error",
        errorMessage: "File too large. Maximum size is 5MB.",
      });
      return;
    }

    const preview = file.type.startsWith("image/") ? URL.createObjectURL(file) : null;
    const setter = side === "front" ? setIdFront : setIdBack;
    setter({ file, preview, status: "idle", errorMessage: null });
  };

  const handleClear = (side: "front" | "back") => () => {
    const prev = side === "front" ? idFront : idBack;
    if (prev.preview) URL.revokeObjectURL(prev.preview);
    const setter = side === "front" ? setIdFront : setIdBack;
    setter(initialFileState);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!idFront.file || !idBack.file) {
      setSubmitStatus("error");
      setSubmitMessage("Please upload both front and back sides of your ID.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setSubmitMessage(null);

    // Update status to uploading
    setIdFront((prev) => ({ ...prev, status: "uploading" }));
    setIdBack((prev) => ({ ...prev, status: "uploading" }));

    try {
      const formData = new FormData();
      formData.append("idFront", idFront.file);
      formData.append("idBack", idBack.file);

      const res = await fetch("/api/author/tax-forms", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const json = (await res.json()) as { message?: string; error?: string };

      if (!res.ok) {
        throw new Error(json.error ?? json.message ?? "Upload failed");
      }

      setIdFront((prev) => ({ ...prev, status: "success" }));
      setIdBack((prev) => ({ ...prev, status: "success" }));
      setSubmitStatus("success");
      setSubmitMessage(json.message ?? "Your ID documents have been submitted for review.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setIdFront((prev) => ({ ...prev, status: "error", errorMessage: message }));
      setIdBack((prev) => ({ ...prev, status: "error", errorMessage: message }));
      setSubmitStatus("error");
      setSubmitMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = !!idFront.file && !!idBack.file && !isSubmitting;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Page Header */}
      <div className="rounded-2xl bg-[#24352f] px-8 py-6 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-[#cfaf45]">
            <ShieldCheck className="size-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold leading-tight">Tax Forms & Identity Verification</h1>
            <p className="mt-1 text-sm text-white/70">
              Upload your government-issued ID to verify your identity and unlock payouts.
            </p>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 rounded-xl bg-[#cfaf45]/10 px-4 py-4 ring-1 ring-[#cfaf45]/30">
        <AlertCircle className="mt-0.5 size-5 shrink-0 text-[#cfaf45]" />
        <div className="text-sm text-neutral-700">
          <p className="font-semibold">Why do we need this?</p>
          <p className="mt-0.5 text-neutral-500">
            Identity verification is required by financial regulations for all authors receiving
            payouts. Your documents are encrypted and reviewed only by our compliance team.
          </p>
        </div>
      </div>

      {/* Upload Form */}
      <form onSubmit={(e) => void handleSubmit(e)}>
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <div className="mb-6 flex items-center gap-2 border-b border-stone-100 pb-4">
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#66756d]">
              <CreditCard className="size-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">Government-Issued ID Upload</h2>
              <p className="text-xs text-neutral-500">
                Passport, National ID, or Driver&apos;s License
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <DropZone
              id="id-front"
              label="Front Side"
              sublabel="Photo / information page"
              icon={<FileImage className="size-5 text-[#66756d]" />}
              state={idFront}
              onFileSelect={handleFileSelect("front")}
              onClear={handleClear("front")}
            />
            <DropZone
              id="id-back"
              label="Back Side"
              sublabel="Signature / barcode page"
              icon={<FileImage className="size-5 text-[#cfaf45]" />}
              state={idBack}
              onFileSelect={handleFileSelect("back")}
              onClear={handleClear("back")}
            />
          </div>

          {/* Submit Status */}
          {submitStatus === "success" && submitMessage && (
            <div className="mt-6 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 ring-1 ring-green-200">
              <CheckCircle className="size-4 shrink-0" />
              {submitMessage}
            </div>
          )}
          {submitStatus === "error" && submitMessage && (
            <div className="mt-6 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-200">
              <AlertCircle className="size-4 shrink-0" />
              {submitMessage}
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-6 flex items-center justify-between border-t border-stone-100 pt-5">
            <p className="text-xs text-neutral-400">
              Documents are securely encrypted and stored. Reviewed within 1–3 business days.
            </p>
            <button
              type="submit"
              disabled={!canSubmit}
              className={cn(
                "flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-bold text-white transition-all",
                canSubmit
                  ? "bg-[#24352f] hover:bg-[#1a2620] active:scale-[0.98]"
                  : "cursor-not-allowed bg-stone-300 text-stone-400"
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Uploading…
                </>
              ) : (
                <>
                  <Upload className="size-4" />
                  Submit Documents
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Accepted Documents */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
        <h2 className="mb-4 text-base font-bold text-neutral-900">Accepted Documents</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {["Passport", "National ID Card", "Driver's License"].map((doc) => (
            <div
              key={doc}
              className="flex items-center gap-3 rounded-xl bg-stone-50 px-4 py-3 ring-1 ring-stone-200"
            >
              <div className="flex size-8 items-center justify-center rounded-full bg-[#66756d]/10">
                <ShieldCheck className="size-4 text-[#66756d]" />
              </div>
              <span className="text-sm font-medium text-neutral-700">{doc}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-neutral-400">
          The document must be government-issued, valid (not expired), and clearly legible in the
          photo.
        </p>
      </div>
    </div>
  );
}
