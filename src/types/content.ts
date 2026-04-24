export type Grade = "초등" | "중등" | "예비고1" | "고등" | "공통";
export type Topic = "내신" | "수능" | "특목고" | "학습법" | "입시정보" | "기타";
export type ContentType = "글" | "영상";
export type CtaKind = "consult" | "external";
export type ConsultSegment = "초등" | "중1" | "고등관";

export interface Cta {
  id: string;
  label: string;
  url: string;
  kind: CtaKind;
  consultSegment?: ConsultSegment | null;
  createdAt?: string;
}

export interface ContentItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  externalUrl: string;
  thumbnailUrl: string;
  thumbnailUrlRaw?: string | null;
  grade: Grade;
  topic: Topic;
  contentType: ContentType;
  isPublished: boolean;
  isFeatured: boolean;
  isHero: boolean;
  ctaId?: string | null;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
}

export interface BannerItem {
  id: string;
  title: string;
  imageUrl: string;
  imageUrlRaw?: string | null;
  linkUrl: string;
  startsAt?: string | null;
  endsAt?: string | null;
  isActive: boolean;
  createdAt?: string;
}

export interface CollectionItem {
  id: string;
  slug: string;
  name: string;
  isVisibleHome: boolean;
  sortOrder: number;
  items: ContentItem[];
}
