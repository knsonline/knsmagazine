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
    title: `${grade} \uCF58\uD150\uCE20`,
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
            title={`${grade} \uCF58\uD150\uCE20`}
            description={`${grade} \uD559\uBD80\uBAA8\uB2D8\uC774 \uAC00\uC7A5 \uB9CE\uC774 \uCC3E\uB294 \uC601\uC5B4 \uD559\uC2B5 \uCF58\uD150\uCE20\uB97C \uBAA8\uC544 \uBCF4\uC558\uC2B5\uB2C8\uB2E4.`}
          />

          {items.length > 0 ? (
            <div className="space-y-4">
              {items.map((content) => (
                <ContentListCard key={content.id} content={content} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="\uC544\uC9C1 \uB4F1\uB85D\uB41C \uCF58\uD150\uCE20\uAC00 \uC5C6\uC5B4\uC694."
              description="\uACE7 \uC774 \uD559\uB144\uC744 \uC704\uD55C \uCF58\uD150\uCE20\uAC00 \uCD94\uAC00\uB429\uB2C8\uB2E4."
            />
          )}
        </div>
      </section>
      <SoftCtaSection cta={consultCta} pagePath={`/grades/${grade}`} />
    </>
  );
}
