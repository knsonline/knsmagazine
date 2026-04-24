export interface ContentRow {
  id: string;
  title: string;
  summary: string;
  body: string;
  external_url: string;
  thumbnail_url: string;
  grade: "초등" | "중등" | "예비고1" | "고등" | "공통";
  topic: "내신" | "수능" | "특목고" | "학습법" | "입시정보" | "기타";
  content_type: "글" | "영상";
  is_published: boolean;
  is_featured: boolean;
  is_hero: boolean;
  cta_id: string | null;
  created_at: string;
  updated_at: string;
  primary_conversion_target_id?: string | null;
  track_id?: string | null;
}

export interface CtaRow {
  id: string;
  label: string;
  url: string;
  kind?: "consult" | "external" | null;
  consult_segment?: "초등" | "중1" | "고등관" | null;
  created_at: string;
}

export interface BannerRow {
  id: string;
  title?: string | null;
  image_url: string;
  link_url: string;
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
  placement?: string | null;
  destination_channel?: string | null;
  landing_path?: string | null;
  created_at: string;
}
