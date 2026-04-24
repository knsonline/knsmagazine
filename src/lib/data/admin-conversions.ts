import { GRADES } from "@/constants/taxonomy";
import type { AdminCalendarPeriod } from "@/types/admin";
import { getAdminAnalyticsSnapshot } from "@/lib/data/admin-analytics";
import {
  getAllBanners,
  getAllCollections,
  getAllContents,
  getLegacyCtaRows,
} from "@/lib/data/catalog";

function inferCtaKind(url: string, explicitKind?: "consult" | "external" | null) {
  if (explicitKind) {
    return explicitKind;
  }

  return url.startsWith("tel:") ? "consult" : "external";
}

export async function getAdminContents(
  filters?: {
    query?: string;
    grade?: string;
    status?: string;
  },
  period: AdminCalendarPeriod = "calendar_week",
) {
  const [contents, snapshot] = await Promise.all([
    getAllContents(),
    getAdminAnalyticsSnapshot(period),
  ]);

  return contents
    .filter((content) => {
      const matchesQuery =
        !filters?.query ||
        `${content.title} ${content.summary}`.toLowerCase().includes(filters.query.toLowerCase());
      const matchesGrade = !filters?.grade || content.grade === filters.grade;
      const matchesStatus =
        !filters?.status ||
        (filters.status === "published" && content.isPublished) ||
        (filters.status === "draft" && !content.isPublished);

      return matchesQuery && matchesGrade && matchesStatus;
    })
    .map((content) => {
      const performance = snapshot.contentPerformanceMap.get(content.id) ?? {
        contentViews: 0,
        outboundClicks: 0,
        consultClicks: 0,
      };

      return {
        ...content,
        periodContentViews: performance.contentViews,
        periodOutboundClicks: performance.outboundClicks,
        periodConsultClicks: performance.consultClicks,
      };
    });
}

export async function getAdminContentById(id: string) {
  return (await getAllContents()).find((content) => content.id === id);
}

export async function getAdminBanners() {
  return getAllBanners();
}

export async function getAdminCollections() {
  return getAllCollections();
}

export async function getAdminCtas() {
  const [ctaRows, contents] = await Promise.all([getLegacyCtaRows(), getAllContents()]);

  return ctaRows.map((cta) => ({
    id: cta.id,
    label: cta.label,
    url: cta.url,
    kind: inferCtaKind(cta.url, cta.kind ?? null),
    consultSegment: cta.consult_segment ?? null,
    usageCount: contents.filter((content) => content.ctaId === cta.id).length,
  }));
}

export async function getSelectableContents() {
  return (await getAllContents()).map((content) => ({
    id: content.id,
    title: content.title,
    grade: content.grade,
    topic: content.topic,
  }));
}

export async function getGradeOptions() {
  return GRADES;
}
