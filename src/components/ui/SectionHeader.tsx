import Link from "next/link";
import { SECTION_LINK_LABEL } from "@/constants/site";

interface SectionHeaderProps {
  title: string;
  description?: string;
  href?: string;
}

export function SectionHeader({ title, description, href }: SectionHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2">
        <h2 className="text-[28px] font-bold tracking-[-0.03em] text-text-primary">{title}</h2>
        {description ? (
          <p className="max-w-2xl text-sm leading-7 text-text-secondary sm:text-base">{description}</p>
        ) : null}
      </div>

      {href ? (
        <Link
          href={href}
          className="inline-flex min-h-11 items-center self-start text-sm font-semibold text-navy transition hover:text-navy-light"
        >
          {SECTION_LINK_LABEL} →
        </Link>
      ) : null}
    </div>
  );
}
