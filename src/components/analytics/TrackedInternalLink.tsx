"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics/tracker";
import type { AnalyticsEventPayload } from "@/types/analytics";

interface TrackedInternalLinkProps {
  href: string;
  className?: string;
  event: AnalyticsEventPayload;
  children: React.ReactNode;
  onClick?: () => void;
}

export function TrackedInternalLink({
  href,
  className,
  event,
  children,
  onClick,
}: TrackedInternalLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => {
        trackEvent(event);
        onClick?.();
      }}
    >
      {children}
    </Link>
  );
}
