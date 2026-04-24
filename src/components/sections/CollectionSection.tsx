import { CompactContentCard } from "@/components/cards/CompactContentCard";
import { ContentCard } from "@/components/cards/ContentCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SITE_COPY } from "@/constants/site";
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
          description={SITE_COPY.collections.description}
          href={`/collections/${collection.slug}`}
        />

        {lead ? (
          <div className="rounded-[32px] border border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,245,241,0.95))] p-5 sm:p-6">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-semibold tracking-[0.03em] text-text-secondary">작은 특집호</p>
              </div>
              <div className="rounded-full bg-ivory px-4 py-2 text-xs font-semibold text-text-secondary">
                대표 1개 + 이어 읽기 {rest.length}개
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1.45fr_minmax(0,1fr)] lg:items-start xl:grid-cols-[1.55fr_minmax(0,1fr)]">
              <div className="min-w-0">
                <ContentCard content={lead} />
              </div>
              <div className="min-w-0 space-y-4">
                {rest.length > 0 ? (
                  rest.map((content) => <CompactContentCard key={content.id} content={content} />)
                ) : (
                  <EmptyState
                    title={SITE_COPY.collections.previewEmptyTitle}
                    description={SITE_COPY.collections.previewEmptyDescription}
                  />
                )}
              </div>
            </div>
          </div>
        ) : (
          <EmptyState title={SITE_COPY.collections.pageEmptyTitle} description={SITE_COPY.collections.pageEmptyDescription} />
        )}
      </div>
    </section>
  );
}
