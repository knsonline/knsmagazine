import Link from "next/link";
import { ContentImpressionTracker } from "@/components/analytics/ContentImpressionTracker";
import { Badge } from "@/components/ui/Badge";
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
      className="card-surface group relative block overflow-hidden rounded-[28px] transition-transform duration-200 hover:-translate-y-0.5"
    >
      <ContentImpressionTracker
        contentId={content.id}
        grade={content.grade}
        topic={content.topic}
        contentType={content.contentType}
      />

      <div className="grid grid-cols-[112px_minmax(0,1fr)] gap-4 px-4 py-4 sm:grid-cols-[148px_minmax(0,1fr)] sm:px-5 sm:py-5 lg:grid-cols-[184px_minmax(0,1fr)] lg:gap-5 lg:px-6">
        <div className="shrink-0 self-start">
          {hasThumbnail ? (
            <ContentThumbnail
              src={content.thumbnailUrl}
              alt={content.title}
              containerClassName="w-full rounded-[18px] border border-[rgba(27,42,74,0.08)] bg-[#edf3f9]"
              imageClassName="transition duration-300 group-hover:scale-[1.02] saturate-[0.96]"
              sizes="(max-width: 640px) 112px, (max-width: 1024px) 148px, 184px"
            />
          ) : (
            <ContentPlaceholderMedia content={content} className="rounded-[18px]" />
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-text-secondary sm:text-[13px]">
            <Badge>{content.grade}</Badge>
            <Badge tone="muted">{content.topic}</Badge>
            <span className="text-text-secondary/90">{formatKoreanDate(content.publishedAt)}</span>
            {content.isFeatured ? <Badge tone="gold">운영자 추천</Badge> : null}
          </div>

          <div className="mt-3 min-w-0 space-y-2 lg:max-w-[42rem]">
            <h3 className="text-keep text-balance line-clamp-2 text-[18px] font-semibold leading-[1.42] tracking-[-0.025em] text-text-primary sm:text-[20px] lg:text-[21px]">
              {title}
            </h3>
            {description ? (
              <p className="text-keep text-pretty line-clamp-2 max-w-[62ch] text-sm leading-[1.68] text-text-secondary sm:text-[15px]">
                {description}
              </p>
            ) : null}
          </div>

          <div className="mt-3 flex items-center justify-between gap-3 border-t border-[rgba(27,42,74,0.07)] pt-3">
            <ContentTypeInline contentType={content.contentType} className="text-[13px] font-semibold text-navy" />
            <span className="text-xs font-semibold tracking-[0.01em] text-text-muted">상세 보기</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
