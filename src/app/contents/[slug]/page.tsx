import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EventLogger } from "@/components/analytics/EventLogger";
import { TrackedExternalLink } from "@/components/analytics/TrackedExternalLink";
import { ContentCard } from "@/components/cards/ContentCard";
import { SoftCtaSection } from "@/components/sections/SoftCtaSection";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getContentBySlug, getContextualCta, getRelatedContents } from "@/lib/data/content";
import { formatKoreanDate } from "@/lib/utils/format";

interface ContentDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ContentDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const content = await getContentBySlug(decodeURIComponent(resolvedParams.slug));

  return {
    title: content?.title ?? "\uCF58\uD150\uCE20",
    description: content?.summary,
  };
}

export default async function ContentDetailPage({ params }: ContentDetailPageProps) {
  const resolvedParams = await params;
  const content = await getContentBySlug(decodeURIComponent(resolvedParams.slug));

  if (!content) {
    notFound();
  }

  const [related, contextualCta] = await Promise.all([
    getRelatedContents(content, 3),
    getContextualCta(content),
  ]);

  return (
    <>
      <EventLogger eventType="page_view" pagePath={`/contents/${content.slug}`} />
      <EventLogger
        eventType="content_view"
        pagePath={`/contents/${content.slug}`}
        contentId={content.id}
        grade={content.grade}
        topic={content.topic}
        contentType={content.contentType}
      />

      <section className="section-space bg-white">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[32px]">
              <Image src={content.thumbnailUrl} alt={content.title} fill className="object-cover" />
            </div>

            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{content.grade}</Badge>
                <Badge tone="muted">{content.topic}</Badge>
                {content.isFeatured ? <Badge tone="gold">{"\uC6B4\uC601\uC790 \uCD94\uCC9C"}</Badge> : null}
                <span className="text-sm text-text-secondary">{formatKoreanDate(content.publishedAt)}</span>
              </div>

              <h1 className="text-[34px] font-bold leading-[1.18] tracking-[-0.04em] text-text-primary">
                {content.title}
              </h1>
              <p className="text-base text-text-secondary sm:text-lg">{content.summary}</p>

              <div className="flex items-center gap-2 text-sm font-semibold text-navy">
                <span>{content.contentType === "\uC601\uC0C1" ? "\u25B6" : "\u25A3"}</span>
                <span>{content.contentType}</span>
              </div>

              <div className="flex flex-wrap gap-3 pt-3">
                <TrackedExternalLink
                  href={content.externalUrl}
                  event={{
                    eventType: "content_click",
                    pagePath: `/contents/${content.slug}`,
                    contentId: content.id,
                    grade: content.grade,
                    topic: content.topic,
                    externalUrl: content.externalUrl,
                  }}
                  className="inline-flex min-h-12 items-center rounded-full bg-cta-primary px-6 text-sm font-semibold text-white transition hover:bg-navy-light"
                >
                  {content.contentType === "\uC601\uC0C1"
                    ? "\uC601\uC0C1 \uBCF4\uAE30"
                    : "\uC6D0\uBB38 \uBCF4\uAE30"}
                </TrackedExternalLink>

                <TrackedExternalLink
                  href={contextualCta.url}
                  event={{
                    eventType: "cta_click",
                    pagePath: `/contents/${content.slug}`,
                    ctaId: contextualCta.id,
                    contentId: content.id,
                    ctaLabel: contextualCta.label,
                  }}
                  className="inline-flex min-h-12 items-center rounded-full border border-black/10 bg-white px-6 text-sm font-semibold text-text-primary transition hover:border-navy/20 hover:text-navy"
                >
                  {contextualCta.label}
                </TrackedExternalLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space bg-ivory-warm">
        <div className="shell">
          <SectionHeader
            title="\uD568\uAED8 \uBCF4\uBA74 \uC88B\uC740 \uCF58\uD150\uCE20"
            description="\uAC19\uC740 \uD559\uB144\uC774\uAC70\uB098 \uBE44\uC2B7\uD55C \uC8FC\uC81C\uC758 \uCF58\uD150\uCE20\uB97C \uC774\uC5B4\uC11C \uC0B4\uD3B4\uBCF4\uC138\uC694."
          />
          {related.length > 0 ? (
            <div className="grid gap-5 lg:grid-cols-3">
              {related.map((item) => (
                <ContentCard key={item.id} content={item} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="\uC5F0\uAD00 \uCF58\uD150\uCE20\uB97C \uC900\uBE44 \uC911\uC785\uB2C8\uB2E4."
              description="\uAC19\uC740 \uC8FC\uC81C\uC758 \uB2E4\uB978 \uCF58\uD150\uCE20\uAC00 \uACE7 \uCD94\uAC00\uB429\uB2C8\uB2E4."
            />
          )}
        </div>
      </section>

      <SoftCtaSection cta={contextualCta} pagePath={`/contents/${content.slug}`} />
    </>
  );
}
