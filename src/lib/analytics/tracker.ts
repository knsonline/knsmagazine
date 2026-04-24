"use client";

import {
  ANALYTICS_OPTOUT_COOKIE,
  ANALYTICS_OPTOUT_MAX_AGE,
  ATTRIBUTION_FIRST_COOKIE,
  ATTRIBUTION_LAST_COOKIE,
  ATTRIBUTION_MAX_AGE,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  SESSION_STARTED_COOKIE,
} from "@/lib/analytics/constants";
import {
  classifyReferrer,
  detectDestinationChannel,
  type AnalyticsAttributionSnapshot,
} from "@/lib/analytics/attribution";
import type { AnalyticEvent, ClientEventPayload } from "@/types/analytics";

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") {
    return undefined;
  }

  const match = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${name}=`));

  return match ? decodeURIComponent(match.split("=")[1] ?? "") : undefined;
}

function writeCookie(name: string, value: string, maxAge = SESSION_MAX_AGE): void {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; samesite=lax`;
}

function removeCookie(name: string): void {
  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
}

function readAttributionCookie(name: string): AnalyticsAttributionSnapshot | undefined {
  const rawValue = readCookie(name);

  if (!rawValue) {
    return undefined;
  }

  try {
    return JSON.parse(rawValue) as AnalyticsAttributionSnapshot;
  } catch {
    return undefined;
  }
}

function writeAttributionCookie(name: string, value: AnalyticsAttributionSnapshot): void {
  writeCookie(name, JSON.stringify(value), ATTRIBUTION_MAX_AGE);
}

function getCurrentPagePath(): string {
  return `${window.location.pathname}${window.location.search}`;
}

function getDeviceType(): "mobile" | "desktop" {
  return window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop";
}

export function getAnalyticsBrowserPreference(): boolean | undefined {
  const value = readCookie(ANALYTICS_OPTOUT_COOKIE);

  if (value === undefined) {
    return undefined;
  }

  return value === "1";
}

function isAnalyticsDisabled(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  if (window.location.pathname.startsWith("/admin")) {
    return true;
  }

  return getAnalyticsBrowserPreference() === true;
}

function getOrCreateSessionId(): string {
  const existing = readCookie(SESSION_COOKIE);

  if (existing) {
    writeCookie(SESSION_COOKIE, existing);
    return existing;
  }

  const created = crypto.randomUUID();
  writeCookie(SESSION_COOKIE, created);
  return created;
}

function shouldTrackSessionStart(sessionId: string): boolean {
  const startedFor = readCookie(SESSION_STARTED_COOKIE);
  return startedFor !== sessionId;
}

function markSessionStarted(sessionId: string): void {
  writeCookie(SESSION_STARTED_COOKIE, sessionId);
}

function resolveAttribution(): {
  current: AnalyticsAttributionSnapshot;
  first: AnalyticsAttributionSnapshot;
} {
  const searchParams = new URLSearchParams(window.location.search);
  const lastTouch = readAttributionCookie(ATTRIBUTION_LAST_COOKIE);
  const firstTouch = readAttributionCookie(ATTRIBUTION_FIRST_COOKIE);
  const referrer = document.referrer;
  const pagePath = getCurrentPagePath();
  const referrerClassification = classifyReferrer(referrer, window.location.origin);
  const hasExplicitUtm =
    searchParams.has("utm_source") ||
    searchParams.has("utm_medium") ||
    searchParams.has("utm_campaign") ||
    searchParams.has("utm_content");

  const baseAttribution =
    referrerClassification === "internal"
      ? lastTouch
      : {
          source: referrerClassification.source,
          medium: referrerClassification.medium,
          campaign: undefined,
          content: undefined,
        };

  const resolvedAttribution: AnalyticsAttributionSnapshot = {
    source: searchParams.get("utm_source") ?? baseAttribution?.source ?? "direct",
    medium: searchParams.get("utm_medium") ?? baseAttribution?.medium ?? "none",
    campaign: searchParams.get("utm_campaign") ?? baseAttribution?.campaign ?? undefined,
    content: searchParams.get("utm_content") ?? baseAttribution?.content ?? undefined,
    referrer: referrer || undefined,
    landingPath: pagePath,
    capturedAt: new Date().toISOString(),
  };

  const shouldUpdateLastTouch =
    hasExplicitUtm || referrerClassification !== "internal" || !lastTouch;

  if (shouldUpdateLastTouch) {
    writeAttributionCookie(ATTRIBUTION_LAST_COOKIE, resolvedAttribution);
  }

  const firstAttribution = firstTouch ?? resolvedAttribution;

  if (!firstTouch) {
    writeAttributionCookie(ATTRIBUTION_FIRST_COOKIE, firstAttribution);
  }

  return {
    current: shouldUpdateLastTouch ? resolvedAttribution : lastTouch ?? resolvedAttribution,
    first: firstAttribution,
  };
}

function buildEventRecord(payload: AnalyticEvent, sessionId: string): ClientEventPayload {
  const attribution = resolveAttribution();
  const pagePath = payload.pagePath ?? getCurrentPagePath();
  const outboundUrl = payload.outboundUrl ?? payload.externalUrl;
  const destinationChannel =
    payload.destinationChannel ?? detectDestinationChannel(outboundUrl);

  return {
    eventType: payload.eventType,
    session_id: sessionId,
    content_id: payload.contentId,
    cta_id: payload.ctaId,
    banner_id: payload.bannerId,
    collection_id: payload.collectionId,
    grade: payload.grade,
    topic: payload.topic,
    page_path: pagePath,
    referrer: attribution.current.referrer ?? document.referrer,
    device_type: getDeviceType(),
    utm_source: payload.utmSource ?? attribution.current.source,
    utm_medium: payload.utmMedium ?? attribution.current.medium,
    utm_campaign: payload.utmCampaign ?? attribution.current.campaign,
    utm_content: payload.utmContent ?? attribution.current.content,
    placement: payload.placement,
    destination_channel: destinationChannel,
    landing_path: payload.landingPath ?? attribution.first.landingPath ?? pagePath,
  };
}

function sendWithFetch(record: ClientEventPayload) {
  void fetch("/api/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(record),
    keepalive: true,
  });
}

function dispatchRecord(record: ClientEventPayload): void {
  if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    const blob = new Blob([JSON.stringify(record)], { type: "application/json" });
    const success = navigator.sendBeacon("/api/events", blob);

    if (!success) {
      sendWithFetch(record);
    }

    return;
  }

  sendWithFetch(record);
}

export function disableAnalyticsForThisBrowser(): void {
  writeCookie(ANALYTICS_OPTOUT_COOKIE, "1", ANALYTICS_OPTOUT_MAX_AGE);
}

export function enableAnalyticsForThisBrowser(): void {
  removeCookie(ANALYTICS_OPTOUT_COOKIE);
}

export function trackEvent(payload: AnalyticEvent): void {
  if (isAnalyticsDisabled()) {
    return;
  }

  const sessionId = getOrCreateSessionId();

  if (payload.eventType !== "session_start" && shouldTrackSessionStart(sessionId)) {
    const sessionStartRecord = buildEventRecord(
      {
        eventType: "session_start",
        pagePath: getCurrentPagePath(),
      },
      sessionId,
    );
    dispatchRecord(sessionStartRecord);
    markSessionStarted(sessionId);
  }

  const record = buildEventRecord(payload, sessionId);
  dispatchRecord(record);
}
