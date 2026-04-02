import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getActiveBanners, getCtas, getHomeCollections, getPublishedContents } from "@/lib/data/content";
import {
  formatKstMonthDay,
  getKstDateKey,
  getKstStartOfDay,
  getKstStartOfDaysAgo,
  getPlaceholderImage,
} from "@/lib/utils/format";
import { getIdSlugPrefix } from "@/lib/utils/slug";
import { normalizeMultilineText } from "@/lib/utils/text";
import type { BannerItem, CollectionItem, ContentItem, Cta, Grade } from "@/types/content";
import type { BannerRow, CollectionItemRow, CollectionRow, ContentRow, CtaRow, EventRow } from "@/types/database";

export interface AdminSummaryItem {
  label: string;
  value: number;
  meta?: string;
  href?: string;
}

export interface AdminDashboardData {
  totalPublishedContents: number;
  todayPageViews: number;
  totalPageViews: number;
  todaySessions: number;
  totalSessions: number;
  todayContentViews: number;
  todayCtaClicks: number;
  todayBannerClicks: number;
  dailyPageViews: Array<{ date: string; value: number }>;
  topSources: AdminSummaryItem[];
  topMediums: AdminSummaryItem[];
  topCampaigns: AdminSummaryItem[];
  topLandingPages: AdminSummaryItem[];
  topContents: AdminSummaryItem[];
  topCtas: AdminSummaryItem[];
  topBanners: AdminSummaryItem[];
  recentContents: ContentItem[];
  alerts: string[];
}

type DashboardEventRow = Pick<
  EventRow,
  | "event_type"
  | "session_id"
  | "content_id"
  | "cta_id"
  | "banner_id"
  | "page_path"
  | "utm_source"
  | "utm_medium"
  | "utm_campaign"
  | "created_at"
>;

interface SessionEntry {
  sessionId: string;
  pagePath: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  createdAt: string;
}

function mapContentRow(row: ContentRow): ContentItem {
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
    viewCount: 0,
  };
}

function mapBannerRow(row: BannerRow): BannerItem {
  return {
    id: row.id,
    title: row.starts_at ? `${new Date(row.starts_at).getFullYear()} 설명회 일정 보기` : "KNS 설명회 일정 보기",
    imageUrl: getPlaceholderImage(row.image_url),
    imageUrlRaw: row.image_url,
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

function buildDashboardAlerts(contents: ContentItem[], banners: BannerItem[], totalPageViews: number): string[] {
  const alerts: string[] = [];

  if (totalPageViews === 0) {
    alerts.push("아직 데이터가 쌓이고 있어요. 공개 페이지 유입이 생기면 숫자가 채워집니다.");
  }

  if (contents.every((content) => !content.isHero)) {
    alerts.push("현재 히어로로 지정된 대표 콘텐츠가 없습니다.");
  }

  const expiringBannerAlerts = banners
    .filter((banner) => banner.endsAt)
    .map((banner) => {
      const remainingDays = Math.ceil((new Date(banner.endsAt as string).getTime() - Date.now()) / 86400000);

      if (remainingDays > 7) {
        return null;
      }

      return `배너 노출 종료가 ${Math.max(remainingDays, 0)}일 남았습니다.`;
    })
    .filter((message): message is string => Boolean(message));

  alerts.push(...expiringBannerAlerts);
  alerts.push("관리자 접속 브라우저는 기본적으로 통계 수집에서 제외되며, 외부 테스트 접속은 일부 포함될 수 있습니다.");

  return alerts;
}

function formatLandingPage(pagePath: string | null): string {
  if (!pagePath || pagePath === "/") {
    return "홈";
  }

  if (pagePath.startsWith("/contents/")) {
    return `콘텐츠 상세 ${pagePath.replace("/contents/", "")}`;
  }

  if (pagePath === "/contents") {
    return "전체 콘텐츠";
  }

  if (pagePath.startsWith("/grades/")) {
    return `학년 페이지 ${decodeURIComponent(pagePath.replace("/grades/", ""))}`;
  }

  if (pagePath.startsWith("/search")) {
    return "검색";
  }

  if (pagePath.startsWith("/collections/")) {
    return `컬렉션 ${pagePath.replace("/collections/", "")}`;
  }

  return pagePath;
}

function buildTopItems(
  counts: Map<string, number>,
  options?: {
    limit?: number;
    transformLabel?: (key: string) => string;
    buildMeta?: (key: string) => string | undefined;
    buildHref?: (key: string) => string | undefined;
  },
): AdminSummaryItem[] {
  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, options?.limit ?? 4)
    .map(([key, value]) => ({
      label: options?.transformLabel ? options.transformLabel(key) : key,
      value,
      meta: options?.buildMeta?.(key),
      href: options?.buildHref?.(key),
    }));
}

function countBy(values: Array<string | null | undefined>, fallbackLabel = "미분류"): Map<string, number> {
  const counts = new Map<string, number>();

  values.forEach((value) => {
    const key = value && value.trim().length > 0 ? value : fallbackLabel;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });

  return counts;
}

function getTodaySessionEntries(events: DashboardEventRow[]): SessionEntry[] {
  const sorted = [...events].sort(
    (left, right) => new Date(left.created_at).getTime() - new Date(right.created_at).getTime(),
  );
  const sessions = new Map<string, SessionEntry>();

  sorted.forEach((event) => {
    if (!event.session_id || sessions.has(event.session_id)) {
      return;
    }

    sessions.set(event.session_id, {
      sessionId: event.session_id,
      pagePath: event.page_path,
      utmSource: event.utm_source,
      utmMedium: event.utm_medium,
      utmCampaign: event.utm_campaign,
      createdAt: event.created_at,
    });
  });

  return [...sessions.values()];
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

async function getDashboardEventsFromSupabase(fromDateIso: string) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("events")
    .select("event_type,session_id,content_id,cta_id,banner_id,page_path,utm_source,utm_medium,utm_campaign,created_at")
    .gte("created_at", fromDateIso)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as DashboardEventRow[];
}

async function getTotalPageViewCountFromSupabase() {
  const supabase = createSupabaseAdminClient();
  const { count, error } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true })
    .eq("event_type", "page_view");

  if (error) {
    throw error;
  }

  return count ?? 0;
}

async function getAllPageViewSessionIdsFromSupabase() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("events")
    .select("session_id")
    .eq("event_type", "page_view")
    .not("session_id", "is", null);

  if (error) {
    throw error;
  }

  return (data ?? []) as Array<{ session_id: string | null }>;
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
  const [contents, banners, ctas] = await Promise.all([getAdminContents(), getAdminBanners(), getAdminCtas()]);

  const fallbackDashboard: AdminDashboardData = {
    totalPublishedContents: contents.filter((content) => content.isPublished).length,
    todayPageViews: 0,
    totalPageViews: 0,
    todaySessions: 0,
    totalSessions: 0,
    todayContentViews: 0,
    todayCtaClicks: 0,
    todayBannerClicks: 0,
    dailyPageViews: Array.from({ length: 7 }, (_, index) => ({
      date: `${index + 1}일`,
      value: 0,
    })),
    topSources: [],
    topMediums: [],
    topCampaigns: [],
    topLandingPages: [],
    topContents: [],
    topCtas: [],
    topBanners: [],
    recentContents: contents.slice(0, 5),
    alerts: buildDashboardAlerts(contents, banners, 0),
  };

  if (!hasSupabaseEnv()) {
    return fallbackDashboard;
  }

  const todayStart = getKstStartOfDay();
  const sevenDaysStart = getKstStartOfDaysAgo(6);

  const [recentEvents, totalPageViews, totalSessionRows] = await Promise.all([
    getDashboardEventsFromSupabase(sevenDaysStart.toISOString()),
    getTotalPageViewCountFromSupabase(),
    getAllPageViewSessionIdsFromSupabase(),
  ]);

  const todayEvents = recentEvents.filter((event) => new Date(event.created_at).getTime() >= todayStart.getTime());
  const todaySessionEntries = getTodaySessionEntries(todayEvents);

  const dailyPageViewsMap = new Map<string, number>();

  for (let offset = 6; offset >= 0; offset -= 1) {
    const day = getKstStartOfDaysAgo(offset);
    const key = getKstDateKey(day);
    dailyPageViewsMap.set(key, 0);
  }

  recentEvents.forEach((event) => {
    if (event.event_type !== "page_view") {
      return;
    }

    const dayKey = getKstDateKey(new Date(event.created_at));

    if (dailyPageViewsMap.has(dayKey)) {
      dailyPageViewsMap.set(dayKey, (dailyPageViewsMap.get(dayKey) ?? 0) + 1);
    }
  });

  const todayPageViews = todayEvents.filter((event) => event.event_type === "page_view").length;
  const todaySessions = todaySessionEntries.length;
  const totalSessions = new Set(
    totalSessionRows
      .map((row) => row.session_id)
      .filter((sessionId): sessionId is string => Boolean(sessionId)),
  ).size;
  const todayContentViews = todayEvents.filter((event) => event.event_type === "content_view").length;
  const todayCtaClicks = todayEvents.filter((event) => event.event_type === "cta_click").length;
  const todayBannerClicks = todayEvents.filter((event) => event.event_type === "banner_click").length;

  const topSources = buildTopItems(countBy(todaySessionEntries.map((entry) => entry.utmSource), "direct"), {
    transformLabel: (key) => key,
  });
  const topMediums = buildTopItems(countBy(todaySessionEntries.map((entry) => entry.utmMedium), "none"), {
    transformLabel: (key) => key,
  });
  const topCampaigns = buildTopItems(countBy(todaySessionEntries.map((entry) => entry.utmCampaign), "미지정"), {
    transformLabel: (key) => key,
  });
  const topLandingPages = buildTopItems(countBy(todaySessionEntries.map((entry) => entry.pagePath), "홈"), {
    transformLabel: (key) => formatLandingPage(key === "홈" ? "/" : key),
    buildMeta: (key) => (key === "홈" ? "/" : key),
  });

  const contentMap = new Map(contents.map((content) => [content.id, content]));
  const ctaMap = new Map(ctas.map((cta) => [cta.id, cta]));
  const bannerMap = new Map(banners.map((banner) => [banner.id, banner]));

  const contentCounts = countBy(
    todayEvents
      .filter((event) => event.event_type === "content_view")
      .map((event) => event.content_id),
    "",
  );
  contentCounts.delete("");

  const ctaCounts = countBy(
    todayEvents
      .filter((event) => event.event_type === "cta_click")
      .map((event) => event.cta_id),
    "",
  );
  ctaCounts.delete("");

  const bannerCounts = countBy(
    todayEvents
      .filter((event) => event.event_type === "banner_click")
      .map((event) => event.banner_id),
    "",
  );
  bannerCounts.delete("");

  const topContents = buildTopItems(contentCounts, {
    limit: 5,
    transformLabel: (key) => contentMap.get(key)?.title ?? "알 수 없는 콘텐츠",
    buildMeta: (key) => {
      const content = contentMap.get(key);
      return content ? `${content.grade} · ${content.topic}` : undefined;
    },
    buildHref: (key) => {
      const content = contentMap.get(key);
      return content ? `/contents/${content.slug}` : undefined;
    },
  });

  const topCtas = buildTopItems(ctaCounts, {
    limit: 5,
    transformLabel: (key) => ctaMap.get(key)?.label ?? "알 수 없는 CTA",
  });

  const topBanners = buildTopItems(bannerCounts, {
    limit: 5,
    transformLabel: (key) => bannerMap.get(key)?.title ?? "알 수 없는 배너",
  });

  return {
    totalPublishedContents: contents.filter((content) => content.isPublished).length,
    todayPageViews,
    totalPageViews,
    todaySessions,
    totalSessions,
    todayContentViews,
    todayCtaClicks,
    todayBannerClicks,
    dailyPageViews: [...dailyPageViewsMap.entries()].map(([date, value]) => ({
      date: formatKstMonthDay(new Date(`${date}T00:00:00+09:00`)),
      value,
    })),
    topSources,
    topMediums,
    topCampaigns,
    topLandingPages,
    topContents,
    topCtas,
    topBanners,
    recentContents: contents.slice(0, 5),
    alerts: buildDashboardAlerts(contents, banners, totalPageViews),
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
