import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EventLogger } from "@/components/analytics/EventLogger";
import { ContentListCard } from "@/components/cards/ContentListCard";
import { SoftCtaSection } from "@/components/sections/SoftCtaSection";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PRIMARY_GRADES } from "@/constants/taxonomy";
import { getContentsByGrade, getPrimaryConsultCta } from "@/lib/data/content";
import type { Grade } from "@/types/content";

interface GradePageProps {
  params: Promise<{
    grade: string;
  }>;
}

export async function generateMetadata({ params }: GradePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const grade = decodeURIComponent(resolvedParams.grade);

  return {
    title: `${grade} 콘텐츠`,
  };
}

export default async function GradePage({ params }: GradePageProps) {
  const resolvedParams = await params;
  const grade = decodeURIComponent(resolvedParams.grade) as Grade;

  if (!PRIMARY_GRADES.includes(grade)) {
    notFound();
  }

  const [items, consultCta] = await Promise.all([getContentsByGrade(grade), getPrimaryConsultCta()]);

  return (
    <>
      <EventLogger eventType="page_view" pagePath={`/grades/${grade}`} grade={grade} />
      <section className="section-space bg-white">
        <div className="shell">
          <SectionHeader
            title={`${grade} 콘텐츠`}
            description={`${grade} 학부모님이 가장 많이 찾는 영어 학습 콘텐츠를 모아 보았습니다.`}
          />

          {items.length > 0 ? (
            <div className="space-y-4">
              {items.map((content) => (
                <ContentListCard key={content.id} content={content} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="아직 등록된 콘텐츠가 없어요."
              description="곧 이 학년을 위한 콘텐츠가 추가됩니다."
            />
          )}
        </div>
      </section>
      <SoftCtaSection cta={consultCta} pagePath={`/grades/${grade}`} />
    </>
  );
}
