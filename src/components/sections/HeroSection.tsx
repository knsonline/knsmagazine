import Link from "next/link";
import { ContentImpressionTracker } from "@/components/analytics/ContentImpressionTracker";
import { GradeQuickLinks } from "@/components/sections/GradeQuickLinks";
import { ContentThumbnail } from "@/components/ui/ContentThumbnail";
import { SITE_COPY } from "@/constants/site";
import { getHeroDescription } from "@/lib/utils/content-preview";
import type { ContentItem } from "@/types/content";

interface HeroSectionProps {
  hero?: ContentItem;
}

export function HeroSection({ hero }: HeroSectionProps) {
  const heroDescription = hero ? getHeroDescription(hero) : SITE_COPY.heroDescription;

  return (
    <section className="bg-navy pb-16 pt-10 text-white lg:pb-20 lg:pt-14">
      <div className="shell space-y-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-5">
            <p className="text-sm font-semibold tracking-[0.02em] text-white/72">{SITE_COPY.brandLine}</p>
            <h1 className="max-w-2xl text-3xl sm:text-[40px] font-bold leading-[1.16] tracking-[-0.04em] sm:leading-[1.08] sm:tracking-[-0.05em] lg:text-[56px]">
              {hero ? hero.title : SITE_COPY.heroTitle}
            </h1>
            <p className="max-w-xl whitespace-pre-line text-base leading-8 text-white/76 line-clamp-4 sm:text-lg">
              {heroDescription}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              {hero ? (
                <Link
                  href={`/contents/${hero.slug}`}
                  className="inline-flex min-h-12 items-center rounded-full bg-white px-6 text-sm font-semibold text-navy transition hover:bg-ivory"
                >
                  대표 콘텐츠 보기
                </Link>
              ) : (
                <Link
                  href="/contents"
                  className="inline-flex min-h-12 items-center rounded-full bg-white px-6 text-sm font-semibold text-navy transition hover:bg-ivory"
                >
                  최신 콘텐츠 보기
                </Link>
              )}
            </div>
          </div>

          {hero ? (
            <Link
              href={`/contents/${hero.slug}`}
              className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/6 p-3"
            >
              <ContentImpressionTracker
                contentId={hero.id}
                grade={hero.grade}
                topic={hero.topic}
                contentType={hero.contentType}
              />
              <ContentThumbnail
                src={hero.thumbnailUrl}
                alt={hero.title}
                containerClassName="rounded-[24px]"
                imageClassName="transition duration-300 group-hover:scale-[1.02]"
                sizes="(max-width: 1024px) 100vw, 45vw"
                priority
              />
            </Link>
          ) : (
            <div className="rounded-[32px] border border-white/10 bg-white/6 p-6">
              <p className="text-lg font-semibold leading-8">지금 필요한 주제를 먼저 골라 보세요</p>
              <p className="mt-3 text-sm leading-7 text-white/72">
                학년별로 빠르게 이동하면 우리 아이에게 맞는 콘텐츠를 더 수월하게 찾을 수 있습니다.
              </p>
            </div>
          )}
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/6 p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold tracking-[-0.02em]">학년별 빠른 진입</h2>
            <Link href="/contents" className="text-sm font-semibold text-white/76">
              전체보기 →
            </Link>
          </div>
          <GradeQuickLinks currentPath="/" />
        </div>
      </div>
    </section>
  );
}
