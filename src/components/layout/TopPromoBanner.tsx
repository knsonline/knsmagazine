import { TrackedExternalLink } from "@/components/analytics/TrackedExternalLink";
import type { BannerItem } from "@/types/content";

interface TopPromoBannerProps {
  banner?: BannerItem;
}

export function TopPromoBanner({ banner }: TopPromoBannerProps) {
  if (!banner) {
    return null;
  }

  const displayTitle = banner.startsAt
    ? `${new Date(banner.startsAt).getFullYear()} 설명회 일정 확인하기`
    : "KNS 설명회 일정 확인하기";

  return (
    <div className="sticky top-0 z-40 bg-[#111111] text-white">
      <div className="shell">
        <TrackedExternalLink
          href={banner.linkUrl}
          event={{
            eventType: "banner_click",
            pagePath: "/",
            bannerId: banner.id,
            placement: "top_promo_banner",
          }}
          className="flex min-h-11 items-center justify-center py-2 text-center text-sm font-semibold tracking-[-0.01em]"
        >
          <span>안내: {displayTitle} →</span>
        </TrackedExternalLink>
      </div>
    </div>
  );
}
