import { TrackedExternalLink } from "@/components/analytics/TrackedExternalLink";
import { SITE_COPY } from "@/constants/site";
import type { Cta } from "@/types/content";

interface SoftCtaSectionProps {
  cta: Cta;
  pagePath: string;
}

export function SoftCtaSection({ cta, pagePath }: SoftCtaSectionProps) {
  return (
    <section className="bg-navy section-space text-white">
      <div className="shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold tracking-[0.03em] text-white/64">KNS 안내</p>
          <h2 className="mt-4 text-[32px] font-bold leading-[1.2] tracking-[-0.04em]">{SITE_COPY.softCtaTitle}</h2>
          <p className="mt-4 text-base leading-8 text-white/76">{SITE_COPY.softCtaDescription}</p>
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
              className="inline-flex min-h-12 items-center rounded-full bg-gold px-6 text-sm font-semibold text-navy transition hover:bg-gold-light"
            >
              {cta.label}
            </TrackedExternalLink>
          </div>
        </div>
      </div>
    </section>
  );
}
