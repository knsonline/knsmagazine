import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getActiveBanners, getCtas, getHomeCollections, getPublishedContents } from "@/lib/data/content";
import { getPlaceholderImage, startOfDay, startOfDaysAgo } from "@/lib/utils/format";
import { getIdSlugPrefix } from "@/lib/utils/slug";
import type { BannerItem, CollectionItem, ContentItem, Cta, Grade } from "@/types/content";
import type { BannerRow, CollectionItemRow, CollectionRow, ContentRow, CtaRow, EventRow } from "@/types/database";

export interface AdminDashboardData {
  totalPublishedContents: number;
  todayViews: number;
  weeklyCtaClicks: number;
  popularContents: Array<ContentItem & { score: number }>;
  recentContents: ContentItem[];
  alerts: string[];
  dailyViews: Array<{ date: string; value: number }>;
  gradeInterest: Array<{ label: string; value: number }>;
  ctaRanking: Array<{ cta: Cta; clicks: number }>;
  utmRanking: Array<{ label: string; visits: number }>;
}

function mapContentRow(row: ContentRow): ContentItem {
  return {
    id: row.id,
    slug: getIdSlugPrefix(row.id),
    title: row.title,
    summary: row.summary ?? "",
    externalUrl: row.external_url,
    thumbnailUrl: getPlaceholderImage(row.thumbnail_url),
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
    viewCount: 0,
  };
}

function mapBannerRow(row: BannerRow): BannerItem {
  return {
    id: row.id,
    title: row.starts_at ? `${new Date(row.starts_at).getFullYear()} 설명회 일정 확인하기` : "KNS 설명회 일정 확인하기",
    imageUrl: getPlaceholderImage(row.image_url),
    linkUrl: row.link_url ?? "#",
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    isActive: row.is_active,
    createdAt: row.created_at,
  };
}

function mapCtaRow(row: CtaRow, usageCount = 0): Cta {
  return {
    id: row.id,
    label: row.label,
    url: row.url,
    createdAt: row.created_at,
    usageCount,
  };
}

async function getAllContentsFromSupabase() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("contents").select("*").order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  return ((data ?? []) as ContentRow[]).map(mapContentRow);
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

  const contents = await getAllContentsFromSupabase();
  const contentMap = new Map(contents.map((content) => [content.id, content]));
  const groupedItems = new Map<string, CollectionItemRow[]>();

  ((collectionItemsData ?? []) as CollectionItemRow[]).forEach((item) => {
    const rows = groupedItems.get(item.collection_id) ?? [];
    rows.push(item);
    groupedItems.set(item.collection_id, rows);
  });

  return ((collectionsData ?? []) as CollectionRow[]).map((row) => ({
    id: row.id,
    slug: getIdSlugPrefix(row.id),
    name: row.name,
    isVisibleHome: row.is_visible_home,
    sortOrder: row.sort_order,
    items: (groupedItems.get(row.id) ?? [])
      .sort((left, right) => left.sort_order - right.sort_order)
      .map((item) => contentMap.get(item.content_id))
      .filter((content): content is ContentItem => Boolean(content)),
  }));
}

async function getBannersFromSupabase() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("banners").select("*").order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return ((data ?? []) as BannerRow[]).map(mapBannerRow);
}

async function getCtasFromSupabase() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("ctas").select("*").order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return ((data ?? []) as CtaRow[]).map((row) => mapCtaRow(row));
}

async function getEventsFromSupabase() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5000);

  if (error) {
    throw error;
  }

  return (data ?? []) as EventRow[];
}

export async function getAdminContents(filters?: {
  query?: string;
  grade?: string;
  status?: string;
}): Promise<ContentItem[]> {
  const contents = hasSupabaseEnv() ? await getAllContentsFromSupabase() : await getPublishedContents();

  return contents.filter((content) => {
    const matchesQuery =
      !filters?.query || `${content.title} ${content.summary}`.toLowerCase().includes(filters.query.toLowerCase());
    const matchesGrade = !filters?.grade || content.grade === filters.grade;
    const matchesStatus =
      !filters?.status ||
      (filters.status === "published" && content.isPublished) ||
      (filters.status === "draft" && !content.isPublished);

    return matchesQuery && matchesGrade && matchesStatus;
  });
}

export async function getAdminContentById(id: string): Promise<ContentItem | undefined> {
  const contents = await getAdminContents();
  return contents.find((content) => content.id === id);
}

export async function getAdminCtas(): Promise<Cta[]> {
  const [ctas, contents] = await Promise.all([
    hasSupabaseEnv() ? getCtasFromSupabase() : getCtas(),
    getAdminContents(),
  ]);

  return ctas.map((cta) => ({
    ...cta,
    usageCount: contents.filter((content) => content.ctaId === cta.id).length,
  }));
}

export async function getAdminBanners(): Promise<BannerItem[]> {
  return hasSupabaseEnv() ? getBannersFromSupabase() : getActiveBanners();
}

export async function getAdminCollections(): Promise<CollectionItem[]> {
  return hasSupabaseEnv() ? getCollectionsFromSupabase() : getHomeCollections();
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const [contents, ctas, banners, collections] = await Promise.all([
    getAdminContents(),
    getAdminCtas(),
    getAdminBanners(),
    getAdminCollections(),
  ]);

  const fallbackDashboard = {
    totalPublishedContents: contents.filter((content) => content.isPublished).length,
    todayViews: 0,
    weeklyCtaClicks: 0,
    popularContents: contents.filter((content) => content.isFeatured).slice(0, 5).map((content) => ({ ...content, score: 0 })),
    recentContents: contents.slice(0, 5),
    alerts: banners.length === 0 ? ["현재 노출 중인 배너가 없습니다."] : [`홈 컬렉션 ${collections.length}개가 노출 중입니다.`],
    dailyViews: Array.from({ length: 7 }, (_, index) => ({
      date: `${index + 1}일 전`,
      value: 0,
    })),
    gradeInterest: [],
    ctaRanking: ctas.slice(0, 5).map((cta) => ({ cta, clicks: 0 })),
    utmRanking: [],
  };

  if (!hasSupabaseEnv()) {
    return fallbackDashboard;
  }

  const events = await getEventsFromSupabase();
  const todayStart = startOfDay();
  const weekStart = startOfDaysAgo(6);
  const todayViews = events.filter(
    (event) =>
      ["page_view", "content_view"].includes(event.event_type) &&
      new Date(event.created_at).getTime() >= todayStart.getTime(),
  ).length;
  const weeklyCtaClicks = events.filter(
    (event) => event.event_type === "cta_click" && new Date(event.created_at).getTime() >= weekStart.getTime(),
  ).length;

  const contentScore = new Map<string, number>();
  const gradeScore = new Map<string, number>();
  const ctaScore = new Map<string, number>();
  const utmScore = new Map<string, number>();
  const dailyViewsMap = new Map<string, number>();

  for (let offset = 6; offset >= 0; offset -= 1) {
    const day = startOfDaysAgo(offset);
    const key = day.toISOString().slice(0, 10);
    dailyViewsMap.set(key, 0);
  }

  events.forEach((event) => {
    const createdAt = new Date(event.created_at);
    const dayKey = createdAt.toISOString().slice(0, 10);

    if (event.event_type === "content_view" && event.content_id) {
      contentScore.set(event.content_id, (contentScore.get(event.content_id) ?? 0) + 1);
      if (event.grade) {
        gradeScore.set(event.grade, (gradeScore.get(event.grade) ?? 0) + 1);
      }
    }

    if (event.event_type === "cta_click" && event.cta_id) {
      ctaScore.set(event.cta_id, (ctaScore.get(event.cta_id) ?? 0) + 1);
    }

    if (event.event_type === "page_view") {
      const label = [event.utm_source, event.utm_campaign].filter(Boolean).join(" / ");

      if (label) {
        utmScore.set(label, (utmScore.get(label) ?? 0) + 1);
      }
    }

    if (["page_view", "content_view"].includes(event.event_type) && dailyViewsMap.has(dayKey)) {
      dailyViewsMap.set(dayKey, (dailyViewsMap.get(dayKey) ?? 0) + 1);
    }
  });

  const contentMap = new Map(contents.map((content) => [content.id, content]));
  const ctaMap = new Map(ctas.map((cta) => [cta.id, cta]));
  const alerts = banners
    .filter((banner) => banner.endsAt)
    .map((banner) => {
      const remainDays = Math.ceil((new Date(banner.endsAt as string).getTime() - Date.now()) / 86400000);
      return remainDays <= 7 ? `배너 노출 종료가 ${Math.max(remainDays, 0)}일 남았습니다.` : null;
    })
    .filter((message): message is string => Boolean(message));

  if (alerts.length === 0 && contents.every((content) => !content.isHero)) {
    alerts.push("현재 대표 콘텐츠가 지정되어 있지 않습니다.");
  }

  return {
    totalPublishedContents: contents.filter((content) => content.isPublished).length,
    todayViews,
    weeklyCtaClicks,
    popularContents: [...contentScore.entries()]
      .sort((left, right) => right[1] - left[1])
      .slice(0, 5)
      .map(([contentId, score]) => ({ ...(contentMap.get(contentId) as ContentItem), score })),
    recentContents: contents.slice(0, 5),
    alerts: alerts.length > 0 ? alerts : ["아직 데이터가 쌓이고 있어요."],
    dailyViews: [...dailyViewsMap.entries()].map(([date, value]) => ({ date: date.slice(5), value })),
    gradeInterest: [...gradeScore.entries()]
      .sort((left, right) => right[1] - left[1])
      .map(([label, value]) => ({ label, value })),
    ctaRanking: [...ctaScore.entries()]
      .sort((left, right) => right[1] - left[1])
      .slice(0, 5)
      .map(([ctaId, clicks]) => ({ cta: ctaMap.get(ctaId) as Cta, clicks })),
    utmRanking: [...utmScore.entries()]
      .sort((left, right) => right[1] - left[1])
      .slice(0, 5)
      .map(([label, visits]) => ({ label, visits })),
  };
}

export async function getSelectableContents() {
  const contents = await getAdminContents();

  return contents.map((content) => ({
    id: content.id,
    title: content.title,
    grade: content.grade,
    topic: content.topic,
  }));
}

export async function getGradeOptions(): Promise<Grade[]> {
  return ["초등", "중등", "예비고1", "고등", "공통"];
}
