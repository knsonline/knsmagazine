"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics/tracker";
import type { AnalyticEvent } from "@/types/analytics";

export function EventLogger({
  bannerId,
  collectionId,
  contentId,
  contentSlug,
  ctaId,
  ctaLabel,
  destinationChannel,
  eventType,
  externalUrl,
  grade,
  landingPath,
  outboundUrl,
  pagePath,
  pageType,
  placement,
  referrer,
  sessionId,
  topic,
  utmCampaign,
  utmContent,
  utmMedium,
  utmSource,
}: AnalyticEvent) {
  useEffect(() => {
    trackEvent({
      bannerId,
      collectionId,
      contentId,
      contentSlug,
      ctaId,
      ctaLabel,
      destinationChannel,
      eventType,
      externalUrl,
      grade,
      landingPath,
      outboundUrl,
      pagePath,
      pageType,
      placement,
      referrer,
      sessionId,
      topic,
      utmCampaign,
      utmContent,
      utmMedium,
      utmSource,
    });
  }, [
    bannerId,
    collectionId,
    contentId,
    contentSlug,
    ctaId,
    ctaLabel,
    destinationChannel,
    eventType,
    externalUrl,
    grade,
    landingPath,
    outboundUrl,
    pagePath,
    pageType,
    placement,
    referrer,
    sessionId,
    topic,
    utmCampaign,
    utmContent,
    utmMedium,
    utmSource,
  ]);

  return null;
}
