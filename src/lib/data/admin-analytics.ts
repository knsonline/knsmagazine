import type {
  AdminAlertItem,
  AdminBreakdownItem,
  AdminCalendarPeriod,
  AdminTrendPoint,
} from "@/types/admin";
import type {
  BannerItem,
  ConsultSegment,
  ContentItem,
  Cta,
} from "@/types/content";
import type { ContentEventSnapshot } from "@/lib/data/catalog";
import {
  getAllBanners,
  getAllContents,
  getContentEventSnapshots,
  getLegacyCtaRows,
} from "@/lib/data/catalog";
import { formatKstMonthDay, getKstDateKey, getKstStartOfDay } from "@/lib/utils/format";

const KST_TIMEZONE = "Asia/Seoul";
const PERIOD_LABELS: Record<AdminCalendarPeriod, string> = {
  today: "오늘",
  calendar_week: "이번 주",
  calendar_month: "이번 달",
};
const WEEKDAY_SEQUENCE = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
const WEEKDAY_LABELS_KO = ["월", "화", "수", "목", "금", "토", "일"] as const;
const OUTBOUND_EVENT_TYPES = new Set(["content_click", "banner_click", "cta_click"]);

interface PeriodMeta {
  period: AdminCalendarPeriod;
  label: string;
  rangeLabel: string;
  dayKeys: string[];
  dayLabels: string[];
  dayKeySet: Set<string>;
}

interface SessionEntry {
  sessionKey: string;
  event: ContentEventSnapshot;
}

interface ContentPerformance {
  contentViews: number;
  outboundClicks: number;
  consultClicks: number;
}

interface BreakdownCounts {
  label: string;
  value: number;
  meta?: string;
  href?: string;
}

export interface AdminAnalyticsSnapshot {
  periodMeta: PeriodMeta;
  contents: ContentItem[];
  banners: BannerItem[];
  ctas: Cta[];
  filteredEvents: ContentEventSnapshot[];
  sessionEntries: SessionEntry[];
  totalPublished: number;
  heroContent?: ContentItem;
  sourceMediumBreakdown: AdminBreakdownItem[];
  utmCampaignBreakdown: AdminBreakdownItem[];
  landingPageBreakdown: AdminBreakdownItem[];
  gradeBreakdown: AdminBreakdownItem[];
  topicBreakdown: AdminBreakdownItem[];
  topContentViews: Array<{
    id: string;
    title: string;
    views: number;
    outboundClicks: number;
    consultClicks: number;
    href: string;
  }>;
  topContentOutboundRates: Array<{
    id: string;
    title: string;
    views: number;
    outboundClicks: number;
    rate: number;
    href: string;
  }>;
  ctaBreakdown: AdminBreakdownItem[];
  bannerBreakdown: AdminBreakdownItem[];
  consultSegmentBreakdown: AdminBreakdownItem[];
  placementBreakdown: AdminBreakdownItem[];
  trendPoints: AdminTrendPoint[];
  contentPerformanceMap: Map<string, ContentPerformance>;
  alerts: AdminAlertItem[];
  totals: {
    sessions: number;
    contentViews: number;
    contentClicks: number;
    consultClicks: number;
  };
}

function inferCtaKind(url: string, explicitKind?: Cta["kind"] | null): Cta["kind"] {
  if (explicitKind) {
    return explicitKind;
  }

  return url.startsWith("tel:") ? "consult" : "external";
}

function mapCtaRow(row: Awaited<ReturnType<typeof getLegacyCtaRows>>[number]): Cta {
  return {
    id: row.id,
    label: row.label,
    url: row.url,
    kind: inferCtaKind(row.url, row.kind ?? null),
    consultSegment: row.consult_segment ?? null,
    createdAt: row.created_at,
  };
}

function parseKstDateKey(dateKey: string): Date {
  return new Date(`${dateKey}T00:00:00+09:00`);
}

function addDaysToDateKey(dateKey: string, days: number): string {
  const date = parseKstDateKey(dateKey);
  date.setTime(date.getTime() + days * 86400000);
  return getKstDateKey(date);
}

function getKstDateParts(baseDate = new Date()) {
  const formatter = new Intl.DateTimeFormat("sv-SE", {
    timeZone: KST_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const [year, month, day] = formatter.format(baseDate).split("-");

  return { year, month, day };
}

function getKstWeekdayIndex(baseDate = new Date()) {
  const token = new Intl.DateTimeFormat("en-US", {
    timeZone: KST_TIMEZONE,
    weekday: "short",
  }).format(baseDate) as (typeof WEEKDAY_SEQUENCE)[number];

  return WEEKDAY_SEQUENCE.indexOf(token);
}

function buildCalendarMonthDayKeys(baseDate = new Date()) {
  const { year, month } = getKstDateParts(baseDate);
  const firstDayKey = `${year}-${month}-01`;
  const keys: string[] = [];
  let cursorKey = firstDayKey;

  while (cursorKey.startsWith(`${year}-${month}`)) {
    keys.push(cursorKey);
    cursorKey = addDaysToDateKey(cursorKey, 1);
  }

  return keys;
}

function buildPeriodMeta(
  period: AdminCalendarPeriod,
  baseDate = new Date(),
): PeriodMeta {
  const todayKey = getKstDateKey(baseDate);

  if (period === "today") {
    return {
      period,
      label: PERIOD_LABELS[period],
      rangeLabel: `${formatKstMonthDay(parseKstDateKey(todayKey))}`,
      dayKeys: [todayKey],
      dayLabels: ["오늘"],
      dayKeySet: new Set([todayKey]),
    };
  }

  if (period === "calendar_week") {
    const todayStart = getKstStartOfDay(baseDate);
    const weekStart = new Date(todayStart);
    weekStart.setTime(weekStart.getTime() - getKstWeekdayIndex(baseDate) * 86400000);
    const startKey = getKstDateKey(weekStart);
    const dayKeys = Array.from({ length: 7 }, (_, index) => addDaysToDateKey(startKey, index));

    return {
      period,
      label: PERIOD_LABELS[period],
      rangeLabel: `${formatKstMonthDay(parseKstDateKey(dayKeys[0]))} - ${formatKstMonthDay(parseKstDateKey(dayKeys[6]))}`,
      dayKeys,
      dayLabels: [...WEEKDAY_LABELS_KO],
      dayKeySet: new Set(dayKeys),
    };
  }

  const dayKeys = buildCalendarMonthDayKeys(baseDate);

  return {
    period,
    label: PERIOD_LABELS[period],
    rangeLabel: `${dayKeys[0].slice(0, 7).replace("-", ".")} 월`,
    dayKeys,
    dayLabels: dayKeys.map((dayKey) => `${Number(dayKey.slice(-2))}일`),
    dayKeySet: new Set(dayKeys),
  };
}

function getSessionKey(event: ContentEventSnapshot): string {
  return event.session_id ?? `legacy-${event.id}`;
}

function buildBreakdownItems(items: BreakdownCounts[]): AdminBreakdownItem[] {
  const total = items.reduce((sum, item) => sum + item.value, 0);

  return items.map((item) => ({
    label: item.label,
    value: item.value,
    share: total > 0 ? item.value / total : 0,
    meta: item.meta,
    href: item.href,
  }));
}

function sortBreakdownMap(map: Map<string, BreakdownCounts>) {
  return [...map.values()].sort((left, right) => right.value - left.value);
}

function formatPlacementLabel(placement: string) {
  return placement
    .split("_")
    .filter(Boolean)
    .map((token) => {
      if (token === "cta") return "CTA";
      if (token === "top") return "상단";
      if (token === "soft") return "소프트";
      if (token === "hero") return "히어로";
      if (token === "detail") return "상세";
      if (token === "header") return "헤더";
      if (token === "footer") return "푸터";
      if (token === "banner") return "배너";
      if (token === "sticky") return "하단 고정";
      if (token === "mobile") return "모바일";
      return token;
    })
    .join(" ");
}

export function normalizeAdminCalendarPeriod(rawValue?: string): AdminCalendarPeriod {
  if (rawValue === "today" || rawValue === "calendar_week" || rawValue === "calendar_month") {
    return rawValue;
  }

  return "calendar_week";
}

function getContentTitle(contentMap: Map<string, ContentItem>, contentId: string) {
  return contentMap.get(contentId)?.title ?? "알 수 없는 콘텐츠";
}

function getExpiringBannerAlerts(banners: BannerItem[]): AdminAlertItem[] {
  const today = getKstStartOfDay();

  return banners
    .filter((banner) => banner.isActive && banner.endsAt)
    .map((banner) => {
      const endDate = new Date(`${banner.endsAt}T23:59:59+09:00`);
      const diffDays = Math.floor((endDate.getTime() - today.getTime()) / 86400000);

      return {
        banner,
        diffDays,
      };
    })
    .filter((item) => item.diffDays >= 0 && item.diffDays <= 7)
    .map((item) => ({
      tone: "info" as const,
      title: `배너 "${item.banner.title}" 종료 임박`,
      description: `${item.diffDays + 1}일 안에 노출 기간이 끝납니다. 연장 여부를 확인해 주세요.`,
      href: "/admin/banners",
    }));
}

export async function getAdminAnalyticsSnapshot(
  period: AdminCalendarPeriod,
): Promise<AdminAnalyticsSnapshot> {
  const periodMeta = buildPeriodMeta(period);
  const [contents, banners, ctaRows, events] = await Promise.all([
    getAllContents(),
    getAllBanners(),
    getLegacyCtaRows(),
    getContentEventSnapshots(),
  ]);
  const ctas = ctaRows.map(mapCtaRow);
  const contentMap = new Map(contents.map((content) => [content.id, content]));
  const ctaMap = new Map(ctas.map((cta) => [cta.id, cta]));
  const bannerMap = new Map(banners.map((banner) => [banner.id, banner]));
  const eventDateKeyMap = new Map<number, string>();

  const filteredEvents = events.filter((event) => {
    const eventDateKey = getKstDateKey(new Date(event.created_at));
    eventDateKeyMap.set(event.id, eventDateKey);
    return periodMeta.dayKeySet.has(eventDateKey);
  });

  const sessionEntryMap = new Map<string, SessionEntry>();
  const sortedFilteredEvents = [...filteredEvents].sort(
    (left, right) => new Date(left.created_at).getTime() - new Date(right.created_at).getTime(),
  );

  for (const event of sortedFilteredEvents) {
    if (event.event_type !== "session_start" && event.event_type !== "page_view") {
      continue;
    }

    const sessionKey = getSessionKey(event);
    const current = sessionEntryMap.get(sessionKey);

    if (!current || (current.event.event_type !== "session_start" && event.event_type === "session_start")) {
      sessionEntryMap.set(sessionKey, { sessionKey, event });
    }
  }

  const sessionEntries = [...sessionEntryMap.values()];
  const sourceMediumMap = new Map<string, BreakdownCounts>();
  const utmCampaignMap = new Map<string, BreakdownCounts>();
  const landingPageMap = new Map<string, BreakdownCounts>();
  const gradeMap = new Map<string, BreakdownCounts>();
  const topicMap = new Map<string, BreakdownCounts>();
  const ctaMapCounts = new Map<string, BreakdownCounts>();
  const bannerMapCounts = new Map<string, BreakdownCounts>();
  const consultSegmentMap = new Map<string, BreakdownCounts>();
  const placementMap = new Map<string, BreakdownCounts>();
  const contentPerformanceMap = new Map<string, ContentPerformance>();
  const daySessions = new Map<string, Set<string>>();
  const dayContentViews = new Map<string, number>();
  const dayContentClicks = new Map<string, number>();
  const dayConsultClicks = new Map<string, number>();

  for (const content of contents) {
    contentPerformanceMap.set(content.id, {
      contentViews: 0,
      outboundClicks: 0,
      consultClicks: 0,
    });
  }

  for (const entry of sessionEntries) {
    const dayKey = eventDateKeyMap.get(entry.event.id) ?? getKstDateKey(new Date(entry.event.created_at));
    const dailySessions = daySessions.get(dayKey) ?? new Set<string>();
    dailySessions.add(entry.sessionKey);
    daySessions.set(dayKey, dailySessions);

    const source = entry.event.utm_source ?? "direct";
    const medium = entry.event.utm_medium ?? "none";
    const sourceKey = `${source}__${medium}`;
    const sourceItem = sourceMediumMap.get(sourceKey) ?? {
      label: `${source} / ${medium}`,
      value: 0,
      meta: "유입 채널",
    };
    sourceItem.value += 1;
    sourceMediumMap.set(sourceKey, sourceItem);

    const campaign = entry.event.utm_campaign ?? "미지정";
    const campaignItem = utmCampaignMap.get(campaign) ?? {
      label: campaign,
      value: 0,
      meta: "세션",
    };
    campaignItem.value += 1;
    utmCampaignMap.set(campaign, campaignItem);

    const landingPage = entry.event.landing_path ?? entry.event.page_path ?? "/";
    const landingItem = landingPageMap.get(landingPage) ?? {
      label: landingPage,
      value: 0,
      meta: "랜딩",
    };
    landingItem.value += 1;
    landingPageMap.set(landingPage, landingItem);
  }

  for (const event of filteredEvents) {
    const dayKey = eventDateKeyMap.get(event.id) ?? getKstDateKey(new Date(event.created_at));

    if (event.grade && ["grade_select", "content_view", "content_click"].includes(event.event_type)) {
      const gradeItem = gradeMap.get(event.grade) ?? {
        label: event.grade,
        value: 0,
      };
      gradeItem.value += 1;
      gradeMap.set(event.grade, gradeItem);
    }

    if (event.topic && ["content_view", "content_click"].includes(event.event_type)) {
      const topicItem = topicMap.get(event.topic) ?? {
        label: event.topic,
        value: 0,
      };
      topicItem.value += 1;
      topicMap.set(event.topic, topicItem);
    }

    if (event.event_type === "content_view" && event.content_id) {
      const current = contentPerformanceMap.get(event.content_id) ?? {
        contentViews: 0,
        outboundClicks: 0,
        consultClicks: 0,
      };
      current.contentViews += 1;
      contentPerformanceMap.set(event.content_id, current);
      dayContentViews.set(dayKey, (dayContentViews.get(dayKey) ?? 0) + 1);
    }

    if (event.event_type === "content_click" && event.content_id) {
      const current = contentPerformanceMap.get(event.content_id) ?? {
        contentViews: 0,
        outboundClicks: 0,
        consultClicks: 0,
      };
      current.outboundClicks += 1;
      contentPerformanceMap.set(event.content_id, current);
      dayContentClicks.set(dayKey, (dayContentClicks.get(dayKey) ?? 0) + 1);
    }

    const isConsultClick =
      event.event_type === "cta_click" &&
      ((event.cta_id && ctaMap.get(event.cta_id)?.kind === "consult") ||
        event.destination_channel === "phone");

    if (isConsultClick) {
      dayConsultClicks.set(dayKey, (dayConsultClicks.get(dayKey) ?? 0) + 1);
    }

    if (event.event_type === "cta_click" && event.cta_id) {
      const cta = ctaMap.get(event.cta_id);
      const ctaLabel = cta?.label ?? "알 수 없는 CTA";
      const ctaItem = ctaMapCounts.get(event.cta_id) ?? {
        label: ctaLabel,
        value: 0,
        meta:
          cta?.kind === "consult"
            ? `상담 · ${cta.consultSegment ?? "미지정"}`
            : "외부 안내",
        href: "/admin/ctas",
      };
      ctaItem.value += 1;
      ctaMapCounts.set(event.cta_id, ctaItem);

      if (event.content_id) {
        const current = contentPerformanceMap.get(event.content_id) ?? {
          contentViews: 0,
          outboundClicks: 0,
          consultClicks: 0,
        };
        if (cta?.kind === "consult") {
          current.consultClicks += 1;
          contentPerformanceMap.set(event.content_id, current);
        }
      }

      if (cta?.kind === "consult") {
        const segmentKey = cta.consultSegment ?? "미지정";
        const segmentItem = consultSegmentMap.get(segmentKey) ?? {
          label: segmentKey,
          value: 0,
          meta: "상담 클릭",
        };
        segmentItem.value += 1;
        consultSegmentMap.set(segmentKey, segmentItem);
      }
    }

    if (event.event_type === "banner_click" && event.banner_id) {
      const banner = bannerMap.get(event.banner_id);
      const bannerItem = bannerMapCounts.get(event.banner_id) ?? {
        label: banner?.title ?? "알 수 없는 배너",
        value: 0,
        meta: "배너 클릭",
        href: "/admin/banners",
      };
      bannerItem.value += 1;
      bannerMapCounts.set(event.banner_id, bannerItem);
    }

    if (OUTBOUND_EVENT_TYPES.has(event.event_type)) {
      const placement = event.placement ?? "미분류";
      const placementItem = placementMap.get(placement) ?? {
        label: formatPlacementLabel(placement),
        value: 0,
        meta: placement,
      };
      placementItem.value += 1;
      placementMap.set(placement, placementItem);
    }
  }

  const topContentViews = [...contentPerformanceMap.entries()]
    .filter(([, performance]) => performance.contentViews > 0)
    .sort((left, right) => right[1].contentViews - left[1].contentViews)
    .slice(0, 10)
    .map(([contentId, performance]) => ({
      id: contentId,
      title: getContentTitle(contentMap, contentId),
      views: performance.contentViews,
      outboundClicks: performance.outboundClicks,
      consultClicks: performance.consultClicks,
      href: `/admin/contents/${contentId}/edit`,
    }));

  const topContentOutboundRates = [...contentPerformanceMap.entries()]
    .filter(([, performance]) => performance.contentViews > 0)
    .map(([contentId, performance]) => ({
      id: contentId,
      title: getContentTitle(contentMap, contentId),
      views: performance.contentViews,
      outboundClicks: performance.outboundClicks,
      rate: performance.outboundClicks / performance.contentViews,
      href: `/admin/contents/${contentId}/edit`,
    }))
    .sort((left, right) => right.rate - left.rate || right.views - left.views)
    .slice(0, 10);

  const trendPoints: AdminTrendPoint[] = periodMeta.dayKeys.map((dayKey, index) => ({
    key: dayKey,
    label: periodMeta.dayLabels[index] ?? dayKey,
    sessions: daySessions.get(dayKey)?.size ?? 0,
    contentViews: dayContentViews.get(dayKey) ?? 0,
    contentClicks: dayContentClicks.get(dayKey) ?? 0,
    consultClicks: dayConsultClicks.get(dayKey) ?? 0,
  }));

  const totalPublished = contents.filter((content) => content.isPublished).length;
  const heroContent = contents.find((content) => content.isPublished && content.isHero);
  const consultSegments = new Set<ConsultSegment>(
    ctas
      .filter((cta) => cta.kind === "consult" && cta.consultSegment)
      .map((cta) => cta.consultSegment as ConsultSegment),
  );
  const alerts: AdminAlertItem[] = [];

  if (!heroContent) {
    alerts.push({
      tone: "warning",
      title: "히어로 콘텐츠가 비어 있습니다",
      description: "홈 첫 화면의 중심이 약해집니다. 오늘의 커버 스토리를 하나 지정해 주세요.",
      href: "/admin/contents",
    });
  }

  const lowOutboundContent = topContentViews.find(
    (item) => item.views >= 3 && item.outboundClicks / item.views < 0.18,
  );

  if (lowOutboundContent) {
    alerts.push({
      tone: "warning",
      title: "조회는 높지만 원문 이동이 낮은 콘텐츠가 있습니다",
      description: `${lowOutboundContent.title}의 원문 이동 연결 문구와 CTA 배치를 점검해 보세요.`,
      href: lowOutboundContent.href,
    });
  }

  for (const segment of consultSegments) {
    if (!consultSegmentMap.has(segment)) {
      alerts.push({
        tone: "info",
        title: `${segment} 상담 클릭이 없습니다`,
        description: `${periodMeta.label} 동안 ${segment} 상담 연결이 발생하지 않았습니다. CTA 노출 위치를 점검해 주세요.`,
        href: "/admin/ctas",
      });
    }
  }

  alerts.push(...getExpiringBannerAlerts(banners));

  return {
    periodMeta,
    contents,
    banners,
    ctas,
    filteredEvents,
    sessionEntries,
    totalPublished,
    heroContent,
    sourceMediumBreakdown: buildBreakdownItems(sortBreakdownMap(sourceMediumMap).slice(0, 8)),
    utmCampaignBreakdown: buildBreakdownItems(sortBreakdownMap(utmCampaignMap).slice(0, 8)),
    landingPageBreakdown: buildBreakdownItems(sortBreakdownMap(landingPageMap).slice(0, 8)),
    gradeBreakdown: buildBreakdownItems(sortBreakdownMap(gradeMap)),
    topicBreakdown: buildBreakdownItems(sortBreakdownMap(topicMap)),
    topContentViews,
    topContentOutboundRates,
    ctaBreakdown: buildBreakdownItems(sortBreakdownMap(ctaMapCounts).slice(0, 8)),
    bannerBreakdown: buildBreakdownItems(sortBreakdownMap(bannerMapCounts).slice(0, 8)),
    consultSegmentBreakdown: buildBreakdownItems(sortBreakdownMap(consultSegmentMap)),
    placementBreakdown: buildBreakdownItems(sortBreakdownMap(placementMap).slice(0, 8)),
    trendPoints,
    contentPerformanceMap,
    alerts,
    totals: {
      sessions: sessionEntries.length,
      contentViews: filteredEvents.filter((event) => event.event_type === "content_view").length,
      contentClicks: filteredEvents.filter((event) => event.event_type === "content_click").length,
      consultClicks: filteredEvents.filter((event) => {
        if (event.event_type !== "cta_click") {
          return false;
        }

        return (
          (event.cta_id && ctaMap.get(event.cta_id)?.kind === "consult") ||
          event.destination_channel === "phone"
        );
      }).length,
    },
  };
}
