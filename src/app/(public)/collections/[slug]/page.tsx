import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EventLogger } from "@/components/analytics/EventLogger";
import { CompactContentCard } from "@/components/cards/CompactContentCard";
import { ContentCard } from "@/components/cards/ContentCard";
import { SoftCtaSection } from "@/components/sections/SoftCtaSection";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SITE_COPY } from "@/constants/site";
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
      />

      <section className="section-space bg-white">
        <div className="shell">
          <SectionHeader
            title={collection.name}
            description={SITE_COPY.collections.pageDescription}
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
                    title={SITE_COPY.collections.previewEmptyTitle}
                    description={SITE_COPY.collections.previewEmptyDescription}
                  />
                )}
              </div>
            </div>
          ) : (
            <EmptyState
              title={SITE_COPY.collections.pageEmptyTitle}
              description={SITE_COPY.collections.pageEmptyDescription}
            />
          )}
        </div>
      </section>

      <SoftCtaSection
        cta={consultCta}
        pagePath={`/collections/${collection.slug}`}
        placement="collection_soft_cta"
      />
    </>
  );
}
