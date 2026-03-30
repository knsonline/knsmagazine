"use client";

import { trackEvent } from "@/lib/analytics/tracker";
import type { AnalyticsEventPayload } from "@/types/analytics";

interface TrackedExternalLinkProps {
  href: string;
  className?: string;
  event: AnalyticsEventPayload;
  children: React.ReactNode;
}

export function TrackedExternalLink({
  href,
  className,
  event,
  children,
}: TrackedExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={className}
      onClick={() => {
        trackEvent(event);
      }}
    >
      {children}
    </a>
  );
}
