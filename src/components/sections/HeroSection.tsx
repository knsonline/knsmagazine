import Link from "next/link";
import { ContentImpressionTracker } from "@/components/analytics/ContentImpressionTracker";
import { GradeQuickLinks } from "@/components/sections/GradeQuickLinks";
import { Badge } from "@/components/ui/Badge";
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
  const heroTagClassName =
    "border border-[rgba(255,255,255,0.5)] bg-[linear-gradient(180deg,rgba(248,251,255,0.96),rgba(233,240,248,0.92))] text-[#16233f] shadow-[0_18px_32px_-24px_rgba(8,16,30,0.52)] backdrop-blur-md";
  const heroCoverTagClassName =
    "border border-[rgba(255,255,255,0.58)] bg-[linear-gradient(180deg,rgba(251,253,255,0.98),rgba(238,244,250,0.94))] text-[#13213a] shadow-[0_18px_32px_-24px_rgba(8,16,30,0.48)] backdrop-blur-md";

  return (
    <div className="flex flex-wrap gap-2">
      <Badge tone="muted" className={heroCoverTagClassName}>
        커버 스토리
      </Badge>
      <Badge tone="muted" className={heroTagClassName}>
        {hero.grade}
      </Badge>
      <Badge tone="muted" className={heroTagClassName}>
        {hero.topic}
      </Badge>
    </div>
  );
}

export function HeroSection({ hero }: HeroSectionProps) {
  const heroDescription = hero ? getHeroDescription(hero) : SITE_COPY.heroDescription;
  const heroTitle = protectPhraseSpacing(hero?.title ?? SITE_COPY.heroTitle);
  const protectedDescription = protectPhraseSpacing(heroDescription);
  const primaryHeroLabel = protectPhraseSpacing("대표 콘텐츠 보기");
  const secondaryHeroLabel = protectPhraseSpacing("전체 콘텐츠 둘러보기");
  const fallbackPrimaryLabel = protectPhraseSpacing("최신 콘텐츠 보기");
  const fallbackSecondaryLabel = protectPhraseSpacing("콘텐츠 검색");
  const hasHeroThumbnail = hero ? hasRealThumbnail(hero.thumbnailUrlRaw) : false;

  return (
    <section className="bg-[radial-gradient(circle_at_top_left,rgba(77,103,151,0.24),transparent_30%),radial-gradient(circle_at_top_right,rgba(190,207,230,0.12),transparent_22%),linear-gradient(180deg,#16233f_0%,#1b2a4a_58%,#13203a_100%)] pb-16 pt-8 text-white lg:pb-20 lg:pt-12">
      <div className="shell space-y-6 lg:space-y-8">
        {hero ? (
          <ContentImpressionTracker
            contentId={hero.id}
            grade={hero.grade}
            topic={hero.topic}
            contentType={hero.contentType}
          />
        ) : null}

        {hero ? (
          <>
            <div className="lg:hidden">
              <Link
                href={`/contents/${hero.slug}`}
                className="group block overflow-hidden rounded-[34px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(222,232,245,0.04))] p-3 shadow-[0_28px_64px_-34px_rgba(8,15,31,0.62)]"
              >
                <div className="rounded-[28px] border border-white/10 bg-[rgba(10,18,34,0.22)] p-3">
                  <div className="relative overflow-hidden rounded-[22px] border border-white/8 bg-[#0f1a31] shadow-[0_24px_44px_-30px_rgba(8,16,30,0.82)]">
                    {hasHeroThumbnail ? (
                      <>
                        <ContentThumbnail
                          src={hero.thumbnailUrl}
                          alt={hero.title}
                          containerClassName="bg-[#13203a]"
                          imageClassName="transition duration-500 group-hover:scale-[1.025] saturate-[0.98]"
                          sizes="100vw"
                          priority
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,16,30,0.08)_0%,rgba(9,16,30,0.02)_46%,rgba(9,16,30,0.18)_100%)]" />
                      </>
                    ) : (
                      <ContentPlaceholderMedia content={hero} tone="dark" size="hero" className="rounded-[22px] border-none" />
                    )}
                  </div>
                  <div className="px-2 pb-2 pt-5 text-center">
                    <div className="flex justify-center">
                      <HeroMeta hero={hero} />
                    </div>
                    <h1 className="text-keep text-balance mx-auto mt-4 max-w-[10.5ch] text-[31px] font-bold leading-[1.18] tracking-[-0.045em] sm:max-w-[11.5ch] sm:text-[34px]">
                      {heroTitle}
                    </h1>
                    <p className="text-keep text-pretty mx-auto mt-4 max-w-[19.5rem] text-[15px] leading-[1.78] text-white/76">
                      {protectedDescription}
                    </p>
                    <span className="text-button mt-6 inline-flex min-h-11 items-center rounded-full bg-[rgba(248,251,255,0.96)] px-5 text-sm font-semibold text-navy shadow-[0_16px_30px_-22px_rgba(227,236,248,0.9)]">
                      {primaryHeroLabel}
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            <div className="hidden lg:grid lg:grid-cols-[minmax(0,1.12fr)_minmax(320px,0.74fr)] lg:items-center lg:gap-10 xl:grid-cols-[minmax(0,1.12fr)_minmax(360px,0.72fr)]">
              <div className="space-y-5 lg:pr-2 xl:pr-4">
                <HeroMeta hero={hero} />
                <p className="text-sm font-semibold tracking-[0.02em] text-white/72">{SITE_COPY.brandLine}</p>
                <h1 className="text-keep text-balance max-w-[11.5ch] text-[50px] font-bold leading-[1.1] tracking-[-0.045em] xl:max-w-[12.5ch] xl:text-[54px]">
                  {heroTitle}
                </h1>
                <p className="text-keep text-pretty max-w-[35rem] text-[17px] leading-[1.85] text-white/76 xl:max-w-[37rem]">
                  {protectedDescription}
                </p>
                <div className="flex flex-wrap gap-3 pt-1">
                  <Link
                    href={`/contents/${hero.slug}`}
                    className="text-button inline-flex min-h-12 items-center rounded-full bg-white px-6 text-sm font-semibold text-navy transition hover:bg-ivory"
                  >
                    {primaryHeroLabel}
                  </Link>
                  <Link
                    href="/contents"
                    className="text-button inline-flex min-h-12 items-center rounded-full border border-white/16 bg-white/6 px-6 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    {secondaryHeroLabel}
                  </Link>
                </div>
              </div>

              <Link
                href={`/contents/${hero.slug}`}
                className="group relative w-full max-w-[420px] justify-self-end overflow-hidden rounded-[32px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(218,229,243,0.04))] p-2.5 shadow-[0_30px_56px_-36px_rgba(7,15,31,0.74)] xl:max-w-[448px]"
              >
                {hasHeroThumbnail ? (
                  <ContentThumbnail
                    src={hero.thumbnailUrl}
                    alt={hero.title}
                    containerClassName="rounded-[24px] bg-[#11203a]"
                    imageClassName="transition duration-300 group-hover:scale-[1.018] saturate-[0.98]"
                    sizes="(max-width: 1280px) 34vw, 448px"
                    priority
                  />
                ) : (
                  <ContentPlaceholderMedia content={hero} tone="dark" size="hero" className="rounded-[24px] border-none" />
                )}
                {hasHeroThumbnail ? (
                  <div className="pointer-events-none absolute inset-x-2.5 bottom-2.5 h-20 rounded-b-[24px] bg-[linear-gradient(180deg,rgba(7,14,28,0)_0%,rgba(7,14,28,0.18)_100%)]" />
                ) : null}
              </Link>
            </div>
          </>
        ) : (
          <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(221,231,243,0.04))] px-6 py-8 text-center shadow-[0_24px_48px_-34px_rgba(8,15,31,0.56)] lg:px-10 lg:py-10 lg:text-left">
            <p className="text-sm font-semibold tracking-[0.02em] text-white/72">{SITE_COPY.brandLine}</p>
            <h1 className="text-keep text-balance mx-auto mt-4 max-w-[10.5ch] text-3xl font-bold leading-[1.2] tracking-[-0.04em] lg:mx-0 lg:max-w-[11.5ch] lg:text-[48px] lg:leading-[1.1]">
              {heroTitle}
            </h1>
            <p className="text-keep text-pretty mx-auto mt-4 max-w-[32rem] text-base leading-[1.8] text-white/76 lg:mx-0 lg:text-lg">
              {protectedDescription}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">
              <Link
                href="/contents"
                className="text-button inline-flex min-h-12 items-center rounded-full bg-[rgba(248,251,255,0.96)] px-6 text-sm font-semibold text-navy transition hover:bg-white"
              >
                {fallbackPrimaryLabel}
              </Link>
              <Link
                href="/search"
                className="text-button inline-flex min-h-12 items-center rounded-full border border-white/16 bg-white/6 px-6 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {fallbackSecondaryLabel}
              </Link>
            </div>
          </div>
        )}

        <div className="rounded-[30px] border border-white/12 bg-[linear-gradient(180deg,rgba(237,244,252,0.08),rgba(208,220,238,0.05))] px-4 py-5 shadow-[0_24px_48px_-38px_rgba(8,16,30,0.62)] sm:px-5 lg:rounded-[32px] lg:px-6 lg:py-6">
          <div className="mb-4 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold tracking-[0.02em] text-white/68">학년별 빠른 진입</p>
              <h2 className="text-keep text-balance mt-2 max-w-[16ch] text-xl font-semibold leading-[1.4] tracking-[-0.03em] lg:max-w-[20ch] lg:text-2xl">
                우리 아이 학년에 맞는 흐름부터 시작해 보세요
              </h2>
            </div>
            <p className="text-keep text-pretty max-w-[30rem] text-sm leading-[1.75] text-white/66">
              모바일에서는 크게 눌러 바로 이동하고, 데스크톱에서는 한눈에 비교하며 들어갈 수 있도록 정리했습니다.
            </p>
          </div>
          <GradeQuickLinks currentPath="/" />
        </div>
      </div>
    </section>
  );
}
