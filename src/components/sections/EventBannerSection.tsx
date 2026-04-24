import { TrackedExternalLink } from "@/components/analytics/TrackedExternalLink";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MagazineImage } from "@/components/ui/MagazineImage";
import { SITE_COPY } from "@/constants/site";
import { resolveBannerDisplayCopy } from "@/lib/utils/banner-copy";
import { protectPhraseSpacing } from "@/lib/utils/text";
import type { BannerItem } from "@/types/content";

interface EventBannerSectionProps {
  banners: BannerItem[];
}

export function EventBannerSection({ banners }: EventBannerSectionProps) {
  if (banners.length === 0) {
    return null;
  }

  return (
    <section className="section-space bg-ivory-warm">
      <div className="shell">
        <SectionHeader
          title={SITE_COPY.banners.title}
          description={SITE_COPY.banners.description}
        />

        <div className="grid gap-4 lg:grid-cols-2">
          {banners.map((banner) => {
            const copy = resolveBannerDisplayCopy(banner);
            const displayTitle = copy.title;
            const protectedTitle = protectPhraseSpacing(displayTitle);
            const protectedDescription = protectPhraseSpacing(copy.description);

            return (
              <TrackedExternalLink
                key={banner.id}
                href={banner.linkUrl}
                event={{
                  eventType: "banner_click",
                  pagePath: "/",
                  bannerId: banner.id,
                  placement: "home_banner_feature",
                }}
                className="card-surface group overflow-hidden rounded-[28px]"
              >
                <div className="relative aspect-[16/7]">
                  <MagazineImage
                    src={banner.imageUrl}
                    alt={displayTitle}
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div className="p-5 sm:p-6">
                  <p className="text-keep text-balance max-w-[19ch] text-[26px] font-semibold leading-[1.28] tracking-[-0.018em] text-text-primary">
                    {protectedTitle}
                  </p>
                  <p className="text-keep text-pretty mt-2 text-sm leading-[1.68] text-text-secondary">
                    {protectedDescription}
                  </p>
                </div>
              </TrackedExternalLink>
            );
          })}
        </div>
      </div>
    </section>
  );
}
