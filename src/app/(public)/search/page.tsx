import type { Metadata } from "next";
import Link from "next/link";
import { EventLogger } from "@/components/analytics/EventLogger";
import { ContentListCard } from "@/components/cards/ContentListCard";
import { SoftCtaSection } from "@/components/sections/SoftCtaSection";
import { Badge, getGradeBadgeClassName, getTopicBadgeClassName } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SITE_COPY } from "@/constants/site";
import { PRIMARY_GRADES, TOPICS } from "@/constants/taxonomy";
import { getPrimaryConsultCta, getTrendingContents, searchContents } from "@/lib/data/content";
import type { Grade, Topic } from "@/types/content";

export const metadata: Metadata = {
  title: "콘텐츠 검색",
};

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    grade?: string;
    topic?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q?.trim() ?? "";
  const grade = resolvedSearchParams.grade ? (decodeURIComponent(resolvedSearchParams.grade) as Grade) : undefined;
  const topic = resolvedSearchParams.topic ? (decodeURIComponent(resolvedSearchParams.topic) as Topic) : undefined;
  const [items, fallback, consultCta] = await Promise.all([
    searchContents(query, { grade, topic }),
    getTrendingContents(4),
    getPrimaryConsultCta(),
  ]);

  return (
    <>
      <EventLogger eventType="page_view" pagePath="/search" grade={grade} topic={topic} />
      <section className="section-space bg-white">
        <div className="shell">
          <SectionHeader
            title={SITE_COPY.searchTitle}
            description={SITE_COPY.searchDescription}
          />

          <div className="mb-6 rounded-[28px] border border-black/6 bg-[linear-gradient(180deg,rgba(248,245,241,0.92),rgba(255,255,255,0.98))] px-5 py-5 sm:px-6">
            <div className="space-y-2">
              <p className="text-sm font-semibold tracking-[0.03em] text-text-secondary">
                {SITE_COPY.searchTopicTitle}
              </p>
              <p className="text-sm leading-[1.72] text-text-secondary">
                {SITE_COPY.searchTopicDescription}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {PRIMARY_GRADES.map((gradeItem) => (
                <Link
                  key={gradeItem}
                  href={`/search?grade=${encodeURIComponent(gradeItem)}`}
                  className="rounded-full"
                >
                  <Badge
                    tone={grade === gradeItem ? "gold" : "navy"}
                    className={grade === gradeItem ? undefined : getGradeBadgeClassName(gradeItem)}
                  >
                    {gradeItem}
                  </Badge>
                </Link>
              ))}
              {TOPICS.map((topicItem) => (
                <Link
                  key={topicItem}
                  href={`/search?topic=${encodeURIComponent(topicItem)}`}
                  className="rounded-full"
                >
                  <Badge
                    tone={topic === topicItem ? "gold" : "muted"}
                    className={topic === topicItem ? undefined : getTopicBadgeClassName(topicItem)}
                  >
                    {topicItem}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>

          <form className="card-surface mb-8 grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:p-6">
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="예: 내신, 수능, 학습법"
              className="min-h-12 rounded-2xl border border-black/10 bg-ivory px-4 text-base text-text-primary outline-none placeholder:text-text-muted focus:border-navy/30"
            />
            <button
              type="submit"
              className="text-button inline-flex min-h-12 items-center justify-center rounded-2xl bg-cta-primary px-5 text-sm font-semibold text-white"
            >
              검색하기
            </button>
          </form>

          {items.length > 0 ? (
            <div className="space-y-4">
              {items.map((content) => (
                <ContentListCard key={content.id} content={content} />
              ))}
            </div>
          ) : query || grade || topic ? (
            <EmptyState
              title="조건에 맞는 콘텐츠를 찾지 못했어요."
              description="검색어를 조금 더 짧게 입력하거나 다른 학년·주제로 다시 찾아보세요."
            />
          ) : (
            <div className="space-y-4">
              <p className="text-sm font-semibold text-text-secondary">{SITE_COPY.searchFallbackTitle}</p>
              {fallback.map((content) => (
                <ContentListCard key={content.id} content={content} />
              ))}
            </div>
          )}
        </div>
      </section>
      <SoftCtaSection cta={consultCta} pagePath="/search" placement="search_soft_cta" />
    </>
  );
}
