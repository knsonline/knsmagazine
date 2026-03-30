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
    title: collection?.name ?? "\uCEEC\uB809\uC158",
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
            description="\uD55C \uC8FC\uC81C\uB97C \uC785\uCCB4\uC801\uC73C\uB85C \uC774\uD574\uD560 \uC218 \uC788\uB3C4\uB85D \uC5F0\uACB0\uD55C \uD050\uB808\uC774\uC158 \uBB36\uC74C\uC785\uB2C8\uB2E4."
          />

          {lead ? (
            <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
              <ContentCard content={lead} />
              <div className="space-y-4">
                {rest.length > 0 ? (
                  rest.map((item) => <CompactContentCard key={item.id} content={item} />)
                ) : (
                  <EmptyState
                    title="\uB300\uD45C \uCF58\uD150\uCE20\uBD80\uD130 \uBA3C\uC800 \uC77D\uC5B4 \uBCF4\uC138\uC694."
                    description="\uC774 \uCEEC\uB809\uC158\uC740 \uD575\uC2EC \uCF58\uD150\uCE20\uB97C \uC911\uC2EC\uC73C\uB85C \uCC28\uBD84\uD558\uAC8C \uD655\uC7A5\uB429\uB2C8\uB2E4."
                  />
                )}
              </div>
            </div>
          ) : (
            <EmptyState
              title="\uCEEC\uB809\uC158\uC774 \uBE44\uC5B4 \uC788\uC5B4\uC694."
              description="\uACE7 \uAD00\uB828 \uCF58\uD150\uCE20\uAC00 \uCC44\uC6CC\uC9C8 \uC608\uC815\uC785\uB2C8\uB2E4."
            />
          )}
        </div>
      </section>

      <SoftCtaSection cta={consultCta} pagePath={`/collections/${collection.slug}`} />
    </>
  );
}
