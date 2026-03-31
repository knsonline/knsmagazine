"use client";
/* eslint-disable @next/next/no-img-element */

import type { ChangeEvent } from "react";
import { useRef, useState } from "react";
import type { PreparedImageFile } from "@/lib/storage/image-processing-client";
import type { StorageImageUploadResult } from "@/lib/storage/images";
import { formatBytes } from "@/lib/storage/images";

type UploadState =
  | { status: "idle"; message: string }
  | { status: "success"; message: string }
  | { status: "error"; message: string }
  | { status: "uploading"; message: string };

interface ImageUploaderFieldNames {
  url: string;
  storagePath: string;
  previousStoragePath: string;
}

interface ImageUploaderProps {
  initialUrl?: string | null;
  disabled?: boolean;
  onUploadingChange?: (isUploading: boolean) => void;
  uploadEndpoint: string;
  fileInputId: string;
  assetName: string;
  acceptAttribute: string;
  acceptDisplayLabel: string;
  maxFileSizeBytes: number;
  targetMaxDimension: number;
  previewAspectClassName?: string;
  emptyPreviewMessage: string;
  replaceHintMessage: string;
  fieldNames: ImageUploaderFieldNames;
  extractStoragePath: (url: string | null | undefined) => string | null;
  validateFile: (file: File) => string | null;
  prepareFile: (file: File) => Promise<PreparedImageFile>;
}

async function removeUploadedImage(uploadEndpoint: string, path: string) {
  const response = await fetch(uploadEndpoint, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ path }),
  });

  if (!response.ok) {
    throw new Error("기존 업로드 파일 정리에 실패했어요.");
  }
}

export function ImageUploader({
  initialUrl,
  disabled = false,
  onUploadingChange,
  uploadEndpoint,
  fileInputId,
  assetName,
  acceptAttribute,
  acceptDisplayLabel,
  maxFileSizeBytes,
  targetMaxDimension,
  previewAspectClassName = "aspect-[16/10]",
  emptyPreviewMessage,
  replaceHintMessage,
  fieldNames,
  extractStoragePath,
  validateFile,
  prepareFile,
}: ImageUploaderProps) {
  const initialStoragePath = extractStoragePath(initialUrl);
  const [previewUrl, setPreviewUrl] = useState(initialUrl ?? "");
  const [imageUrl, setImageUrl] = useState(initialUrl ?? "");
  const [storagePath, setStoragePath] = useState(initialStoragePath ?? "");
  const [uploadState, setUploadState] = useState<UploadState>({
    status: "idle",
    message: `${acceptDisplayLabel} 파일을 선택하면 자동으로 최적화 후 업로드돼요.`,
  });
  const inputRef = useRef<HTMLInputElement | null>(null);

  const setUploading = (nextValue: boolean) => {
    onUploadingChange?.(nextValue);
  };

  const handleClear = async () => {
    if (storagePath && storagePath !== initialStoragePath) {
      await removeUploadedImage(uploadEndpoint, storagePath).catch(() => undefined);
    }

    setPreviewUrl("");
    setImageUrl("");
    setStoragePath("");
    setUploadState({
      status: "idle",
      message: `${assetName}을 제거했어요. 저장하면 기존 ${assetName}이 비워집니다.`,
    });

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const validationError = validateFile(file);

    if (validationError) {
      setUploadState({
        status: "error",
        message: validationError,
      });
      event.target.value = "";
      return;
    }

    setUploading(true);
    setUploadState({
      status: "uploading",
      message: `${assetName}를 최적화하고 업로드하고 있어요...`,
    });

    try {
      const prepared = await prepareFile(file);
      const formData = new FormData();

      formData.append("file", prepared.file);

      const response = await fetch(uploadEndpoint, {
        method: "POST",
        body: formData,
      });

      const result = (await response.json().catch(() => null)) as
        | (StorageImageUploadResult & { error?: undefined })
        | { error?: string }
        | null;

      if (!response.ok || !result || !("publicUrl" in result) || !("path" in result)) {
        throw new Error(result?.error ?? `${assetName} 업로드에 실패했어요. 잠시 후 다시 시도해 주세요.`);
      }

      if (storagePath && storagePath !== initialStoragePath) {
        await removeUploadedImage(uploadEndpoint, storagePath).catch(() => undefined);
      }

      setPreviewUrl(result.publicUrl);
      setImageUrl(result.publicUrl);
      setStoragePath(result.path);
      setUploadState({
        status: "success",
        message: `업로드 완료: ${prepared.width}x${prepared.height}, ${formatBytes(prepared.originalSize)} -> ${formatBytes(prepared.outputSize)}`,
      });
    } catch (error) {
      setUploadState({
        status: "error",
        message: error instanceof Error ? error.message : `${assetName} 업로드 중 오류가 발생했어요.`,
      });
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="space-y-3 rounded-3xl border border-black/8 bg-white p-4">
      <div className="space-y-1">
        <label className="text-sm font-semibold text-text-primary" htmlFor={fileInputId}>
          {assetName}
        </label>
        <p className="text-sm text-text-secondary">
          최대 {formatBytes(maxFileSizeBytes)}, 긴 변 {targetMaxDimension}px 기준으로 브라우저에서 자동 최적화 후 업로드됩니다.
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl bg-ivory p-4 lg:flex-row lg:items-start">
        <div
          className={`relative w-full overflow-hidden rounded-2xl border border-black/6 bg-ivory-warm lg:max-w-[260px] ${previewAspectClassName}`}
        >
          {previewUrl ? (
            <img src={previewUrl} alt={`${assetName} 미리보기`} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center text-sm text-text-secondary">
              {emptyPreviewMessage}
            </div>
          )}
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap gap-3">
            <label className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-2xl bg-cta-primary px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
              <input
                ref={inputRef}
                id={fileInputId}
                type="file"
                accept={acceptAttribute}
                onChange={handleFileChange}
                disabled={disabled}
                className="sr-only"
              />
              {previewUrl ? "새 이미지로 교체" : "파일 선택"}
            </label>
            <button
              type="button"
              onClick={handleClear}
              disabled={disabled || (!previewUrl && !imageUrl)}
              className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-black/10 bg-white px-5 text-sm font-semibold text-text-primary disabled:cursor-not-allowed disabled:text-text-muted"
            >
              이미지 제거
            </button>
          </div>

          <div
            className={`rounded-2xl px-4 py-3 text-sm ${
              uploadState.status === "error"
                ? "bg-error/10 text-error"
                : uploadState.status === "success"
                  ? "bg-success/10 text-success"
                  : "bg-white text-text-secondary"
            }`}
          >
            {uploadState.message}
          </div>

          <p className="text-sm text-text-secondary">{replaceHintMessage}</p>
        </div>
      </div>

      <input type="hidden" name={fieldNames.url} value={imageUrl} />
      <input type="hidden" name={fieldNames.storagePath} value={storagePath} />
      <input type="hidden" name={fieldNames.previousStoragePath} value={initialStoragePath ?? ""} />
    </div>
  );
}
