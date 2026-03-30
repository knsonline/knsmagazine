import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { ContentItem } from "@/types/content";

interface TrendingSectionProps {
  items: ContentItem[];
}

const rankLabels = ["01", "02", "03", "04", "05", "06"];

export function TrendingSection({ items }: TrendingSectionProps) {
  return (
    <section className="bg-ivory-warm section-space">
      <div className="shell">
        <SectionHeader
          title="지금 많이 보는 콘텐츠"
          description="학부모님이 가장 먼저 눌러 보는 콘텐츠를 한눈에 정리했습니다."
          href="/contents"
        />

        {items.length > 0 ? (
          <div className="overflow-hidden rounded-[32px] border border-black/6 bg-white">
            {items.map((content, index) => (
              <Link
                key={content.id}
                href={`/contents/${content.slug}`}
                className="grid gap-4 border-b border-black/6 px-5 py-5 transition hover:bg-ivory sm:grid-cols-[72px_1fr] sm:px-7 last:border-b-0"
              >
                <div className="text-2xl font-bold tracking-[-0.04em] text-navy">{rankLabels[index] ?? "00"}</div>
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge>{content.grade}</Badge>
                    <Badge tone="muted">{content.topic}</Badge>
                    {content.isFeatured ? <Badge tone="gold">운영자 추천</Badge> : null}
                  </div>
                  <h3 className="text-lg font-semibold leading-8 tracking-[-0.02em] text-text-primary sm:text-xl">
                    {content.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm font-semibold text-navy">
                    <span>{content.contentType === "영상" ? "▶" : "▣"}</span>
                    <span>{content.contentType}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            title="아직 많이 본 콘텐츠가 쌓이지 않았어요."
            description="조금만 지나면 학부모님이 가장 많이 찾는 흐름이 여기에 정리됩니다."
          />
        )}
      </div>
    </section>
  );
}
