import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EventLogger } from "@/components/analytics/EventLogger";
import { CompactContentCard } from "@/components/cards/CompactContentCard";
import { ContentCard } from "@/components/cards/ContentCard";
import { SoftCtaSection } from "@/components/sections/SoftCtaSection";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getCollectionBySlug, getPrimaryConsultCta } from "@/lib/data/content";

interface CollectionPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const collection = await getCollectionBySlug(decodeURIComponent(resolvedParams.slug));

  return {
    title: collection?.name ?? "컬렉션",
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const resolvedParams = await params;
  const collection = await getCollectionBySlug(decodeURIComponent(resolvedParams.slug));

  if (!collection) {
    notFound();
  }

  const [lead, ...rest] = collection.items;
  const consultCta = await getPrimaryConsultCta();

  return (
    <>
      <EventLogger eventType="page_view" pagePath={`/collections/${collection.slug}`} />
      <EventLogger
        eventType="collection_view"
        pagePath={`/collections/${collection.slug}`}
        collectionId={collection.id}
        collectionName={collection.name}
      />

      <section className="section-space bg-white">
        <div className="shell">
          <SectionHeader
            title={collection.name}
            description="한 주제를 입체적으로 이해할 수 있도록 연결한 큐레이션 묶음입니다."
          />

          {lead ? (
            <div className="grid gap-5 lg:grid-cols-[1.6fr_minmax(0,1fr)] lg:items-start">
              <div className="min-w-0">
                <ContentCard content={lead} />
              </div>
              <div className="min-w-0 space-y-4">
                {rest.length > 0 ? (
                  rest.map((item) => <CompactContentCard key={item.id} content={item} />)
                ) : (
                  <EmptyState
                    title="대표 콘텐츠부터 먼저 읽어 보세요."
                    description="이 컬렉션은 핵심 콘텐츠를 중심으로 차분하게 확장됩니다."
                  />
                )}
              </div>
            </div>
          ) : (
            <EmptyState
              title="컬렉션이 비어 있어요."
              description="곧 관련 콘텐츠가 채워질 예정입니다."
            />
          )}
        </div>
      </section>

      <SoftCtaSection cta={consultCta} pagePath={`/collections/${collection.slug}`} />
    </>
  );
}
