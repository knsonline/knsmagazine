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
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between lg:mb-7">
      <div className="space-y-2">
        <h2 className="text-keep text-balance max-w-[15ch] text-[28px] font-bold leading-[1.24] tracking-[-0.02em] text-text-primary sm:max-w-[19ch] lg:max-w-[22ch]">
          {resolvedTitle}
        </h2>
        {resolvedDescription ? (
          <p className="text-keep text-pretty text-reading-tight max-w-[34rem] text-sm leading-[1.72] text-text-secondary sm:text-[15px]">
            {resolvedDescription}
          </p>
        ) : null}
      </div>

      {href ? (
        <Link
          href={href}
          className="text-button inline-flex min-h-11 items-center self-start rounded-full border border-black/8 px-3 text-sm font-semibold text-navy transition hover:border-navy/18 hover:text-navy-light"
        >
          {resolvedLinkLabel} →
        </Link>
      ) : null}
    </div>
  );
}
