import { TrackedExternalLink } from "@/components/analytics/TrackedExternalLink";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MagazineImage } from "@/components/ui/MagazineImage";
import type { BannerItem } from "@/types/content";

interface EventBannerSectionProps {
  banners: BannerItem[];
}

export function EventBannerSection({ banners }: EventBannerSectionProps) {
  if (banners.length === 0) {
    return null;
  }

  return (
    <section className="section-space bg-white">
      <div className="shell">
        <SectionHeader
          title="설명회·이벤트 배너"
          description="설명회 일정과 이벤트 소식을 한 번에 확인하실 수 있습니다."
        />

        <div className="grid gap-4 lg:grid-cols-2">
          {banners.map((banner) => {
            const displayTitle = banner.startsAt
              ? `${new Date(banner.startsAt).getFullYear()} 설명회 일정 확인하기`
              : "KNS 설명회 일정 확인하기";

            return (
              <TrackedExternalLink
                key={banner.id}
                href={banner.linkUrl}
                event={{
                  eventType: "banner_click",
                  pagePath: "/",
                  bannerId: banner.id,
                }}
                className="card-surface group overflow-hidden"
              >
                <div className="relative aspect-[16/7]">
                  <MagazineImage
                    src={banner.imageUrl}
                    alt={displayTitle}
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div className="p-6">
                  <p className="text-2xl font-semibold tracking-[-0.03em] text-text-primary">
                    {displayTitle}
                  </p>
                  <p className="mt-3 text-sm text-text-secondary">
                    배너를 눌러 자세한 안내를 확인해 보세요.
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
