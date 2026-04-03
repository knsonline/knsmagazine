import Link from "next/link";
import { ContentImpressionTracker } from "@/components/analytics/ContentImpressionTracker";
import { Badge } from "@/components/ui/Badge";
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

  return (
    <Link
      href={`/contents/${content.slug}`}
      className="card-surface group relative flex h-full flex-col overflow-hidden transition-transform duration-200 hover:-translate-y-1"
    >
      <ContentImpressionTracker
        contentId={content.id}
        grade={content.grade}
        topic={content.topic}
        contentType={content.contentType}
      />
      <ContentThumbnail
        src={content.thumbnailUrl}
        alt={content.title}
        containerClassName="aspect-[4/3] border-b border-[rgba(27,42,74,0.06)] bg-[#edf3f9] sm:aspect-video"
        imageClassName="transition duration-300 group-hover:scale-[1.015] saturate-[0.96]"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />

      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
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

        <div className="space-y-2.5">
          <h3 className="text-keep text-balance line-clamp-2 text-[21px] font-semibold leading-[1.42] tracking-[-0.025em] text-text-primary lg:text-xl">
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
