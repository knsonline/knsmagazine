"use client";

import type { StorageImagePolicy } from "@/lib/storage/images";
import { getImageExtensionFromMimeType } from "@/lib/storage/images";

export interface PreparedImageFile {
  file: File;
  width: number;
  height: number;
  originalSize: number;
  outputSize: number;
}

async function loadImageDimensions(file: File) {
  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const nextImage = new Image();

      nextImage.onload = () => resolve(nextImage);
      nextImage.onerror = () => reject(new Error("이미지 정보를 읽지 못했어요."));
      nextImage.src = objectUrl;
    });

    return {
      image,
      width: image.naturalWidth,
      height: image.naturalHeight,
    };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function getTargetDimensions(
  width: number,
  height: number,
  maxDimension: number,
) {
  const longestSide = Math.max(width, height);

  if (longestSide <= maxDimension) {
    return { width, height };
  }

  const scale = maxDimension / longestSide;

  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number) {
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, type, quality);
  });
}

export async function prepareImageFile(
  file: File,
  policy: Pick<
    StorageImagePolicy,
    "outputQuality" | "targetMaxBytes" | "targetMaxDimension"
  >,
): Promise<PreparedImageFile> {
  const { image, width, height } = await loadImageDimensions(file);
  const targetDimensions = getTargetDimensions(width, height, policy.targetMaxDimension);
  const canvas = document.createElement("canvas");

  canvas.width = targetDimensions.width;
  canvas.height = targetDimensions.height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("브라우저에서 이미지 처리를 지원하지 않아요.");
  }

  context.drawImage(image, 0, 0, targetDimensions.width, targetDimensions.height);

  const preferredMimeType = "image/webp";
  const preferredBlob = await canvasToBlob(canvas, preferredMimeType, policy.outputQuality);
  const fallbackMimeType = file.type === "image/png" ? "image/png" : "image/jpeg";
  const fallbackBlob =
    !preferredBlob || preferredBlob.size > policy.targetMaxBytes
      ? await canvasToBlob(canvas, fallbackMimeType, policy.outputQuality)
      : null;

  const bestBlob = [preferredBlob, fallbackBlob]
    .filter((blob): blob is Blob => Boolean(blob))
    .sort((left, right) => left.size - right.size)[0];

  const shouldKeepOriginal =
    targetDimensions.width === width &&
    targetDimensions.height === height &&
    file.size <= policy.targetMaxBytes &&
    (!bestBlob || file.size <= bestBlob.size);

  if (shouldKeepOriginal) {
    return {
      file,
      width,
      height,
      originalSize: file.size,
      outputSize: file.size,
    };
  }

  if (!bestBlob) {
    throw new Error("이미지 압축에 실패했어요. 다른 파일로 다시 시도해 주세요.");
  }

  const outputMimeType = bestBlob.type || fallbackMimeType;
  const outputExtension = getImageExtensionFromMimeType(outputMimeType);
  const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
  const preparedFile = new File([bestBlob], `${baseName}.${outputExtension}`, {
    type: outputMimeType,
    lastModified: Date.now(),
  });

  return {
    file: preparedFile,
    width: targetDimensions.width,
    height: targetDimensions.height,
    originalSize: file.size,
    outputSize: preparedFile.size,
  };
}
