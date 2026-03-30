import { EventLogger } from "@/components/analytics/EventLogger";
import { CollectionSection } from "@/components/sections/CollectionSection";
import { EventBannerSection } from "@/components/sections/EventBannerSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { LatestSection } from "@/components/sections/LatestSection";
import { SoftCtaSection } from "@/components/sections/SoftCtaSection";
import { TrendingSection } from "@/components/sections/TrendingSection";
import {
  getActiveBanners,
  getHeroContent,
  getHomeCollections,
  getLatestContents,
  getPrimaryConsultCta,
  getTrendingContents,
} from "@/lib/data/content";

export default async function HomePage() {
  const [hero, trending, collections, banners, latestResult, consultCta] = await Promise.all([
    getHeroContent(),
    getTrendingContents(5),
    getHomeCollections(),
    getActiveBanners(),
    getLatestContents(1, 6),
    getPrimaryConsultCta(),
  ]);

  return (
    <>
      <EventLogger eventType="page_view" pagePath="/" />
      <HeroSection hero={hero} />
      <TrendingSection items={trending} />

      {collections.length === 0 ? <EventBannerSection banners={banners} /> : null}

      {collections.map((collection, index) => (
        <div key={collection.id}>
          <CollectionSection
            collection={collection}
            backgroundClassName={index % 2 === 0 ? "bg-white" : "bg-ivory-warm"}
          />
          {index === 0 ? <EventBannerSection banners={banners} /> : null}
        </div>
      ))}

      <LatestSection items={latestResult.items} />
      <SoftCtaSection cta={consultCta} pagePath="/" />
    </>
  );
}
