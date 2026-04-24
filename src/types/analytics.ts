import type { Grade, Topic } from "@/types/content";

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

export type DestinationChannel =
  | "naver_blog"
  | "naver_cafe"
  | "youtube"
  | "google_form"
  | "phone"
  | "other";

export interface AnalyticEvent {
  eventType: AnalyticsEventType;
  contentId?: string;
  contentSlug?: string;
  ctaId?: string;
  ctaLabel?: string;
  bannerId?: string;
  collectionId?: string;
  grade?: Grade;
  topic?: Topic;
  pagePath?: string;
  referrer?: string;
  outboundUrl?: string;
  externalUrl?: string;
  placement?: string;
  pageType?: string;
  sessionId?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  landingPath?: string;
  destinationChannel?: DestinationChannel;
}

export interface ClientEventPayload {
  eventType: AnalyticsEventType;
  session_id?: string;
  content_id?: string;
  cta_id?: string;
  banner_id?: string;
  collection_id?: string;
  grade?: string;
  topic?: string;
  page_path?: string;
  referrer?: string;
  device_type?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  placement?: string;
  destination_channel?: DestinationChannel;
  landing_path?: string;
}
