import {
  buildStorageImagePath,
  extractStoragePathFromPublicUrl,
  getAcceptAttribute,
  getImageValidationError,
} from "@/lib/storage/images";

export const THUMBNAIL_BUCKET = "thumbnails";

export const thumbnailImagePolicy = {
  bucket: THUMBNAIL_BUCKET,
  folder: "contents",
  maxFileSizeBytes: 10 * 1024 * 1024,
  targetMaxDimension: 1600,
  targetMaxBytes: 450 * 1024,
  outputQuality: 0.82,
  acceptExtensions: [".jpg", ".jpeg", ".png", ".webp"] as const,
  acceptMimeTypes: ["image/jpeg", "image/png", "image/webp"] as const,
} as const;

export const THUMBNAIL_ACCEPT_ATTRIBUTE = getAcceptAttribute(thumbnailImagePolicy);
export const THUMBNAIL_TARGET_MAX_DIMENSION = thumbnailImagePolicy.targetMaxDimension;
export const THUMBNAIL_MAX_FILE_SIZE_BYTES = thumbnailImagePolicy.maxFileSizeBytes;

export function getThumbnailValidationError(file: File) {
  return getImageValidationError(file, thumbnailImagePolicy);
}

export function buildThumbnailStoragePath(type: string, now = new Date()) {
  return buildStorageImagePath(thumbnailImagePolicy, type, now);
}

export function extractThumbnailStoragePath(url: string | null | undefined) {
  return extractStoragePathFromPublicUrl(url, THUMBNAIL_BUCKET);
}
