import { EventLogger } from "@/components/analytics/EventLogger";
import { CollectionSection } from "@/components/sections/CollectionSection";
import { EventBannerSection } from "@/components/sections/EventBannerSection";
import { HomeHeroSection } from "@/components/sections/HomeHeroSection";
import { GuideTeaserSection } from "@/components/sections/GuideTeaserSection";
import { LatestSection } from "@/components/sections/LatestSection";
import { SoftCtaSection } from "@/components/sections/SoftCtaSection";
import { TrendingSection } from "@/components/sections/TrendingSection";
import {
  getActiveBanners,
  getHomeCollections,
  getLatestContents,
  getPrimaryConsultCta,
  getTrendingContents,
} from "@/lib/data/content";

export default async function HomePage() {
  const [trending, collections, banners, latestResult, consultCta] = await Promise.all([
    getTrendingContents(5),
    getHomeCollections(),
    getActiveBanners(),
    getLatestContents(1, 6),
    getPrimaryConsultCta(),
  ]);

  return (
    <>
      <EventLogger eventType="page_view" pagePath="/" />
      
      {/* 1. Mobile-oriented Grade Picker Hero */}
      <HomeHeroSection />
      
      {/* 2. Trending Now */}
      <TrendingSection items={trending} />
      
      {/* 3. Guide Teaser */}
      <GuideTeaserSection />

      {/* 4. Subject Collections */}
      {collections.map((collection, index) => (
        <div key={collection.id}>
          <CollectionSection
            collection={collection}
            backgroundClassName={index % 2 === 0 ? "bg-white" : "bg-ivory-warm"}
          />
        </div>
      ))}

      {/* 5. Event Banners */}
      <EventBannerSection banners={banners} />
      
      {/* 6. Latest Magazine */}
      <LatestSection items={latestResult.items} />
      
      {/* 7. Soft CTA */}
      <SoftCtaSection cta={consultCta} pagePath="/" placement="home_soft_cta" />
    </>
  );
}
