"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics/tracker";
import type { AnalyticsEventPayload } from "@/types/analytics";

export function EventLogger(props: AnalyticsEventPayload) {
  const {
    bannerId,
    collectionId,
    collectionName,
    contentId,
    contentSlug,
    contentType,
    ctaId,
    ctaLabel,
    eventType,
    externalUrl,
    grade,
    pagePath,
    placement,
    topic,
  } = props;

  useEffect(() => {
    trackEvent({
      bannerId,
      collectionId,
      collectionName,
      contentId,
      contentSlug,
      contentType,
      ctaId,
      ctaLabel,
      eventType,
      externalUrl,
      grade,
      pagePath,
      placement,
      topic,
    });
  }, [
    bannerId,
    collectionId,
    collectionName,
    contentId,
    contentSlug,
    contentType,
    ctaId,
    ctaLabel,
    eventType,
    externalUrl,
    grade,
    pagePath,
    placement,
    topic,
  ]);

  return null;
}
