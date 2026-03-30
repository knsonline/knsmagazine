"use client";

import type { AnalyticsEventPayload, AnalyticsEventRecord } from "@/types/analytics";

const SESSION_COOKIE = "kns_session_id";
const UTM_SOURCE_COOKIE = "kns_utm_source";
const UTM_MEDIUM_COOKIE = "kns_utm_medium";
const UTM_CAMPAIGN_COOKIE = "kns_utm_campaign";
const SESSION_MAX_AGE = 60 * 30;

function readCookie(name: string): string | undefined {
  const match = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${name}=`));

  return match ? decodeURIComponent(match.split("=")[1] ?? "") : undefined;
}

function writeCookie(name: string, value: string, maxAge = SESSION_MAX_AGE): void {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; samesite=lax`;
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

function persistCurrentUtmValues(): void {
  const searchParams = new URLSearchParams(window.location.search);
  const mappings = [
    ["utm_source", UTM_SOURCE_COOKIE],
    ["utm_medium", UTM_MEDIUM_COOKIE],
    ["utm_campaign", UTM_CAMPAIGN_COOKIE],
  ] as const;

  mappings.forEach(([param, cookieName]) => {
    const value = searchParams.get(param);

    if (value) {
      writeCookie(cookieName, value);
    }
  });
}

function getDeviceType(): "mobile" | "desktop" {
  return window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop";
}

function buildEventRecord(payload: AnalyticsEventPayload): AnalyticsEventRecord {
  persistCurrentUtmValues();

  return {
    ...payload,
    sessionId: getOrCreateSessionId(),
    referrer: document.referrer,
    utmSource: readCookie(UTM_SOURCE_COOKIE),
    utmMedium: readCookie(UTM_MEDIUM_COOKIE),
    utmCampaign: readCookie(UTM_CAMPAIGN_COOKIE),
    deviceType: getDeviceType(),
    timestamp: new Date().toISOString(),
  };
}

function sendWithFetch(record: AnalyticsEventRecord) {
  void fetch("/api/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(record),
    keepalive: true,
  });
}

export function trackEvent(payload: AnalyticsEventPayload): void {
  const record = buildEventRecord(payload);

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
