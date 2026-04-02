import { CompactContentCard } from "@/components/cards/CompactContentCard";
import { ContentCard } from "@/components/cards/ContentCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { CollectionItem } from "@/types/content";

interface CollectionSectionProps {
  collection: CollectionItem;
  backgroundClassName?: string;
}

export function CollectionSection({
  collection,
  backgroundClassName = "bg-white",
}: CollectionSectionProps) {
  const [lead, ...rest] = collection.items;

  return (
    <section className={`${backgroundClassName} section-space`}>
      <div className="shell">
        <SectionHeader
          title={collection.name}
          description="한 번에 이어서 보면 흐름이 더 잘 잡히는 주제별 묶음입니다."
          href={`/collections/${collection.slug}`}
        />

        {lead ? (
          <div className="grid gap-5 lg:grid-cols-[1.6fr_minmax(0,1fr)] lg:items-start">
            <div className="min-w-0">
              <ContentCard content={lead} />
            </div>
            <div className="min-w-0 space-y-4">
              {rest.length > 0 ? (
                rest.map((content) => <CompactContentCard key={content.id} content={content} />)
              ) : (
                <EmptyState
                  title="대표 콘텐츠를 먼저 확인해 보세요."
                  description="이 컬렉션은 핵심 콘텐츠를 중심으로 차근차근 확장될 예정입니다."
                />
              )}
            </div>
          </div>
        ) : (
          <EmptyState title="아직 묶인 콘텐츠가 없어요." description="곧 주제별 큐레이션이 채워집니다." />
        )}
      </div>
    </section>
  );
}
