import type { ContentType, Grade, Topic } from "@/types/content";

export interface ContentRow {
  id: string;
  title: string;
  summary: string | null;
  body: string | null;
  external_url: string;
  thumbnail_url: string | null;
  grade: Grade;
  topic: Topic;
  content_type: ContentType;
  is_published: boolean;
  is_featured: boolean;
  is_hero: boolean;
  cta_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CtaRow {
  id: string;
  label: string;
  url: string;
  created_at: string;
}

export interface BannerRow {
  id: string;
  image_url: string;
  link_url: string | null;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
  created_at: string;
}

export interface CollectionRow {
  id: string;
  name: string;
  is_visible_home: boolean;
  sort_order: number;
  created_at: string;
}

export interface CollectionItemRow {
  collection_id: string;
  content_id: string;
  sort_order: number;
}

export interface EventRow {
  id: number;
  event_type: string;
  session_id: string | null;
  content_id: string | null;
  cta_id: string | null;
  banner_id: string | null;
  collection_id: string | null;
  grade: string | null;
  topic: string | null;
  page_path: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  device_type: string | null;
  created_at: string;
}
