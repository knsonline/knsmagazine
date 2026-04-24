"use client";

import { usePathname } from "next/navigation";
import { TrackedExternalLink } from "@/components/analytics/TrackedExternalLink";
import { resolveBannerDisplayCopy } from "@/lib/utils/banner-copy";
import { protectPhraseSpacing } from "@/lib/utils/text";
import type { BannerItem } from "@/types/content";

interface TopPromoBannerProps {
  banner?: BannerItem;
}

export function TopPromoBanner({ banner }: TopPromoBannerProps) {
  const pathname = usePathname();

  if (!banner) {
    return null;
  }

  const displayTitle = protectPhraseSpacing(resolveBannerDisplayCopy(banner).title);

  return (
    <div className="bg-[#111111] text-white">
      <div className="shell">
        <TrackedExternalLink
          href={banner.linkUrl}
          event={{
            eventType: "banner_click",
            pagePath: pathname || "/",
            bannerId: banner.id,
            placement: "top_promo_banner",
          }}
          className="text-keep flex min-h-10 items-center justify-center py-2 text-center text-sm font-semibold tracking-[-0.01em] sm:min-h-11"
        >
          <span>안내: {displayTitle} →</span>
        </TrackedExternalLink>
      </div>
    </div>
  );
}
