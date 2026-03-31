export interface StorageImageUploadResult {
  path: string;
  publicUrl: string;
}

export interface StorageImagePolicy {
  bucket: string;
  folder: string;
  maxFileSizeBytes: number;
  targetMaxDimension: number;
  targetMaxBytes: number;
  outputQuality: number;
  acceptExtensions: readonly string[];
  acceptMimeTypes: readonly string[];
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes}B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)}KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

export function getAcceptAttribute(policy: Pick<StorageImagePolicy, "acceptExtensions">) {
  return policy.acceptExtensions.join(",");
}

export function isSupportedImageMimeType(
  type: string,
  policy: Pick<StorageImagePolicy, "acceptMimeTypes">,
) {
  return policy.acceptMimeTypes.includes(type as (typeof policy.acceptMimeTypes)[number]);
}

export function getImageValidationError(
  file: File,
  policy: Pick<StorageImagePolicy, "acceptMimeTypes" | "maxFileSizeBytes">,
) {
  if (!isSupportedImageMimeType(file.type, policy)) {
    return "JPG, PNG, WEBP 형식의 이미지만 업로드할 수 있어요.";
  }

  if (file.size > policy.maxFileSizeBytes) {
    return `이미지 파일은 ${formatBytes(policy.maxFileSizeBytes)} 이하만 업로드할 수 있어요.`;
  }

  return null;
}

export function getImageExtensionFromMimeType(type: string) {
  switch (type) {
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/jpeg":
    default:
      return "jpg";
  }
}

export function buildStorageImagePath(
  policy: Pick<StorageImagePolicy, "folder">,
  type: string,
  now = new Date(),
) {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const extension = getImageExtensionFromMimeType(type);

  return `${policy.folder}/${year}/${month}/${crypto.randomUUID()}.${extension}`;
}

export function extractStoragePathFromPublicUrl(
  url: string | null | undefined,
  bucket: string,
) {
  if (!url) {
    return null;
  }

  try {
    const parsedUrl = new URL(url);
    const marker = `/storage/v1/object/public/${bucket}/`;
    const markerIndex = parsedUrl.pathname.indexOf(marker);

    if (markerIndex === -1) {
      return null;
    }

    const path = decodeURIComponent(parsedUrl.pathname.slice(markerIndex + marker.length));
    return path || null;
  } catch {
    return null;
  }
}

export function isRemoteImageUrl(src: string) {
  return /^https?:\/\//i.test(src);
}

export function isSupabaseStoragePublicUrl(src: string) {
  return /\/storage\/v1\/object\/public\//.test(src);
}
