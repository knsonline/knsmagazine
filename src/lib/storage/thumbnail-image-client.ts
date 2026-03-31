"use client";

import { prepareImageFile } from "@/lib/storage/image-processing-client";
import { thumbnailImagePolicy } from "@/lib/storage/thumbnails";

export function prepareThumbnailFile(file: File) {
  return prepareImageFile(file, thumbnailImagePolicy);
}
