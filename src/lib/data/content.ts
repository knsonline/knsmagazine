import seedData from "../../../seed-data.json";
import { LATEST_PAGE_SIZE } from "@/constants/site";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getPlaceholderImage } from "@/lib/utils/format";
import { getIdSlugPrefix } from "@/lib/utils/slug";
import type { ContentType, Grade, Topic, BannerItem, CollectionItem, ContentItem, Cta } from "@/types/content";
import type { BannerRow, CollectionItemRow, CollectionRow, ContentRow, CtaRow, EventRow } from "@/types/database";

interface SeedContent {
  title: string;
  summary: string;
  external_url: string;
  thumbnail_url: string;
  grade: Grade;
  topic: Topic;
  content_type: ContentType;
  is_published: boolean;
  is_featured: boolean;
  is_hero: boolean;
}

interface SeedBanner {
  image_url: string;
  link_url: string;
  starts_at?: string;
  ends_at?: string;
  is_active: boolean;
}

interface SeedCollection {
  name: string;
  is_visible_home: boolean;
  content_titles: string[];
}

interface SeedData {
  contents: SeedContent[];
  ctas: Array<{ label: string; url: string }>;
  banners: SeedBanner[];
  collections: SeedCollection[];
}

const typedSeedData = seedData as SeedData;
const seedConsultCta = typedSeedData.ctas.find((cta) => cta.label.includes("상담"));

const FALLBACK_CONSULT_CTA: Cta = {
  id: "fallback-consult-cta",
  label: seedConsultCta?.label ?? "무료 학습 상담 신청하기",
  url: seedConsultCta?.url ?? "#",
};

function mapCtaRow(row: CtaRow, usageCount?: number): Cta {
  return {
    id: row.id,
    label: row.label,
    url: row.url,
    createdAt: row.created_at,
    usageCount,
  };
}

function mapContentRow(row: ContentRow, viewCount = 0): ContentItem {
  const publishedAt = row.is_published ? row.updated_at : row.created_at;

  return {
    id: row.id,
    slug: getIdSlugPrefix(row.id),
    title: row.title,
    summary: row.summary ?? "",
    externalUrl: row.external_url,
    thumbnailUrl: getPlaceholderImage(row.thumbnail_url),
    thumbnailUrlRaw: row.thumbnail_url,
    grade: row.grade,
    topic: row.topic,
    contentType: row.content_type,
    isPublished: row.is_published,
    isFeatured: row.is_featured,
    isHero: row.is_hero,
    ctaId: row.cta_id,
    publishedAt,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    viewCount,
  };
}

function mapBannerRow(row: BannerRow): BannerItem {
  const title = row.starts_at ? `${new Date(row.starts_at).getFullYear()} 설명회 일정 확인하기` : "KNS 설명회 일정 확인하기";

  return {
    id: row.id,
    title,
    imageUrl: getPlaceholderImage(row.image_url),
    imageUrlRaw: row.image_url,
    linkUrl: row.link_url ?? "#",
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    isActive: row.is_active,
    createdAt: row.created_at,
  };
}

function mapSeedData() {
  const ctas: Cta[] = typedSeedData.ctas.map((cta, index) => ({
    id: `seed-cta-${index + 1}`,
    label: cta.label,
    url: cta.url,
  }));

  const contents: ContentItem[] = typedSeedData.contents
    .filter((content) => content.is_published)
    .map((content, index) => {
      const publishedAt = new Date("2026-03-30T09:00:00+09:00");
      publishedAt.setDate(publishedAt.getDate() - index * 3);
      const id = `seed-content-${index + 1}`;

      return {
        id,
        slug: getIdSlugPrefix(`${index + 1}`.padStart(8, "0")),
        title: content.title,
        summary: content.summary,
        externalUrl: content.external_url,
        thumbnailUrl: getPlaceholderImage(content.thumbnail_url),
        thumbnailUrlRaw: content.thumbnail_url,
        grade: content.grade,
        topic: content.topic,
        contentType: content.content_type,
        isPublished: content.is_published,
        isFeatured: content.is_featured,
        isHero: content.is_hero,
        ctaId: ctas[0]?.id ?? null,
        publishedAt: publishedAt.toISOString(),
        createdAt: publishedAt.toISOString(),
        updatedAt: publishedAt.toISOString(),
        viewCount: 1400 - index * 71 + (content.is_featured ? 250 : 0) + (content.is_hero ? 420 : 0),
      };
    });

  const contentMap = new Map(contents.map((content) => [content.title, content]));

  const banners: BannerItem[] = typedSeedData.banners.map((banner, index) => ({
    id: `seed-banner-${index + 1}`,
    title: "2025 여름 설명회 일정 확인하기",
    imageUrl: getPlaceholderImage(banner.image_url),
    imageUrlRaw: banner.image_url,
    linkUrl: banner.link_url,
    startsAt: banner.starts_at ?? null,
    endsAt: banner.ends_at ?? null,
    isActive: banner.is_active,
  }));

  const collections: CollectionItem[] = typedSeedData.collections.map((collection, index) => ({
    id: `seed-collection-${index + 1}`,
    slug: getIdSlugPrefix(`${index + 1}`.padStart(8, "0")),
    name: collection.name,
    isVisibleHome: collection.is_visible_home,
    sortOrder: index,
    items: collection.content_titles
      .map((title) => contentMap.get(title))
      .filter((content): content is ContentItem => Boolean(content)),
  }));

  return { ctas, contents, banners, collections };
}

async function getPublishedContentRows() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("contents")
    .select("*")
    .eq("is_published", true)
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as ContentRow[];
}

async function getEventRows() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("events").select("content_id,event_type,created_at");

  if (error) {
    throw error;
  }

  return (data ?? []) as Pick<EventRow, "content_id" | "event_type" | "created_at">[];
}

function applyViewCounts(rows: ContentRow[], events: Pick<EventRow, "content_id" | "event_type">[]): ContentItem[] {
  const counts = new Map<string, number>();

  events
    .filter((event) => event.event_type === "content_view" && event.content_id)
    .forEach((event) => {
      const key = event.content_id as string;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });

  return rows.map((row) => mapContentRow(row, counts.get(row.id) ?? 0));
}

async function getCollectionsFromSupabase() {
  const supabase = createSupabaseAdminClient();
  const [{ data: collectionsData, error: collectionsError }, { data: collectionItemsData, error: collectionItemsError }] =
    await Promise.all([
      supabase.from("collections").select("*").order("sort_order", { ascending: true }),
      supabase.from("collection_items").select("*").order("sort_order", { ascending: true }),
    ]);

  if (collectionsError) {
    throw collectionsError;
  }

  if (collectionItemsError) {
    throw collectionItemsError;
  }

  const contentRows = await getPublishedContentRows();
  const contentMap = new Map(contentRows.map((row) => [row.id, mapContentRow(row)]));
  const itemsByCollection = new Map<string, CollectionItemRow[]>();

  (collectionItemsData as CollectionItemRow[]).forEach((item) => {
    const items = itemsByCollection.get(item.collection_id) ?? [];
    items.push(item);
    itemsByCollection.set(item.collection_id, items);
  });

  return (collectionsData as CollectionRow[]).map((collection) => ({
    id: collection.id,
    slug: getIdSlugPrefix(collection.id),
    name: collection.name,
    isVisibleHome: collection.is_visible_home,
    sortOrder: collection.sort_order,
    items: (itemsByCollection.get(collection.id) ?? [])
      .sort((left, right) => left.sort_order - right.sort_order)
      .map((item) => contentMap.get(item.content_id))
      .filter((content): content is ContentItem => Boolean(content)),
  }));
}

async function getAllCollections() {
  if (!hasSupabaseEnv()) {
    return mapSeedData().collections;
  }

  return getCollectionsFromSupabase();
}

export async function getPublishedContents(): Promise<ContentItem[]> {
  if (!hasSupabaseEnv()) {
    return mapSeedData().contents.sort(
      (left, right) => new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime(),
    );
  }

  const [rows, events] = await Promise.all([getPublishedContentRows(), getEventRows()]);
  return applyViewCounts(rows, events);
}

export async function getHeroContent(): Promise<ContentItem | undefined> {
  const contents = await getPublishedContents();
  return contents.find((content) => content.isHero);
}

export async function getTrendingContents(limit = 5): Promise<ContentItem[]> {
  const contents = await getPublishedContents();
  const ranked = [...contents]
    .filter((content) => content.viewCount > 0)
    .sort((left, right) => right.viewCount - left.viewCount);

  if (ranked.length >= limit) {
    return ranked.slice(0, limit);
  }

  return contents.filter((content) => content.isFeatured).slice(0, limit);
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
        content.id !== target.id && (content.topic === target.topic || content.grade === target.grade),
    )
    .slice(0, limit);
}

export async function getHomeCollections(): Promise<CollectionItem[]> {
  const collections = await getAllCollections();
  return collections.filter((collection) => collection.isVisibleHome && collection.items.length > 0);
}

export async function getCollectionBySlug(slug: string): Promise<CollectionItem | undefined> {
  const collections = await getAllCollections();
  return collections.find((collection) => collection.slug === slug);
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
  if (!hasSupabaseEnv()) {
    return mapSeedData().banners.filter((banner) => banner.isActive);
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return ((data ?? []) as BannerRow[]).map(mapBannerRow);
}

export async function getCtas(): Promise<Cta[]> {
  if (!hasSupabaseEnv()) {
    return mapSeedData().ctas;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("ctas").select("*").order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return ((data ?? []) as CtaRow[]).map((row) => mapCtaRow(row));
}

export async function getPrimaryConsultCta(): Promise<Cta> {
  const ctas = await getCtas();
  return ctas.find((cta) => cta.label.includes("상담")) ?? ctas[0] ?? FALLBACK_CONSULT_CTA;
}

export async function getSeminarCta(): Promise<Cta | undefined> {
  const ctas = await getCtas();
  return ctas.find((cta) => cta.label.includes("설명회"));
}

export async function getContextualCta(content?: ContentItem): Promise<Cta> {
  if (!content) {
    return getPrimaryConsultCta();
  }

  if (content.topic === "특목고" || content.topic === "입시정보") {
    return (await getSeminarCta()) ?? getPrimaryConsultCta();
  }

  return getPrimaryConsultCta();
}
