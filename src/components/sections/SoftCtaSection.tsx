import { TrackedExternalLink } from "@/components/analytics/TrackedExternalLink";
import { SITE_COPY } from "@/constants/site";
import { protectPhraseSpacing } from "@/lib/utils/text";
import type { Cta } from "@/types/content";

interface SoftCtaSectionProps {
  cta: Cta;
  pagePath: string;
  placement?: string;
}

export function SoftCtaSection({ cta, pagePath, placement = "soft_cta" }: SoftCtaSectionProps) {
  const title = protectPhraseSpacing(SITE_COPY.softCtaTitle);
  const description = protectPhraseSpacing(SITE_COPY.softCtaDescription);
  const ctaLabel = protectPhraseSpacing(cta.kind === "consult" ? "상담 연결" : cta.label);

  return (
    <section className="section-space bg-[linear-gradient(180deg,#f5f0eb_0%,#faf8f5_100%)]">
      <div className="shell">
        <div className="mx-auto max-w-3xl rounded-[32px] border border-black/6 bg-white px-6 py-8 text-center shadow-[0_22px_52px_-36px_rgba(27,42,74,0.22)] sm:px-8 sm:py-10">
          <p className="text-sm font-semibold tracking-[0.03em] text-text-secondary">다음 행동 제안</p>
          <h2 className="text-keep text-balance mx-auto mt-4 max-w-[17ch] text-[30px] font-bold leading-[1.26] tracking-[-0.025em] text-text-primary sm:max-w-[20ch]">
            {title}
          </h2>
          <p className="text-keep text-pretty mx-auto mt-4 max-w-[35rem] text-base leading-[1.8] text-text-secondary">
            {description}
          </p>
          <div className="mt-8">
            <TrackedExternalLink
              href={cta.url}
              event={{
                eventType: "cta_click",
                pagePath,
                ctaId: cta.id,
                ctaLabel: cta.label,
                placement,
              }}
              className="text-keep inline-flex min-h-12 max-w-full items-center justify-center rounded-full bg-gold px-6 text-center text-sm font-semibold leading-[1.35] text-navy transition hover:bg-gold-light sm:whitespace-nowrap"
            >
              {ctaLabel}
            </TrackedExternalLink>
          </div>
        </div>
      </div>
    </section>
  );
}
