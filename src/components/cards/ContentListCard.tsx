import Link from "next/link";
import { ContentImpressionTracker } from "@/components/analytics/ContentImpressionTracker";
import { Badge, getGradeBadgeClassName, getTopicBadgeClassName } from "@/components/ui/Badge";
import { ContentPlaceholderMedia, hasRealThumbnail } from "@/components/ui/ContentPlaceholderMedia";
import { ContentThumbnail } from "@/components/ui/ContentThumbnail";
import { ContentTypeInline } from "@/components/ui/ContentTypeInline";
import { getCardDescription } from "@/lib/utils/content-preview";
import { formatKoreanDate } from "@/lib/utils/format";
import { protectPhraseSpacing } from "@/lib/utils/text";
import type { ContentItem } from "@/types/content";

interface ContentListCardProps {
  content: ContentItem;
}

export function ContentListCard({ content }: ContentListCardProps) {
  const description = protectPhraseSpacing(getCardDescription(content));
  const title = protectPhraseSpacing(content.title);
  const hasThumbnail = hasRealThumbnail(content.thumbnailUrlRaw);

  return (
    <Link
      href={`/contents/${content.slug}`}
      className="group relative block overflow-hidden rounded-[24px] border border-black/6 bg-white shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
    >
      <ContentImpressionTracker
        contentId={content.id}
        grade={content.grade}
        topic={content.topic}
      />

      <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-4 px-4 py-4 sm:grid-cols-[132px_minmax(0,1fr)] sm:px-5 sm:py-5 lg:grid-cols-[168px_minmax(0,1fr)] lg:gap-5 lg:px-6">
        <div className="shrink-0 self-start">
          {hasThumbnail ? (
            <ContentThumbnail
              src={content.thumbnailUrl}
              alt={content.title}
              containerClassName="w-full rounded-[18px] border border-black/5 bg-ivory"
              imageClassName="transition duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 112px, (max-width: 1024px) 148px, 184px"
            />
          ) : (
            <ContentPlaceholderMedia content={content} className="rounded-[18px]" />
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-text-secondary sm:text-[13px]">
            <Badge className={getGradeBadgeClassName(content.grade)}>{content.grade}</Badge>
            <Badge className={getTopicBadgeClassName(content.topic)}>{content.topic}</Badge>
            <span className="text-text-secondary/90">{formatKoreanDate(content.publishedAt)}</span>
            {content.isFeatured ? <Badge tone="gold">운영자 추천</Badge> : null}
          </div>

          <div className="mt-3 min-w-0 space-y-2 lg:max-w-[42rem]">
            <h3 className="text-keep text-balance line-clamp-2 text-[18px] font-semibold leading-[1.42] tracking-[-0.012em] text-text-primary sm:text-[20px] lg:text-[21px]">
              {title}
            </h3>
            {description ? (
              <p className="text-keep text-pretty line-clamp-2 max-w-[62ch] text-sm leading-[1.68] text-text-secondary sm:text-[15px]">
                {description}
              </p>
            ) : null}
          </div>

          <div className="mt-3 flex items-center gap-3 pt-1">
            <ContentTypeInline contentType={content.contentType} className="text-[13px] font-semibold text-navy" />
          </div>
        </div>
      </div>
    </Link>
  );
}
