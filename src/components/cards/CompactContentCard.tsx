import Link from "next/link";
import { ContentImpressionTracker } from "@/components/analytics/ContentImpressionTracker";
import { Badge } from "@/components/ui/Badge";
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
      className="card-surface group relative block w-full overflow-hidden px-5 py-4 transition-transform duration-200 hover:-translate-y-1"
    >
      <ContentImpressionTracker
        contentId={content.id}
        grade={content.grade}
        topic={content.topic}
        contentType={content.contentType}
      />

      <div className="min-w-0 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{content.grade}</Badge>
          <Badge tone="muted">{content.topic}</Badge>
          <span className="text-xs text-text-secondary">{formatKoreanDate(content.publishedAt)}</span>
        </div>

        {content.isFeatured ? (
          <div className="self-start">
            <Badge tone="gold">운영자 추천</Badge>
          </div>
        ) : null}

        <div className="min-w-0 space-y-2">
          <h3 className="line-clamp-2 text-[17px] font-semibold leading-7 tracking-[-0.02em] text-text-primary">
            {content.title}
          </h3>
          {description ? <p className="line-clamp-2 text-sm leading-6 text-text-secondary">{description}</p> : null}
        </div>

        <ContentTypeInline contentType={content.contentType} className="text-sm font-semibold text-navy" />
      </div>
    </Link>
  );
}
