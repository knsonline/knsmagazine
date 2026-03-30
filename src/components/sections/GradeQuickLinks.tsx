import { TrackedInternalLink } from "@/components/analytics/TrackedInternalLink";
import { PRIMARY_GRADES } from "@/constants/taxonomy";

interface GradeQuickLinksProps {
  currentPath: string;
}

export function GradeQuickLinks({ currentPath }: GradeQuickLinksProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {PRIMARY_GRADES.map((grade) => (
        <TrackedInternalLink
          key={grade}
          href={`/grades/${grade}`}
          event={{
            eventType: "grade_select",
            pagePath: currentPath,
            grade,
          }}
          className="flex min-h-14 items-center justify-center rounded-2xl border border-white/14 bg-white/8 px-4 text-sm font-semibold text-white transition hover:bg-white/12"
        >
          {grade}
        </TrackedInternalLink>
      ))}
    </div>
  );
}
