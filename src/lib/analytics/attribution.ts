import type { AnalyticsEventType } from "@/types/analytics";

export interface AnalyticsAttributionSnapshot {
  source: string;
  medium: string;
  campaign?: string;
  content?: string;
  referrer?: string;
  landingPath?: string;
  capturedAt: string;
}

function normalizeToken(value: string): string {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "")
    .replace(/[^a-z0-9_-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");

  return normalized || "home";
}

export function sanitizeTrackingToken(value: string): string {
  return normalizeToken(value);
}

export function sanitizeTrackingPath(pagePath: string): string {
  try {
    const parsed = new URL(pagePath, "https://kns.local");
    const joinedPath = parsed.pathname.split("/").filter(Boolean).map(normalizeToken).join("_");
    return joinedPath || "home";
  } catch {
    return normalizeToken(pagePath);
  }
}

export function classifyReferrer(
  referrer: string,
  currentOrigin?: string,
): { source: string; medium: string } | "internal" {
  if (!referrer) {
    return { source: "direct", medium: "none" };
  }

  try {
    const parsed = new URL(referrer);

    if (currentOrigin && parsed.origin === currentOrigin) {
      return "internal";
    }

    const host = parsed.hostname.toLowerCase();

    if (host.includes("google.")) {
      return { source: "google", medium: "organic" };
    }

    if (host.includes("naver.com")) {
      return { source: "naver", medium: "organic" };
    }

    if (host.includes("youtube.com") || host.includes("youtu.be")) {
      return { source: "youtube", medium: "referral" };
    }

    return { source: "other_referral", medium: "referral" };
  } catch {
    return { source: "other_referral", medium: "referral" };
  }
}

function getOutboundMedium(eventType: AnalyticsEventType): "content" | "cta" | "banner" | undefined {
  switch (eventType) {
    case "content_click":
      return "content";
    case "cta_click":
      return "cta";
    case "banner_click":
      return "banner";
    default:
      return undefined;
  }
}

interface BuildOutboundTrackedUrlOptions {
  rawUrl: string;
  eventType: AnalyticsEventType;
  pagePath: string;
  placement?: string;
  contentSlug?: string;
}

export function buildOutboundTrackedUrl({
  rawUrl,
  eventType,
  pagePath,
  placement,
  contentSlug,
}: BuildOutboundTrackedUrlOptions): string {
  if (!rawUrl || rawUrl === "#") {
    return rawUrl;
  }

  const medium = getOutboundMedium(eventType);

  if (!medium) {
    return rawUrl;
  }

  let parsed: URL;

  try {
    parsed = new URL(rawUrl);
  } catch {
    return rawUrl;
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return rawUrl;
  }

  const campaignBase = sanitizeTrackingPath(pagePath);
  const placementToken = placement ? sanitizeTrackingToken(placement) : undefined;
  const contentToken = contentSlug ? sanitizeTrackingToken(contentSlug) : undefined;
  const campaign = [campaignBase, placementToken].filter(Boolean).join("__");
  const content = contentToken ?? placementToken;

  if (!parsed.searchParams.has("utm_source")) {
    parsed.searchParams.set("utm_source", "kns_magazine");
  }

  if (!parsed.searchParams.has("utm_medium")) {
    parsed.searchParams.set("utm_medium", medium);
  }

  if (campaign && !parsed.searchParams.has("utm_campaign")) {
    parsed.searchParams.set("utm_campaign", campaign);
  }

  if (content && !parsed.searchParams.has("utm_content")) {
    parsed.searchParams.set("utm_content", content);
  }

  return parsed.toString();
}
