import Link from "next/link";
import { ContentImpressionTracker } from "@/components/analytics/ContentImpressionTracker";
import { Badge } from "@/components/ui/Badge";
import { ContentPlaceholderMedia, hasRealThumbnail } from "@/components/ui/ContentPlaceholderMedia";
import { ContentThumbnail } from "@/components/ui/ContentThumbnail";
import { ContentTypeInline } from "@/components/ui/ContentTypeInline";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getCompactDescription } from "@/lib/utils/content-preview";
import type { ContentItem } from "@/types/content";

interface TrendingSectionProps {
  items: ContentItem[];
}

const rankLabels = ["01", "02", "03", "04", "05", "06"];

function TrendingCard({ content, index }: { content: ContentItem; index: number }) {
  const description = getCompactDescription(content);
  const hasThumbnail = hasRealThumbnail(content.thumbnailUrlRaw);

  return (
    <Link
      href={`/contents/${content.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-[rgba(27,42,74,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,250,254,0.98))] shadow-[0_16px_36px_-30px_rgba(27,42,74,0.2)] transition-transform duration-200 hover:-translate-y-1"
    >
      <ContentImpressionTracker
        contentId={content.id}
        grade={content.grade}
        topic={content.topic}
        contentType={content.contentType}
      />

      <div className="relative">
        {hasThumbnail ? (
          <ContentThumbnail
            src={content.thumbnailUrl}
            alt={content.title}
            sizes="(max-width: 1024px) 80vw, 30vw"
            containerClassName="border-b border-[rgba(27,42,74,0.06)] bg-[#edf3f9]"
            imageClassName="transition duration-300 group-hover:scale-[1.015] saturate-[0.95]"
          />
        ) : (
          <ContentPlaceholderMedia
            content={content}
            className="rounded-none border-x-0 border-t-0 border-b-[rgba(27,42,74,0.06)]"
          />
        )}
        <div className="absolute left-4 top-4 inline-flex min-h-10 min-w-10 items-center justify-center rounded-full border border-white/60 bg-[rgba(247,250,254,0.92)] px-3 text-sm font-bold tracking-[-0.03em] text-navy shadow-[0_16px_30px_-22px_rgba(27,42,74,0.26)] backdrop-blur-sm">
          {rankLabels[index] ?? "00"}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{content.grade}</Badge>
          <Badge tone="muted">{content.topic}</Badge>
          {content.isFeatured ? <Badge tone="gold">운영자 추천</Badge> : null}
        </div>

        <div className="space-y-2.5">
          <h3 className="text-keep text-balance line-clamp-2 text-[18px] font-semibold leading-[1.5] tracking-[-0.02em] text-text-primary">
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
          title="지금 많이 보는 콘텐츠"
          description="최근 7일 상세 조회 기준으로, 학부모가 먼저 확인하는 콘텐츠를 빠르게 훑어볼 수 있게 정리했습니다."
          href="/contents"
        />

        {items.length > 0 ? (
          <>
            <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden lg:hidden">
              {items.map((content, index) => (
                <div key={content.id} className="w-[82%] min-w-[282px] max-w-[336px] shrink-0 snap-start">
                  <TrendingCard content={content} index={index} />
                </div>
              ))}
            </div>

            <div className="hidden gap-5 lg:grid lg:grid-cols-3">
              {items.map((content, index) => (
                <TrendingCard key={content.id} content={content} index={index} />
              ))}
            </div>
          </>
        ) : (
          <EmptyState
            title="아직 많이 본 콘텐츠가 충분하지 않아요"
            description="조금만 더 운영되면 학부모가 먼저 찾는 흐름을 여기에서 정리해드립니다."
          />
        )}
      </div>
    </section>
  );
}
