import Link from "next/link";
import { ContentImpressionTracker } from "@/components/analytics/ContentImpressionTracker";
import { Badge, getGradeBadgeClassName, getSpecialBadgeClassName, getTopicBadgeClassName } from "@/components/ui/Badge";
import { ContentPlaceholderMedia, hasRealThumbnail } from "@/components/ui/ContentPlaceholderMedia";
import { ContentThumbnail } from "@/components/ui/ContentThumbnail";
import { SITE_COPY } from "@/constants/site";
import { getHeroDescription } from "@/lib/utils/content-preview";
import { protectPhraseSpacing } from "@/lib/utils/text";
import type { ContentItem } from "@/types/content";

interface HeroSectionProps {
  hero?: ContentItem;
}

function HeroMeta({ hero }: { hero: ContentItem }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge className={getSpecialBadgeClassName("coverStory", "dark")}>
        커버 스토리
      </Badge>
      <Badge className={getGradeBadgeClassName(hero.grade, "dark")}>
        {hero.grade}
      </Badge>
      <Badge className={getTopicBadgeClassName(hero.topic, "dark")}>
        {hero.topic}
      </Badge>
    </div>
  );
}

export function HeroSection({ hero }: HeroSectionProps) {
  const heroDescription = hero ? getHeroDescription(hero) : SITE_COPY.heroDescription;
  const heroTitle = protectPhraseSpacing(hero?.title ?? SITE_COPY.heroTitle);
  const protectedDescription = protectPhraseSpacing(heroDescription);
  const primaryHeroLabel = protectPhraseSpacing(SITE_COPY.heroPrimaryLabel);
  const secondaryHeroLabel = protectPhraseSpacing(SITE_COPY.heroSecondaryLabel);
  const fallbackPrimaryLabel = protectPhraseSpacing(SITE_COPY.heroFallbackPrimaryLabel);
  const fallbackSecondaryLabel = protectPhraseSpacing(SITE_COPY.heroFallbackSecondaryLabel);
  const hasHeroThumbnail = hero ? hasRealThumbnail(hero.thumbnailUrlRaw) : false;

  return (
    <section className="bg-[linear-gradient(180deg,#162744_0%,#1b2a4a_46%,#243655_100%)] pb-16 pt-8 text-white lg:pb-20 lg:pt-12">
      <div className="shell space-y-6 lg:space-y-8">
        {hero ? (
          <ContentImpressionTracker
            contentId={hero.id}
            grade={hero.grade}
            topic={hero.topic}
          />
        ) : null}

        {hero ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.8fr)] lg:items-center lg:gap-10">
            <div className="order-1 space-y-5 text-left lg:pr-2 xl:pr-4">
              <div className="flex justify-start">
                <HeroMeta hero={hero} />
              </div>
              <p className="text-sm font-semibold tracking-[0.02em] text-white/68">{SITE_COPY.brandLine}</p>
              <h1 className="text-keep text-balance max-w-[12ch] text-[34px] font-bold leading-[1.08] tracking-[-0.03em] lg:max-w-[13ch] lg:text-[50px]">
                {heroTitle}
              </h1>
              <p className="text-keep text-pretty max-w-[22rem] text-[15px] leading-[1.8] text-white/76 lg:max-w-[34rem] lg:text-[17px]">
                {protectedDescription}
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href={`/contents/${hero.slug}`}
                  className="text-button inline-flex min-h-12 items-center rounded-full bg-white px-6 text-sm font-semibold text-navy transition hover:bg-ivory"
                >
                  {primaryHeroLabel}
                </Link>
                <Link
                  href="/contents"
                  className="text-button inline-flex min-h-12 items-center text-sm font-semibold text-white/82 transition hover:text-white"
                >
                  {secondaryHeroLabel} →
                </Link>
              </div>
            </div>

            <Link
              href={`/contents/${hero.slug}`}
              className="group order-2 relative mx-auto w-full max-w-[420px] overflow-hidden rounded-[24px] border border-white/12 bg-[rgba(255,255,255,0.05)] p-1.5 lg:rounded-[32px] lg:p-2.5"
            >
               {hasHeroThumbnail ? (
                 <ContentThumbnail
                   src={hero.thumbnailUrl}
                   alt={hero.title}
                   containerClassName="rounded-[20px] lg:rounded-[24px] bg-[#11203a]"
                   imageClassName="transition duration-300 group-hover:scale-[1.018] saturate-[0.98]"
                   sizes="(max-width: 1280px) 100vw, 448px"
                   priority
                 />
               ) : (
                 <ContentPlaceholderMedia content={hero} tone="dark" size="hero" className="rounded-[20px] lg:rounded-[24px] border-none" />
               )}
            </Link>
          </div>
        ) : (
          <div className="rounded-[32px] border border-white/10 bg-navy-light px-6 py-8 text-left lg:px-10 lg:py-10">
            <p className="text-sm font-semibold tracking-[0.02em] text-white/72">{SITE_COPY.brandLine}</p>
            <h1 className="text-keep text-balance mt-4 max-w-[13ch] text-3xl font-bold leading-[1.16] tracking-[-0.028em] lg:max-w-[14ch] lg:text-[48px] lg:leading-[1.08]">
              {heroTitle}
            </h1>
            <p className="text-keep text-pretty mt-4 max-w-[32rem] text-base leading-[1.8] text-white/76 lg:text-lg">
              {protectedDescription}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link
                href="/contents"
                className="text-button inline-flex min-h-12 items-center rounded-full bg-white px-6 text-sm font-semibold text-navy transition hover:bg-ivory"
              >
                {fallbackPrimaryLabel}
              </Link>
              <Link
                href="/search"
                className="text-button inline-flex min-h-12 items-center text-sm font-semibold text-white/82 transition hover:text-white"
              >
                {fallbackSecondaryLabel} →
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
