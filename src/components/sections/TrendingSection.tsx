import Link from "next/link";
import { ContentImpressionTracker } from "@/components/analytics/ContentImpressionTracker";
import { Badge, getGradeBadgeClassName, getTopicBadgeClassName } from "@/components/ui/Badge";
import { ContentPlaceholderMedia, hasRealThumbnail } from "@/components/ui/ContentPlaceholderMedia";
import { ContentThumbnail } from "@/components/ui/ContentThumbnail";
import { ContentTypeInline } from "@/components/ui/ContentTypeInline";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SITE_COPY } from "@/constants/site";
import { getCompactDescription } from "@/lib/utils/content-preview";
import type { ContentItem } from "@/types/content";

interface TrendingSectionProps {
  items: ContentItem[];
}

const rankLabels = ["01", "02", "03", "04", "05", "06"];

function getTrendingReason(content: ContentItem) {
  if (content.topic === "내신") {
    return "시험 전 가장 빨리 찾는 주제";
  }

  if (content.topic === "수능") {
    return "입시 전략을 한 번에 정리할 수 있는 흐름";
  }

  if (content.topic === "학습법") {
    return "집에서 바로 적용하기 좋아 꾸준히 찾는 주제";
  }

  return `${content.grade} 학부모가 자주 이어 읽는 흐름`;
}

function TrendingCard({ content, index }: { content: ContentItem; index: number }) {
  const description = getCompactDescription(content);
  const reason = getTrendingReason(content);
  const hasThumbnail = hasRealThumbnail(content.thumbnailUrlRaw);

  return (
    <Link
      href={`/contents/${content.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-[24px] bg-white border border-black/5 shadow-sm transition hover:shadow-md"
    >
      <ContentImpressionTracker
        contentId={content.id}
        grade={content.grade}
        topic={content.topic}
      />

      <div className="relative">
        {hasThumbnail ? (
          <ContentThumbnail
            src={content.thumbnailUrl}
            alt={content.title}
            sizes="(max-width: 1024px) 80vw, 30vw"
            containerClassName="border-b border-black/5 bg-ivory"
            imageClassName="transition duration-300 group-hover:scale-105"
          />
        ) : (
          <ContentPlaceholderMedia
            content={content}
            className="rounded-none border-x-0 border-t-0 border-b-black/5"
          />
        )}
        <div className="absolute left-4 top-4 inline-flex min-h-10 min-w-10 items-center justify-center rounded-full border border-white/60 bg-[rgba(247,250,254,0.92)] px-3 text-sm font-bold tracking-[-0.03em] text-navy shadow-[0_16px_30px_-22px_rgba(27,42,74,0.26)] backdrop-blur-sm">
          {rankLabels[index] ?? "00"}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={getGradeBadgeClassName(content.grade)}>{content.grade}</Badge>
          <Badge className={getTopicBadgeClassName(content.topic)}>{content.topic}</Badge>
          {content.isFeatured ? <Badge tone="gold">운영자 추천</Badge> : null}
        </div>

        <div className="space-y-2.5">
          <p className="line-clamp-1 text-xs font-semibold tracking-[0.03em] text-navy/72">{reason}</p>
          <h3 className="text-keep text-balance line-clamp-2 text-[18px] font-semibold leading-[1.5] tracking-[-0.012em] text-text-primary">
            {content.title}
          </h3>
          {description ? (
            <p className="text-keep text-pretty line-clamp-2 text-sm leading-[1.65] text-text-secondary">{description}</p>
          ) : null}
        </div>

        <ContentTypeInline contentType={content.contentType} className="mt-auto text-sm font-semibold text-navy" />
      </div>
    </Link>
  );
}

export function TrendingSection({ items }: TrendingSectionProps) {
  return (
    <section className="section-space bg-[linear-gradient(180deg,#f4f7fb_0%,#edf2f8_100%)]">
      <div className="shell">
        <SectionHeader
          title={SITE_COPY.trendingTitle}
          description={SITE_COPY.trending.description}
          href="/contents"
        />

        {items.length > 0 ? (
          <>
            <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-5 lg:overflow-x-visible lg:px-0 lg:pb-0 sm:auto-cols-max">
              {items.map((content, index) => (
                <div key={content.id} className="w-[82%] min-w-[282px] max-w-[336px] shrink-0 snap-start lg:w-auto lg:min-w-0 lg:max-w-none">
                  <TrendingCard content={content} index={index} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <EmptyState
            title={SITE_COPY.trending.emptyTitle}
            description={SITE_COPY.trending.emptyDescription}
          />
        )}
      </div>
    </section>
  );
}
