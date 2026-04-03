"use client";

import { useMemo } from "react";
import { buildOutboundTrackedUrl } from "@/lib/analytics/attribution";
import { trackEvent } from "@/lib/analytics/tracker";
import type { AnalyticsEventPayload } from "@/types/analytics";

interface TrackedExternalLinkProps {
  href: string;
  className?: string;
  event: AnalyticsEventPayload;
  children: React.ReactNode;
  onClick?: () => void;
}

export function TrackedExternalLink({
  href,
  className,
  event,
  children,
  onClick,
}: TrackedExternalLinkProps) {
  const trackedHref = useMemo(
    () =>
      buildOutboundTrackedUrl({
        rawUrl: href,
        eventType: event.eventType,
        pagePath: event.pagePath,
        placement: event.placement,
        contentSlug: event.contentSlug,
      }),
    [event.contentSlug, event.eventType, event.pagePath, event.placement, href],
  );

  return (
    <a
      href={trackedHref}
      target="_blank"
      rel="noreferrer"
      className={className}
      onClick={() => {
        trackEvent(event);
        onClick?.();
      }}
    >
      {children}
    </a>
  );
}
