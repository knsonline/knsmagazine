import {
  buildStorageImagePath,
  extractStoragePathFromPublicUrl,
  getAcceptAttribute,
  getImageValidationError,
} from "@/lib/storage/images";

export const BANNER_BUCKET = "banners";

export const bannerImagePolicy = {
  bucket: BANNER_BUCKET,
  folder: "promotions",
  maxFileSizeBytes: 10 * 1024 * 1024,
  targetMaxDimension: 1800,
  targetMaxBytes: 550 * 1024,
  outputQuality: 0.84,
  acceptExtensions: [".jpg", ".jpeg", ".png", ".webp"] as const,
  acceptMimeTypes: ["image/jpeg", "image/png", "image/webp"] as const,
} as const;

export const BANNER_ACCEPT_ATTRIBUTE = getAcceptAttribute(bannerImagePolicy);
export const BANNER_TARGET_MAX_DIMENSION = bannerImagePolicy.targetMaxDimension;
export const BANNER_MAX_FILE_SIZE_BYTES = bannerImagePolicy.maxFileSizeBytes;

export function getBannerValidationError(file: File) {
  return getImageValidationError(file, bannerImagePolicy);
}

export function buildBannerStoragePath(type: string, now = new Date()) {
  return buildStorageImagePath(bannerImagePolicy, type, now);
}

export function extractBannerStoragePath(url: string | null | undefined) {
  return extractStoragePathFromPublicUrl(url, BANNER_BUCKET);
}
