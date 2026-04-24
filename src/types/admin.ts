export interface AdminSummaryItem {
  label: string;
  value: number;
  meta?: string;
  href?: string;
}

export type AdminCalendarPeriod = "today" | "calendar_week" | "calendar_month";

export interface AdminBreakdownItem {
  label: string;
  value: number;
  share: number;
  meta?: string;
  href?: string;
}

export interface AdminTrendPoint {
  key: string;
  label: string;
  sessions: number;
  contentViews: number;
  contentClicks: number;
  consultClicks: number;
}

export interface AdminAlertItem {
  tone: "warning" | "info";
  title: string;
  description: string;
  href?: string;
}
