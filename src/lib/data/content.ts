import { LATEST_PAGE_SIZE } from "@/constants/site";
import type {
  BannerItem,
  CollectionItem,
  ConsultSegment,
  ContentItem,
  Cta,
  Grade,
  Topic,
} from "@/types/content";
import {
  getActiveBanners as getCatalogActiveBanners,
  getAllCollections,
  getCatalogData,
  getPublishedContents as getCatalogPublishedContents,
  getRecentTrendingContents,
} from "@/lib/data/catalog";

const DEFAULT_CONSULT_CTA: Cta = {
  id: "default-consult",
  label: "상담 전화 연결",
  url: "tel:02-555-1200",
  kind: "consult",
  consultSegment: null,
};

function mapGradeToConsultSegment(grade?: Grade): ConsultSegment | undefined {
  if (grade === "초등") {
    return "초등";
  }

  if (grade === "중등") {
    return "중1";
  }

  if (grade === "예비고1" || grade === "고등") {
    return "고등관";
  }

  return undefined;
}

export async function getCtas(): Promise<Cta[]> {
  const { ctas } = await getCatalogData();
  return ctas;
}

export async function getPrimaryConsultCta(
  preferredSegment?: ConsultSegment,
): Promise<Cta> {
  const consultCtas = (await getCtas()).filter((cta) => cta.kind === "consult");

  if (preferredSegment) {
    return (
      consultCtas.find((cta) => cta.consultSegment === preferredSegment) ??
      consultCtas[0] ??
      DEFAULT_CONSULT_CTA
    );
  }

  return consultCtas[0] ?? DEFAULT_CONSULT_CTA;
}

export async function getConsultCtaForGrade(grade?: Grade): Promise<Cta> {
  return getPrimaryConsultCta(mapGradeToConsultSegment(grade));
}

export async function getContextualCta(content?: ContentItem): Promise<Cta> {
  const ctas = await getCtas();

  if (content?.ctaId) {
    const matched = ctas.find((cta) => cta.id === content.ctaId);

    if (matched) {
      return matched;
    }
  }

  return getConsultCtaForGrade(content?.grade);
}

export async function getPublishedContents(): Promise<ContentItem[]> {
  return getCatalogPublishedContents();
}

export async function getHeroContent(): Promise<ContentItem | undefined> {
  return (await getPublishedContents()).find((content) => content.isHero);
}

export async function getTrendingContents(limit = 5): Promise<ContentItem[]> {
  const ranked = await getRecentTrendingContents(limit);

  if (ranked.length >= limit) {
    return ranked;
  }

  const published = await getPublishedContents();
  const rankedIds = new Set(ranked.map((content) => content.id));
  const featuredFallback = published
    .filter((content) => content.isFeatured && !rankedIds.has(content.id))
    .slice(0, limit - ranked.length);

  return [...ranked, ...featuredFallback];
}

export async function getLatestContents(page = 1, pageSize = LATEST_PAGE_SIZE) {
  const contents = await getPublishedContents();
  const totalPages = Math.max(1, Math.ceil(contents.length / pageSize));
  const startIndex = (page - 1) * pageSize;

  return {
    items: contents.slice(startIndex, startIndex + pageSize),
    totalPages,
    totalCount: contents.length,
  };
}

export async function getContentsByGrade(grade: Grade): Promise<ContentItem[]> {
  const contents = await getPublishedContents();
  return contents.filter((content) => content.grade === grade || content.grade === "공통");
}

export async function getContentBySlug(slug: string): Promise<ContentItem | undefined> {
  const contents = await getPublishedContents();
  return contents.find((content) => content.slug === slug);
}

export async function getRelatedContents(target: ContentItem, limit = 3): Promise<ContentItem[]> {
  const contents = await getPublishedContents();
  return contents
    .filter(
      (content) =>
        content.id !== target.id &&
        (content.topic === target.topic || content.grade === target.grade),
    )
    .slice(0, limit);
}

export async function getHomeCollections(): Promise<CollectionItem[]> {
  return (await getAllCollections()).filter(
    (collection) => collection.isVisibleHome && collection.items.length > 0,
  );
}

export async function getCollectionBySlug(slug: string): Promise<CollectionItem | undefined> {
  return (await getAllCollections()).find((collection) => collection.slug === slug);
}

export async function searchContents(
  query: string,
  filters?: { topic?: Topic; grade?: Grade },
): Promise<ContentItem[]> {
  const contents = await getPublishedContents();
  const normalizedQuery = query.trim().toLowerCase();

  return contents.filter((content) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      `${content.title} ${content.summary}`.toLowerCase().includes(normalizedQuery);
    const matchesTopic = !filters?.topic || content.topic === filters.topic;
    const matchesGrade = !filters?.grade || content.grade === filters.grade;

    return matchesQuery && matchesTopic && matchesGrade;
  });
}

export async function getActiveBanners(): Promise<BannerItem[]> {
  return getCatalogActiveBanners();
}
