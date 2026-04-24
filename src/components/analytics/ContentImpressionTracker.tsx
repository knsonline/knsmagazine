"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics/tracker";
import type { Grade, Topic } from "@/types/content";

interface ContentImpressionTrackerProps {
  contentId: string;
  grade: Grade;
  topic: Topic;
  className?: string;
}

const DEFAULT_CLASS_NAME = "pointer-events-none absolute inset-0";

export function ContentImpressionTracker({
  contentId,
  grade,
  topic,
  className = DEFAULT_CLASS_NAME,
}: ContentImpressionTrackerProps) {
  const pathname = usePathname();
  const targetRef = useRef<HTMLSpanElement | null>(null);
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    const target = targetRef.current;

    if (!target || hasTrackedRef.current) {
      return;
    }

    const trackImpression = () => {
      if (hasTrackedRef.current) {
        return;
      }

      hasTrackedRef.current = true;
      trackEvent({
        eventType: "content_impression",
        pagePath: pathname || "/",
        contentId,
        grade,
        topic,
      });
    };

    if (typeof window === "undefined" || typeof window.IntersectionObserver !== "function") {
      trackImpression();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          trackImpression();
          observer.disconnect();
        }
      },
      {
        threshold: 0.6,
      },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [contentId, grade, pathname, topic]);

  return <span ref={targetRef} aria-hidden="true" className={className} />;
}
