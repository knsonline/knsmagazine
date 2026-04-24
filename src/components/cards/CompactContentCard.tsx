import Link from "next/link";
import { ContentImpressionTracker } from "@/components/analytics/ContentImpressionTracker";
import { Badge, getGradeBadgeClassName, getTopicBadgeClassName } from "@/components/ui/Badge";
import { ContentTypeInline } from "@/components/ui/ContentTypeInline";
import { getCompactDescription } from "@/lib/utils/content-preview";
import { formatKoreanDate } from "@/lib/utils/format";
import type { ContentItem } from "@/types/content";

interface CompactContentCardProps {
  content: ContentItem;
}

export function CompactContentCard({ content }: CompactContentCardProps) {
  const description = getCompactDescription(content);

  return (
    <Link
      href={`/contents/${content.slug}`}
      className="group relative block w-full overflow-hidden rounded-[24px] border border-black/6 bg-white px-5 py-4 shadow-sm transition-transform duration-200 hover:-translate-y-1"
    >
      <ContentImpressionTracker
        contentId={content.id}
        grade={content.grade}
        topic={content.topic}
      />

      <div className="min-w-0 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={getGradeBadgeClassName(content.grade)}>{content.grade}</Badge>
          <Badge className={getTopicBadgeClassName(content.topic)}>{content.topic}</Badge>
          <span className="text-xs text-text-secondary">{formatKoreanDate(content.publishedAt)}</span>
          {content.isFeatured ? <Badge tone="gold">운영자 추천</Badge> : null}
        </div>

        <div className="min-w-0 space-y-2.5">
          <h3 className="text-keep text-balance line-clamp-2 text-[17px] font-semibold leading-[1.55] tracking-[-0.01em] text-text-primary">
            {content.title}
          </h3>
          {description ? (
            <p className="text-keep text-pretty line-clamp-2 text-sm leading-[1.65] text-text-secondary">{description}</p>
          ) : null}
        </div>

        <ContentTypeInline contentType={content.contentType} className="text-sm font-semibold text-navy" />
      </div>
    </Link>
  );
}
