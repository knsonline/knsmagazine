import Link from "next/link";
import { ContentImpressionTracker } from "@/components/analytics/ContentImpressionTracker";
import { Badge } from "@/components/ui/Badge";
import { ContentThumbnail } from "@/components/ui/ContentThumbnail";
import { ContentTypeInline } from "@/components/ui/ContentTypeInline";
import { getCardDescription } from "@/lib/utils/content-preview";
import { formatKoreanDate } from "@/lib/utils/format";
import type { ContentItem } from "@/types/content";

interface ContentListCardProps {
  content: ContentItem;
}

export function ContentListCard({ content }: ContentListCardProps) {
  const description = getCardDescription(content);

  return (
    <Link
      href={`/contents/${content.slug}`}
      className="group relative block py-2 transition-transform duration-200 hover:-translate-y-1 sm:py-3"
    >
      <ContentImpressionTracker
        contentId={content.id}
        grade={content.grade}
        topic={content.topic}
        contentType={content.contentType}
      />

      <div className="flex items-start gap-4 sm:gap-5">
        <ContentThumbnail
          src={content.thumbnailUrl}
          alt={content.title}
          containerClassName="w-[116px] shrink-0 rounded-[20px] sm:w-[180px] lg:w-[216px]"
          sizes="(max-width: 640px) 116px, (max-width: 1024px) 180px, 216px"
        />

        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{content.grade}</Badge>
            <Badge tone="muted">{content.topic}</Badge>
            <span className="text-sm text-text-secondary">{formatKoreanDate(content.publishedAt)}</span>
          </div>

          {content.isFeatured ? (
            <div className="self-start">
              <Badge tone="gold">운영자 추천</Badge>
            </div>
          ) : null}

          <div className="min-w-0 space-y-2">
            <h3 className="line-clamp-2 text-lg font-semibold leading-7 tracking-[-0.02em] text-text-primary sm:text-xl sm:leading-8">
              {content.title}
            </h3>
            {description ? (
              <p className="line-clamp-2 text-sm leading-6 text-text-secondary sm:text-base sm:leading-7">
                {description}
              </p>
            ) : null}
          </div>

          <ContentTypeInline contentType={content.contentType} className="mt-auto text-sm font-semibold text-navy" />
        </div>
      </div>
    </Link>
  );
}
