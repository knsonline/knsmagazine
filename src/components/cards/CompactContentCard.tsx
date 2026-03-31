import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { MagazineImage } from "@/components/ui/MagazineImage";
import { formatKoreanDate } from "@/lib/utils/format";
import type { ContentItem } from "@/types/content";

interface CompactContentCardProps {
  content: ContentItem;
}

export function CompactContentCard({ content }: CompactContentCardProps) {
  return (
    <Link
      href={`/contents/${content.slug}`}
      className="card-surface group flex gap-4 overflow-hidden p-4 transition-transform duration-200 hover:-translate-y-1"
    >
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl">
        <MagazineImage
          src={content.thumbnailUrl}
          alt={content.title}
          className="object-cover"
          sizes="96px"
        />
      </div>

      <div className="min-w-0 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{content.grade}</Badge>
          <Badge tone="muted">{content.topic}</Badge>
          <span className="text-xs text-text-secondary">{formatKoreanDate(content.publishedAt)}</span>
        </div>
        {content.isFeatured ? <Badge tone="gold">운영자 추천</Badge> : null}
        <h3 className="line-clamp-2 text-base font-semibold leading-7 tracking-[-0.02em] text-text-primary">
          {content.title}
        </h3>
        <p className="line-clamp-2 text-sm text-text-secondary">{content.summary}</p>
        <div className="flex items-center gap-2 text-sm font-semibold text-navy">
          <span>{content.contentType === "영상" ? "▶" : "▣"}</span>
          <span>{content.contentType}</span>
        </div>
      </div>
    </Link>
  );
}
