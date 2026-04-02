import type { ContentType, Grade, Topic } from "@/types/content";

export type AnalyticsEventType =
  | "session_start"
  | "page_view"
  | "content_impression"
  | "content_view"
  | "content_click"
  | "cta_click"
  | "banner_click"
  | "grade_select"
  | "collection_view";

export interface AnalyticsEventPayload {
  eventType: AnalyticsEventType;
  pagePath: string;
  contentId?: string;
  ctaId?: string;
  bannerId?: string;
  collectionId?: string;
  collectionName?: string;
  grade?: Grade;
  topic?: Topic;
  contentType?: ContentType;
  externalUrl?: string;
  ctaLabel?: string;
  contentSlug?: string;
  placement?: string;
}

export interface AnalyticsEventRecord extends AnalyticsEventPayload {
  sessionId: string;
  referrer: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  deviceType: "mobile" | "desktop";
  timestamp: string;
}
