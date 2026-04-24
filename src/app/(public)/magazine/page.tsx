import type { Metadata } from "next";
import { EventLogger } from "@/components/analytics/EventLogger";
import { ContentListCard } from "@/components/cards/ContentListCard";
import { SoftCtaSection } from "@/components/sections/SoftCtaSection";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SITE_COPY, SITE_NAME } from "@/constants/site";
import { getLatestContents, getPrimaryConsultCta } from "@/lib/data/content";
import { clampPage } from "@/lib/utils/format";

const CONTENTS_OVERVIEW_PAGE_SIZE = 12;

export const metadata: Metadata = {
  title: "전체 콘텐츠",
  description: `${SITE_NAME}의 최신 콘텐츠 목록입니다.`,
};

interface ContentsPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function ContentsPage({ searchParams }: ContentsPageProps) {
  const resolvedSearchParams = await searchParams;
  const preview = await getLatestContents(1, CONTENTS_OVERVIEW_PAGE_SIZE);
  const currentPage = clampPage(resolvedSearchParams.page, preview.totalPages);
  const [{ items, totalPages }, consultCta] = await Promise.all([
    getLatestContents(currentPage, CONTENTS_OVERVIEW_PAGE_SIZE),
    getPrimaryConsultCta(),
  ]);

  return (
    <>
      <EventLogger eventType="page_view" pagePath="/contents" />
      <section className="section-space bg-white">
        <div className="shell">
          <SectionHeader
            title="전체 콘텐츠"
            description={SITE_COPY.contentsDescription}
          />

          {items.length > 0 ? (
            <div className="space-y-3">
              {items.map((content) => (
                <ContentListCard key={content.id} content={content} />
              ))}
            </div>
          ) : (
            <EmptyState title="콘텐츠가 아직 없습니다." description="곧 새로운 콘텐츠가 등록됩니다." />
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            makeHref={(page) => `/contents?page=${page}`}
          />
        </div>
      </section>
      <SoftCtaSection cta={consultCta} pagePath="/contents" placement="contents_soft_cta" />
    </>
  );
}
