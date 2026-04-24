import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EventLogger } from "@/components/analytics/EventLogger";
import { ContentListCard } from "@/components/cards/ContentListCard";
import { SoftCtaSection } from "@/components/sections/SoftCtaSection";
import { GradeHeroSection } from "@/components/sections/GradeHeroSection";
import { GradeGuideTeaser } from "@/components/sections/GradeGuideTeaser";
import { EmptyState } from "@/components/ui/EmptyState";
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
      
      <GradeHeroSection grade={grade} />
      <GradeGuideTeaser grade={grade} />

      <section className="bg-white pb-10">
        <div className="shell">
          <div className="flex justify-between items-end mb-3 px-1">
            <div>
              <div className="text-[10px] font-bold text-gold tracking-widest mb-1">MAGAZINE</div>
              <h3 className="text-lg font-extrabold tracking-tight text-navy">{grade} 학부모가 많이 읽은</h3>
            </div>
          </div>

          {items.length > 0 ? (
            <div className="space-y-3">
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
      <SoftCtaSection
        cta={consultCta}
        pagePath={`/grades/${grade}`}
        placement="grade_soft_cta"
      />
    </>
  );
}
