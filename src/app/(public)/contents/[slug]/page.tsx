import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EventLogger } from "@/components/analytics/EventLogger";
import { TrackedExternalLink } from "@/components/analytics/TrackedExternalLink";
import { ContentCard } from "@/components/cards/ContentCard";
import { SoftCtaSection } from "@/components/sections/SoftCtaSection";
import { Badge } from "@/components/ui/Badge";
import { ContentThumbnail } from "@/components/ui/ContentThumbnail";
import { ContentTypeInline } from "@/components/ui/ContentTypeInline";
import { EmptyState } from "@/components/ui/EmptyState";
import { PlainTextContent } from "@/components/ui/PlainTextContent";
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
    title: content?.title ?? "콘텐츠",
    description: content?.summary || content?.body,
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
  const hasBody = content.body.length > 0;

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
            <ContentThumbnail
              src={content.thumbnailUrl}
              alt={content.title}
              containerClassName="rounded-[32px]"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />

            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{content.grade}</Badge>
                <Badge tone="muted">{content.topic}</Badge>
                {content.isFeatured ? <Badge tone="gold">운영자 추천</Badge> : null}
                <span className="text-sm text-text-secondary">{formatKoreanDate(content.publishedAt)}</span>
              </div>

              <h1 className="text-[34px] font-bold leading-[1.18] tracking-[-0.04em] text-text-primary">
                {content.title}
              </h1>
              <p className="whitespace-pre-line text-base leading-8 text-text-secondary sm:text-lg">
                {content.summary || "상세 설명은 아래 본문에서 확인할 수 있습니다."}
              </p>

              <ContentTypeInline contentType={content.contentType} className="text-sm font-semibold text-navy" />

              <div className="flex flex-wrap gap-3 pt-3">
                <TrackedExternalLink
                  href={content.externalUrl}
                  event={{
                    eventType: "content_click",
                    pagePath: `/contents/${content.slug}`,
                    contentId: content.id,
                    contentSlug: content.slug,
                    grade: content.grade,
                    topic: content.topic,
                    externalUrl: content.externalUrl,
                    placement: "content_primary",
                  }}
                  className="inline-flex min-h-12 items-center rounded-full bg-cta-primary px-6 text-sm font-semibold text-white transition hover:bg-navy-light"
                >
                  {content.contentType === "영상" ? "영상 보기" : "원문 보기"}
                </TrackedExternalLink>

                <TrackedExternalLink
                  href={contextualCta.url}
                  event={{
                    eventType: "cta_click",
                    pagePath: `/contents/${content.slug}`,
                    ctaId: contextualCta.id,
                    contentId: content.id,
                    ctaLabel: contextualCta.label,
                    contentSlug: content.slug,
                    placement: "content_detail_cta",
                  }}
                  className="inline-flex min-h-12 items-center rounded-full border border-black/10 bg-white px-6 text-sm font-semibold text-text-primary transition hover:border-navy/20 hover:text-navy"
                >
                  {contextualCta.label}
                </TrackedExternalLink>
              </div>
            </div>
          </div>

          {hasBody ? (
            <article className="mt-10 rounded-[32px] bg-ivory px-6 py-7 sm:px-8 sm:py-9">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold text-text-secondary">상세 설명</p>
                <PlainTextContent
                  text={content.body}
                  className="mt-4"
                  paragraphClassName="text-base leading-8 text-text-primary sm:text-lg"
                />
              </div>
            </article>
          ) : null}
        </div>
      </section>

      <section className="section-space bg-ivory-warm">
        <div className="shell">
          <SectionHeader
            title="함께 보면 좋은 콘텐츠"
            description="같은 학년이거나 비슷한 주제의 콘텐츠를 이어서 살펴보세요."
          />
          {related.length > 0 ? (
            <div className="grid gap-5 lg:grid-cols-3">
              {related.map((item) => (
                <ContentCard key={item.id} content={item} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="연관 콘텐츠를 준비 중입니다."
              description="같은 주제의 다른 콘텐츠가 곧 추가됩니다."
            />
          )}
        </div>
      </section>

      <SoftCtaSection cta={contextualCta} pagePath={`/contents/${content.slug}`} />
    </>
  );
}
