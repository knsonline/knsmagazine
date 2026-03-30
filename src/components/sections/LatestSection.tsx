import { ContentListCard } from "@/components/cards/ContentListCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { ContentItem } from "@/types/content";

interface LatestSectionProps {
  items: ContentItem[];
}

export function LatestSection({ items }: LatestSectionProps) {
  return (
    <section className="bg-white section-space">
      <div className="shell">
        <SectionHeader
          title="최신 콘텐츠"
          description="최근 등록된 콘텐츠를 차분한 흐름으로 살펴보세요."
          href="/contents"
        />

        {items.length > 0 ? (
          <div className="space-y-4">
            {items.map((content) => (
              <ContentListCard key={content.id} content={content} />
            ))}
          </div>
        ) : (
          <EmptyState title="최신 콘텐츠를 준비 중입니다." description="곧 새로운 콘텐츠가 추가됩니다." />
        )}
      </div>
    </section>
  );
}
