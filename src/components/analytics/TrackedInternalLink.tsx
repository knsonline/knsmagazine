"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics/tracker";
import type { AnalyticsEventPayload } from "@/types/analytics";

interface TrackedInternalLinkProps {
  href: string;
  className?: string;
  event: AnalyticsEventPayload;
  children: React.ReactNode;
}

export function TrackedInternalLink({
  href,
  className,
  event,
  children,
}: TrackedInternalLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => {
        trackEvent(event);
      }}
    >
      {children}
    </Link>
  );
}
