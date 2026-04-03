import { TrackedExternalLink } from "@/components/analytics/TrackedExternalLink";
import { SITE_COPY } from "@/constants/site";
import { protectPhraseSpacing } from "@/lib/utils/text";
import type { Cta } from "@/types/content";

interface SoftCtaSectionProps {
  cta: Cta;
  pagePath: string;
}

export function SoftCtaSection({ cta, pagePath }: SoftCtaSectionProps) {
  const title = protectPhraseSpacing(SITE_COPY.softCtaTitle);
  const description = protectPhraseSpacing(SITE_COPY.softCtaDescription);
  const ctaLabel = protectPhraseSpacing(cta.label);

  return (
    <section className="bg-navy section-space text-white">
      <div className="shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold tracking-[0.03em] text-white/64">KNS 안내</p>
          <h2 className="text-keep text-balance mx-auto mt-4 max-w-[15ch] text-[32px] font-bold leading-[1.24] tracking-[-0.04em] sm:max-w-[18ch]">
            {title}
          </h2>
          <p className="text-keep text-pretty mx-auto mt-4 max-w-[36rem] text-base leading-[1.8] text-white/76">
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
                placement: "soft_cta",
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
