import { SITE_COPY } from "@/constants/site";
import type { BannerItem } from "@/types/content";

interface BannerDisplayCopy {
  title: string;
  description: string;
}

type BannerCopySource = Pick<BannerItem, "title" | "startsAt">;

function getYearPrefix(startsAt?: string | null) {
  if (!startsAt) {
    return "";
  }

  const year = new Date(startsAt).getFullYear();
  return Number.isFinite(year) ? `${year} ` : "";
}

export function resolveBannerDisplayCopy(banner: BannerCopySource): BannerDisplayCopy {
  const fallbackTitle = banner.title.trim();
  const defaultTitle = `${getYearPrefix(banner.startsAt)}주요 안내 확인하기`.trim();

  return {
    title: fallbackTitle || defaultTitle,
    description: SITE_COPY.banners.cardDescription,
  };
}
