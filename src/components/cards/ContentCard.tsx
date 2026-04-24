import Link from "next/link";
import { ContentImpressionTracker } from "@/components/analytics/ContentImpressionTracker";
import { Badge, getGradeBadgeClassName, getTopicBadgeClassName } from "@/components/ui/Badge";
import { ContentPlaceholderMedia, hasRealThumbnail } from "@/components/ui/ContentPlaceholderMedia";
import { ContentThumbnail } from "@/components/ui/ContentThumbnail";
import { ContentTypeInline } from "@/components/ui/ContentTypeInline";
import { getCardDescription } from "@/lib/utils/content-preview";
import { formatKoreanDate } from "@/lib/utils/format";
import type { ContentItem } from "@/types/content";

interface ContentCardProps {
  content: ContentItem;
}

export function ContentCard({ content }: ContentCardProps) {
  const description = getCardDescription(content);
  const hasThumbnail = hasRealThumbnail(content.thumbnailUrlRaw);

  return (
    <Link
      href={`/contents/${content.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-black/6 bg-white shadow-sm transition-transform duration-200 hover:-translate-y-1"
    >
      <ContentImpressionTracker
        contentId={content.id}
        grade={content.grade}
        topic={content.topic}
      />
      {hasThumbnail ? (
        <ContentThumbnail
          src={content.thumbnailUrl}
          alt={content.title}
          containerClassName="aspect-[4/3] border-b border-black/5 bg-ivory sm:aspect-video"
          imageClassName="transition duration-300 group-hover:scale-[1.015] saturate-[0.96]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      ) : (
        <ContentPlaceholderMedia
          content={content}
          className="aspect-[4/3] border-x-0 border-t-0 border-b-black/5 sm:aspect-video"
        />
      )}

      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={getGradeBadgeClassName(content.grade)}>{content.grade}</Badge>
          <Badge className={getTopicBadgeClassName(content.topic)}>{content.topic}</Badge>
          <span className="text-sm text-text-secondary">{formatKoreanDate(content.publishedAt)}</span>
          {content.isFeatured ? <Badge tone="gold">운영자 추천</Badge> : null}
        </div>

        <div className="space-y-2.5">
          <h3 className="text-keep text-balance line-clamp-2 text-[20px] font-semibold leading-[1.42] tracking-[-0.012em] text-text-primary lg:text-xl">
            {content.title}
          </h3>
          {description ? (
            <p className="text-keep text-pretty line-clamp-3 text-sm leading-[1.72] text-text-secondary sm:line-clamp-2 sm:text-[15px]">
              {description}
            </p>
          ) : null}
        </div>

        <ContentTypeInline contentType={content.contentType} className="mt-auto text-sm font-semibold text-navy" />
      </div>
    </Link>
  );
}
