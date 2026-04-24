import { cache } from "react";
import seedData from "../../../seed-data.json";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { isMissingSupabaseSchemaError } from "@/lib/supabase/errors";
import { getPlaceholderImage } from "@/lib/utils/format";
import { getIdSlugPrefix } from "@/lib/utils/slug";
import { normalizeMultilineText } from "@/lib/utils/text";
import type {
  BannerItem,
  CollectionItem,
  ConsultSegment,
  ContentItem,
  ContentType,
  Cta,
  CtaKind,
  Grade,
  Topic,
} from "@/types/content";
import type {
  BannerRow,
  CollectionItemRow,
  CollectionRow,
  ContentRow,
  CtaRow,
  EventRow,
} from "@/types/database";

interface SeedContent {
  title: string;
  summary: string;
  body?: string;
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
  title?: string;
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
  ctas: Array<{
    label: string;
    url: string;
    kind?: CtaKind;
    consult_segment?: ConsultSegment;
  }>;
  banners: SeedBanner[];
  collections: SeedCollection[];
}

export interface CatalogData {
  ctas: Cta[];
  contents: ContentItem[];
  banners: BannerItem[];
  collections: CollectionItem[];
}

export type ContentEventSnapshot = Pick<
  EventRow,
  | "id"
  | "event_type"
  | "session_id"
  | "content_id"
  | "cta_id"
  | "banner_id"
  | "collection_id"
  | "grade"
  | "topic"
  | "page_path"
  | "referrer"
  | "utm_source"
  | "utm_medium"
  | "utm_campaign"
  | "utm_content"
  | "device_type"
  | "placement"
  | "destination_channel"
  | "landing_path"
  | "created_at"
>;

const typedSeedData = seedData as SeedData;

function inferCtaKind(url: string, explicitKind?: CtaKind): CtaKind {
  if (explicitKind) {
    return explicitKind;
  }

  return url.startsWith("tel:") ? "consult" : "external";
}

function mapSeedGradeToConsultSegment(grade: Grade): ConsultSegment | undefined {
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

function getSeedCtas(): Cta[] {
  return typedSeedData.ctas.map((cta, index) => ({
    id: `seed-cta-${index + 1}`,
    label: cta.label,
    url: cta.url,
    kind: inferCtaKind(cta.url, cta.kind),
    consultSegment: cta.consult_segment ?? null,
    createdAt: "2026-03-30T09:00:00+09:00",
  }));
}

function getSeedConsultCta(
  ctas: Cta[],
  segment?: ConsultSegment,
): Cta | undefined {
  const consultCtas = ctas.filter((cta) => cta.kind === "consult");

  if (segment) {
    return consultCtas.find((cta) => cta.consultSegment === segment) ?? consultCtas[0];
  }

  return consultCtas[0];
}

function getSeedExternalCta(ctas: Cta[], labelKeyword: string): Cta | undefined {
  return ctas.find(
    (cta) => cta.kind === "external" && cta.label.includes(labelKeyword),
  );
}

function buildSeedCatalog(): CatalogData {
  const ctas = getSeedCtas();
  const seminarCta = getSeedExternalCta(ctas, "설명회");
  const diagnosisCta = getSeedExternalCta(ctas, "진단");
  const contentRows = typedSeedData.contents.filter((content) => content.is_published);

  const contents: ContentItem[] = contentRows.map((content, index) => {
    const publishedAt = new Date("2026-03-30T09:00:00+09:00");
    publishedAt.setDate(publishedAt.getDate() - index * 3);
    const id = `seed-content-${index + 1}`;
    const defaultConsultCta = getSeedConsultCta(ctas, mapSeedGradeToConsultSegment(content.grade));
    const selectedCta =
      content.topic === "입시정보" || content.topic === "특목고"
        ? seminarCta ?? defaultConsultCta
        : content.topic === "기타"
          ? diagnosisCta ?? defaultConsultCta
          : defaultConsultCta;

    return {
      id,
      slug: getIdSlugPrefix(`${index + 1}`.padStart(8, "0")),
      title: content.title,
      summary: normalizeMultilineText(content.summary),
      body: normalizeMultilineText(content.body),
      externalUrl: content.external_url,
      thumbnailUrl: getPlaceholderImage(content.thumbnail_url),
      thumbnailUrlRaw: content.thumbnail_url,
      grade: content.grade,
      topic: content.topic,
      contentType: content.content_type,
      isPublished: content.is_published,
      isFeatured: content.is_featured,
      isHero: content.is_hero,
      ctaId: selectedCta?.id ?? null,
      publishedAt: publishedAt.toISOString(),
      createdAt: publishedAt.toISOString(),
      updatedAt: publishedAt.toISOString(),
      viewCount:
        1400 -
        index * 71 +
        (content.is_featured ? 250 : 0) +
        (content.is_hero ? 420 : 0),
    };
  });

  const contentMap = new Map(contents.map((content) => [content.title, content]));

  const banners: BannerItem[] = typedSeedData.banners.map((banner, index) => ({
    id: `seed-banner-${index + 1}`,
    title: banner.title?.trim() || "주요 안내",
    imageUrl: getPlaceholderImage(banner.image_url),
    imageUrlRaw: banner.image_url,
    linkUrl: banner.link_url,
    startsAt: banner.starts_at ?? null,
    endsAt: banner.ends_at ?? null,
    isActive: banner.is_active,
    createdAt: "2026-03-30T09:00:00+09:00",
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

  return {
    ctas,
    contents,
    banners,
    collections,
  };
}

function mapCtaRow(row: CtaRow): Cta {
  return {
    id: row.id,
    label: row.label,
    url: row.url,
    kind: inferCtaKind(row.url, row.kind ?? undefined),
    consultSegment: row.consult_segment ?? null,
    createdAt: row.created_at,
  };
}

const getLegacyCtaRowsCached = cache(async () => {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("ctas")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    if (isMissingSupabaseSchemaError(error, "ctas")) {
      return [] as CtaRow[];
    }

    throw error;
  }

  return (data ?? []) as CtaRow[];
});

export async function getLegacyCtaRows() {
  return getLegacyCtaRowsCached();
}

const getContentEventSnapshotsCached = cache(async (): Promise<ContentEventSnapshot[]> => {
  if (!hasSupabaseEnv()) {
    return [];
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("events").select("*");

  if (error) {
    if (isMissingSupabaseSchemaError(error, "events")) {
      return [];
    }

    throw error;
  }

  return (data ?? []) as ContentEventSnapshot[];
});

export async function getContentEventSnapshots(): Promise<ContentEventSnapshot[]> {
  return getContentEventSnapshotsCached();
}

function buildContentViewCountMap(
  events: ContentEventSnapshot[],
  fromDate?: Date,
): Map<string, number> {
  const counts = new Map<string, number>();

  events
    .filter(
      (event) =>
        event.event_type === "content_view" &&
        event.content_id &&
        (!fromDate || new Date(event.created_at).getTime() >= fromDate.getTime()),
    )
    .forEach((event) => {
      const contentId = event.content_id as string;
      counts.set(contentId, (counts.get(contentId) ?? 0) + 1);
    });

  return counts;
}

function mapContentRow(row: ContentRow, viewCount = 0): ContentItem {
  return {
    id: row.id,
    slug: getIdSlugPrefix(row.id),
    title: row.title,
    summary: normalizeMultilineText(row.summary),
    body: normalizeMultilineText(row.body),
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
    publishedAt: row.is_published ? row.updated_at : row.created_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    viewCount,
  };
}

function mapBannerRow(row: BannerRow): BannerItem {
  const fallbackTitle = row.starts_at
    ? `${new Date(row.starts_at).getFullYear()} 주요 안내`
    : "주요 안내";

  return {
    id: row.id,
    title: row.title?.trim() || fallbackTitle,
    imageUrl: getPlaceholderImage(row.image_url),
    imageUrlRaw: row.image_url,
    linkUrl: row.link_url ?? "#",
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    isActive: row.is_active,
    createdAt: row.created_at,
  };
}

const getContentRowsCached = cache(async (publishedOnly: boolean) => {
  const supabase = createSupabaseAdminClient();
  let query = supabase
    .from("contents")
    .select("*")
    .order("updated_at", { ascending: false });

  if (publishedOnly) {
    query = query.eq("is_published", true);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []) as ContentRow[];
});

async function getContentRows(publishedOnly = true) {
  return getContentRowsCached(publishedOnly);
}

const getBannerRowsCached = cache(async (activeOnly: boolean) => {
  const supabase = createSupabaseAdminClient();
  let query = supabase
    .from("banners")
    .select("*")
    .order("created_at", { ascending: false });

  if (activeOnly) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []) as BannerRow[];
});

async function getBannerRows(activeOnly = false) {
  return getBannerRowsCached(activeOnly);
}

const getCollectionRowsCached = cache(async () => {
  const supabase = createSupabaseAdminClient();
  const [{ data: collectionsData, error: collectionsError }, { data: collectionItemsData, error: itemsError }] =
    await Promise.all([
      supabase
        .from("collections")
        .select("*")
        .order("sort_order", { ascending: true }),
      supabase
        .from("collection_items")
        .select("*")
        .order("sort_order", { ascending: true }),
    ]);

  if (collectionsError) {
    throw collectionsError;
  }

  if (itemsError) {
    throw itemsError;
  }

  return {
    collections: (collectionsData ?? []) as CollectionRow[],
    collectionItems: (collectionItemsData ?? []) as CollectionItemRow[],
  };
});

async function getCollectionRows() {
  return getCollectionRowsCached();
}

const getCatalogDataCached = cache(async (): Promise<CatalogData> => {
  if (!hasSupabaseEnv()) {
    return buildSeedCatalog();
  }

  const [legacyCtaRows, contentRows, bannerRows, collectionRows, events] = await Promise.all([
    getLegacyCtaRows(),
    getContentRows(true),
    getBannerRows(false),
    getCollectionRows(),
    getContentEventSnapshots(),
  ]);

  const viewCounts = buildContentViewCountMap(events);
  const contents = contentRows.map((row) => mapContentRow(row, viewCounts.get(row.id) ?? 0));
  const contentMap = new Map(contents.map((content) => [content.id, content]));

  const groupedCollectionItems = new Map<string, CollectionItemRow[]>();
  collectionRows.collectionItems.forEach((item) => {
    const rows = groupedCollectionItems.get(item.collection_id) ?? [];
    rows.push(item);
    groupedCollectionItems.set(item.collection_id, rows);
  });

  const collections: CollectionItem[] = collectionRows.collections.map((collection) => ({
    id: collection.id,
    slug: getIdSlugPrefix(collection.id),
    name: collection.name,
    isVisibleHome: collection.is_visible_home,
    sortOrder: collection.sort_order,
    items: (groupedCollectionItems.get(collection.id) ?? [])
      .sort((left, right) => left.sort_order - right.sort_order)
      .map((item) => contentMap.get(item.content_id))
      .filter((content): content is ContentItem => Boolean(content)),
  }));

  return {
    ctas: legacyCtaRows.map(mapCtaRow),
    contents,
    banners: bannerRows.map(mapBannerRow),
    collections,
  };
});

export async function getCatalogData(): Promise<CatalogData> {
  return getCatalogDataCached();
}

const getMappedContentsCached = cache(async (publishedOnly: boolean) => {
  if (!hasSupabaseEnv()) {
    return buildSeedCatalog().contents;
  }

  const [contentRows, events] = await Promise.all([
    getContentRows(publishedOnly),
    getContentEventSnapshots(),
  ]);
  const viewCounts = buildContentViewCountMap(events);

  return contentRows.map((row) => mapContentRow(row, viewCounts.get(row.id) ?? 0));
});

async function getMappedContents(publishedOnly: boolean) {
  return getMappedContentsCached(publishedOnly);
}

export async function getPublishedContents() {
  return [...(await getMappedContents(true))].sort(
    (left, right) =>
      new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime(),
  );
}

export async function getAllContents() {
  return getMappedContents(false);
}

export async function getActiveBanners() {
  return (await getCatalogData()).banners.filter((banner) => banner.isActive);
}

export async function getAllBanners() {
  if (!hasSupabaseEnv()) {
    return buildSeedCatalog().banners;
  }

  const bannerRows = await getBannerRows(false);
  return bannerRows.map(mapBannerRow);
}

export async function getAllCollections() {
  return (await getCatalogData()).collections;
}

export async function getRecentTrendingContents(limit = 5) {
  if (!hasSupabaseEnv()) {
    const contents = await getPublishedContents();
    return [...contents].sort((left, right) => right.viewCount - left.viewCount).slice(0, limit);
  }

  const [contents, events] = await Promise.all([
    getPublishedContents(),
    getContentEventSnapshots(),
  ]);
  const recentViewCounts = buildContentViewCountMap(events, new Date(Date.now() - 6 * 86400000));

  return [...contents]
    .sort(
      (left, right) =>
        (recentViewCounts.get(right.id) ?? 0) - (recentViewCounts.get(left.id) ?? 0) ||
        right.viewCount - left.viewCount,
    )
    .slice(0, limit);
}
