"use client";

import { useMemo } from "react";
import { buildOutboundTrackedUrl } from "@/lib/analytics/attribution";
import { trackEvent } from "@/lib/analytics/tracker";
import type { AnalyticEvent } from "@/types/analytics";

interface TrackedExternalLinkProps {
  href: string;
  className?: string;
  event: AnalyticEvent;
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
    () => {
      return buildOutboundTrackedUrl({
        rawUrl: href,
        eventType: event.eventType,
        pagePath: event.pagePath ?? "unknown",
        placement: event.placement,
        contentSlug: event.contentSlug,
      });
    },
    [
      event.contentSlug,
      event.eventType,
      event.pagePath,
      event.placement,
      href,
    ],
  );

  return (
    <a
      href={trackedHref}
      target="_blank"
      rel="noreferrer"
      className={className}
      onClick={() => {
        trackEvent({
          ...event,
          outboundUrl: href,
        });
        onClick?.();
      }}
    >
      {children}
    </a>
  );
}
