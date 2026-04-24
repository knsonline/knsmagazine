import type {
  AdminAlertItem,
  AdminBreakdownItem,
  AdminCalendarPeriod,
  AdminTrendPoint,
} from "@/types/admin";
import { getAdminAnalyticsSnapshot } from "@/lib/data/admin-analytics";

export interface DashboardData {
  period: AdminCalendarPeriod;
  periodLabel: string;
  rangeLabel: string;
  totalPublished: number;
  heroTitle?: string;
  totalSessions: number;
  contentViews: number;
  contentClicks: number;
  consultClicks: number;
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
  alerts: AdminAlertItem[];
}

export async function getAdminDashboardData(
  period: AdminCalendarPeriod,
): Promise<DashboardData> {
  const snapshot = await getAdminAnalyticsSnapshot(period);

  return {
    period,
    periodLabel: snapshot.periodMeta.label,
    rangeLabel: snapshot.periodMeta.rangeLabel,
    totalPublished: snapshot.totalPublished,
    heroTitle: snapshot.heroContent?.title,
    totalSessions: snapshot.totals.sessions,
    contentViews: snapshot.totals.contentViews,
    contentClicks: snapshot.totals.contentClicks,
    consultClicks: snapshot.totals.consultClicks,
    sourceMediumBreakdown: snapshot.sourceMediumBreakdown,
    utmCampaignBreakdown: snapshot.utmCampaignBreakdown,
    landingPageBreakdown: snapshot.landingPageBreakdown,
    gradeBreakdown: snapshot.gradeBreakdown,
    topicBreakdown: snapshot.topicBreakdown,
    topContentViews: snapshot.topContentViews,
    topContentOutboundRates: snapshot.topContentOutboundRates,
    ctaBreakdown: snapshot.ctaBreakdown,
    bannerBreakdown: snapshot.bannerBreakdown,
    consultSegmentBreakdown: snapshot.consultSegmentBreakdown,
    placementBreakdown: snapshot.placementBreakdown,
    trendPoints: snapshot.trendPoints,
    alerts: snapshot.alerts,
  };
}
