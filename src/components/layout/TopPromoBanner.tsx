import { TrackedExternalLink } from "@/components/analytics/TrackedExternalLink";
import type { BannerItem } from "@/types/content";

interface TopPromoBannerProps {
  banner?: BannerItem;
}

export function TopPromoBanner({ banner }: TopPromoBannerProps) {
  if (!banner) {
    return null;
  }

  return (
    <div className="sticky top-0 z-40 bg-[#111111] text-white">
      <div className="shell">
        <TrackedExternalLink
          href={banner.linkUrl}
          event={{
            eventType: "banner_click",
            pagePath: "/",
            bannerId: banner.id,
          }}
          className="flex min-h-11 items-center justify-center py-2 text-center text-sm font-semibold tracking-[-0.01em]"
        >
          <span>📚 {banner.title} →</span>
        </TrackedExternalLink>
      </div>
    </div>
  );
}
