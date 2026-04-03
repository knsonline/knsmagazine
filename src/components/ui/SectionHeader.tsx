import Link from "next/link";
import { SECTION_LINK_LABEL } from "@/constants/site";
import { protectPhraseSpacing } from "@/lib/utils/text";

interface SectionHeaderProps {
  title: string;
  description?: string;
  href?: string;
}

export function SectionHeader({ title, description, href }: SectionHeaderProps) {
  const resolvedTitle = protectPhraseSpacing(title);
  const resolvedDescription = protectPhraseSpacing(description);
  const resolvedLinkLabel = protectPhraseSpacing(SECTION_LINK_LABEL);

  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2.5">
        <h2 className="text-keep text-balance max-w-[14ch] text-[28px] font-bold leading-[1.28] tracking-[-0.03em] text-text-primary sm:max-w-[18ch] lg:max-w-[20ch]">
          {resolvedTitle}
        </h2>
        {resolvedDescription ? (
          <p className="text-keep text-pretty text-reading-tight max-w-[40rem] text-sm leading-[1.75] text-text-secondary sm:text-base">
            {resolvedDescription}
          </p>
        ) : null}
      </div>

      {href ? (
        <Link
          href={href}
          className="text-button inline-flex min-h-11 items-center self-start text-sm font-semibold text-navy transition hover:text-navy-light"
        >
          {resolvedLinkLabel} →
        </Link>
      ) : null}
    </div>
  );
}
