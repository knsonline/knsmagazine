import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EventLogger } from "@/components/analytics/EventLogger";
import { TrackedExternalLink } from "@/components/analytics/TrackedExternalLink";
import { ContentCard } from "@/components/cards/ContentCard";
import { SoftCtaSection } from "@/components/sections/SoftCtaSection";
import { Badge, getGradeBadgeClassName, getTopicBadgeClassName } from "@/components/ui/Badge";
import { hasRealThumbnail } from "@/components/ui/ContentPlaceholderMedia";
import { ContentThumbnail } from "@/components/ui/ContentThumbnail";
import { ContentTypeInline } from "@/components/ui/ContentTypeInline";
import { EmptyState } from "@/components/ui/EmptyState";
import { PlainTextContent } from "@/components/ui/PlainTextContent";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  getConsultCtaForGrade,
  getContentBySlug,
  getContextualCta,
  getRelatedContents,
} from "@/lib/data/content";
import { formatKoreanDate } from "@/lib/utils/format";
import { protectPhraseSpacing } from "@/lib/utils/text";

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

  const [related, contextualCta, consultCta] = await Promise.all([
    getRelatedContents(content, 3),
    getContextualCta(content),
    getConsultCtaForGrade(content.grade),
  ]);
  const hasBody = content.body.length > 0;
  const hasThumbnail = hasRealThumbnail(content.thumbnailUrlRaw);
  const title = protectPhraseSpacing(content.title);
  const summary = protectPhraseSpacing(content.summary || "상세 설명은 아래 본문에서 확인할 수 있습니다.");
  const primaryLabel = protectPhraseSpacing(content.contentType === "영상" ? "영상 보기" : "원문 보기");
  const consultCtaLabel = protectPhraseSpacing(
    consultCta.consultSegment ? `${consultCta.consultSegment} 상담 연결` : "상담 연결",
  );
  const secondaryCta = contextualCta.id !== consultCta.id ? contextualCta : null;
  const secondaryCtaLabel = secondaryCta ? protectPhraseSpacing(secondaryCta.label) : null;

  return (
    <>
      <EventLogger eventType="page_view" pagePath={`/contents/${content.slug}`} />
      <EventLogger
        eventType="content_view"
        pagePath={`/contents/${content.slug}`}
        contentId={content.id}
        grade={content.grade}
        topic={content.topic}
      />

      <section className="section-space bg-white pb-28 md:pb-20">
        <div className="shell">
          <div className={hasThumbnail ? "grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start" : "max-w-[48rem]"}>
            <div className={`order-1 space-y-5 ${hasThumbnail ? "lg:pr-4" : "max-w-[46rem]"}`}>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={getGradeBadgeClassName(content.grade)}>{content.grade}</Badge>
                <Badge className={getTopicBadgeClassName(content.topic)}>{content.topic}</Badge>
                {content.isFeatured ? <Badge tone="gold">운영자 추천</Badge> : null}
                <span className="text-sm text-text-secondary">{formatKoreanDate(content.publishedAt)}</span>
              </div>

              <h1
                className={`text-keep text-balance text-[34px] font-bold leading-[1.22] tracking-[-0.025em] text-text-primary ${
                  hasThumbnail ? "max-w-[18ch] lg:max-w-[20ch]" : "max-w-[22ch] lg:max-w-[24ch]"
                }`}
              >
                {title}
              </h1>
              <p className="text-keep text-pretty max-w-[40rem] whitespace-pre-line text-base leading-[1.8] text-text-secondary sm:text-lg">
                {summary}
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
                    placement: "content_primary_cta",
                  }}
                  className="text-keep inline-flex min-h-12 max-w-full items-center justify-center rounded-full bg-cta-primary px-6 text-center text-sm font-semibold leading-[1.35] text-white transition hover:bg-navy-light sm:whitespace-nowrap"
                >
                  {primaryLabel}
                </TrackedExternalLink>
              </div>
            </div>

            {hasThumbnail ? (
              <ContentThumbnail
                src={content.thumbnailUrl}
                alt={content.title}
                containerClassName="order-2 rounded-[32px]"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : null}
          </div>

          {hasBody ? (
            <article className="mt-10 border-t border-[rgba(27,42,74,0.08)] pt-8">
              <PlainTextContent
                text={content.body}
                className="text-reading"
                paragraphClassName="text-base leading-8 text-text-primary sm:text-lg"
              />
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

      {secondaryCta ? (
        <section className="bg-white pb-6">
          <div className="shell">
            <div className="rounded-[28px] border border-black/6 bg-[linear-gradient(180deg,rgba(248,245,241,0.92),rgba(255,255,255,0.98))] px-5 py-5 sm:px-6">
              <p className="text-sm font-semibold tracking-[0.03em] text-text-secondary">더 살펴보기</p>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm leading-[1.75] text-text-primary">
                  비슷한 흐름을 조금 더 이어 보고 싶다면 이 안내도 함께 확인해 보세요.
                </p>
                <TrackedExternalLink
                  href={secondaryCta.url}
                  event={{
                    eventType: "cta_click",
                    pagePath: `/contents/${content.slug}`,
                    ctaId: secondaryCta.id,
                    contentId: content.id,
                    ctaLabel: secondaryCta.label,
                    contentSlug: content.slug,
                    placement: "content_secondary_cta",
                  }}
                  className="text-keep inline-flex min-h-11 max-w-full items-center justify-center rounded-full border border-black/10 bg-white px-5 text-center text-sm font-semibold leading-[1.35] text-text-primary transition hover:border-navy/20 hover:text-navy sm:whitespace-nowrap"
                >
                  {secondaryCtaLabel}
                </TrackedExternalLink>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <SoftCtaSection
        cta={consultCta}
        pagePath={`/contents/${content.slug}`}
        placement="content_soft_cta"
      />

      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-black/8 bg-white/95 px-4 py-2.5 shadow-[0_-14px_34px_-30px_rgba(27,42,74,0.24)] backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3">
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
              placement: "content_sticky_primary",
            }}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-navy px-4 text-sm font-semibold text-white"
          >
            {primaryLabel}
          </TrackedExternalLink>
          <TrackedExternalLink
            href={consultCta.url}
            event={{
              eventType: "cta_click",
              pagePath: `/contents/${content.slug}`,
              ctaId: consultCta.id,
              contentId: content.id,
              ctaLabel: consultCta.label,
              contentSlug: content.slug,
              placement: "content_sticky_consult",
            }}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-gold px-4 text-sm font-semibold text-navy"
          >
            {consultCtaLabel}
          </TrackedExternalLink>
        </div>
      </div>
    </>
  );
}
