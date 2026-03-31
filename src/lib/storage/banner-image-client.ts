"use client";

import { prepareImageFile } from "@/lib/storage/image-processing-client";
import { bannerImagePolicy } from "@/lib/storage/banners";

export function prepareBannerFile(file: File) {
  return prepareImageFile(file, bannerImagePolicy);
}
