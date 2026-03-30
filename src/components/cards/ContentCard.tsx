import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { formatKoreanDate } from "@/lib/utils/format";
import type { ContentItem } from "@/types/content";

interface ContentCardProps {
  content: ContentItem;
}

export function ContentCard({ content }: ContentCardProps) {
  return (
    <Link
      href={`/contents/${content.slug}`}
      className="card-surface group flex h-full flex-col overflow-hidden transition-transform duration-200 hover:-translate-y-1"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={content.thumbnailUrl}
          alt={content.title}
          fill
          className="object-cover transition duration-300 group-hover:scale-[1.02]"
        />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{content.grade}</Badge>
          <Badge tone="muted">{content.topic}</Badge>
          <span className="text-sm text-text-secondary">{formatKoreanDate(content.publishedAt)}</span>
        </div>

        {content.isFeatured ? <Badge tone="gold">운영자 추천</Badge> : null}

        <div className="space-y-3">
          <h3 className="text-xl font-semibold leading-8 tracking-[-0.02em] text-text-primary">
            {content.title}
          </h3>
          <p className="line-clamp-3 text-sm text-text-secondary sm:text-base">{content.summary}</p>
        </div>

        <div className="mt-auto flex items-center gap-2 text-sm font-semibold text-navy">
          <span>{content.contentType === "영상" ? "▶" : "▣"}</span>
          <span>{content.contentType}</span>
        </div>
      </div>
    </Link>
  );
}
