import Link from "next/link";
import { duplicateContentAction } from "@/app/admin/actions";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { getAdminContents } from "@/lib/data/admin";
import { normalizeAdminCalendarPeriod } from "@/lib/data/admin-analytics";

interface AdminContentsPageProps {
  searchParams: Promise<{
    q?: string;
    grade?: string;
    status?: string;
    period?: string;
  }>;
}

export default async function AdminContentsPage({ searchParams }: AdminContentsPageProps) {
  const resolvedSearchParams = await searchParams;
  const period = normalizeAdminCalendarPeriod(resolvedSearchParams.period);
  const contents = await getAdminContents({
    query: resolvedSearchParams.q,
    grade: resolvedSearchParams.grade,
    status: resolvedSearchParams.status,
  }, period);
  const periodLabel =
    period === "today" ? "오늘" : period === "calendar_month" ? "이번 달" : "이번 주";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-[-0.03em] text-text-primary">콘텐츠 관리</h1>
          <p className="mt-2 text-sm text-text-secondary">제목 검색과 간단한 필터로 빠르게 정리합니다.</p>
        </div>
        <Link
          href="/admin/contents/new"
          className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-cta-primary px-5 text-sm font-semibold text-white"
        >
          새 콘텐츠 등록
        </Link>
      </div>

      <form className="card-surface grid gap-4 p-5 xl:grid-cols-[1fr_180px_180px_180px_auto]">
        <input
          type="search"
          name="q"
          defaultValue={resolvedSearchParams.q}
          placeholder="제목으로 검색"
          className="min-h-12 rounded-2xl border border-black/10 bg-ivory px-4 outline-none"
        />
        <select
          name="grade"
          defaultValue={resolvedSearchParams.grade ?? ""}
          className="min-h-12 rounded-2xl border border-black/10 bg-ivory px-4 outline-none"
        >
          <option value="">전체 학년</option>
          <option value="초등">초등</option>
          <option value="중등">중등</option>
          <option value="예비고1">예비고1</option>
          <option value="고등">고등</option>
          <option value="공통">공통</option>
        </select>
        <select
          name="status"
          defaultValue={resolvedSearchParams.status ?? ""}
          className="min-h-12 rounded-2xl border border-black/10 bg-ivory px-4 outline-none"
        >
          <option value="">전체 상태</option>
          <option value="published">공개</option>
          <option value="draft">비공개</option>
        </select>
        <select
          name="period"
          defaultValue={period}
          className="min-h-12 rounded-2xl border border-black/10 bg-ivory px-4 outline-none"
        >
          <option value="today">오늘</option>
          <option value="calendar_week">이번 주</option>
          <option value="calendar_month">이번 달</option>
        </select>
        <button
          type="submit"
          className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-black/10 bg-white px-5 text-sm font-semibold text-text-primary"
        >
          필터 적용
        </button>
      </form>

      <div className="rounded-2xl bg-ivory px-4 py-4 text-sm text-text-secondary">
        <p className="font-semibold text-text-primary">복제는 안전한 초안 템플릿으로 생성됩니다.</p>
        <p className="mt-2">
          복제본은 비공개 상태로 만들어지고, 외부 링크는 비워지며, 홈 추천과 히어로 지정은 모두 해제됩니다.
        </p>
        <p className="mt-2 text-text-primary">{periodLabel} 반응 지표를 함께 보고 편집 우선순위를 정해 보세요.</p>
      </div>

      {contents.length > 0 ? (
        <div className="card-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-ivory text-text-secondary">
                <tr>
                  <th className="px-4 py-4">제목</th>

                  <th className="px-4 py-4">학년</th>
                  <th className="px-4 py-4">주제</th>
                  <th className="px-4 py-4">타입</th>

                  <th className="px-4 py-4">상태</th>
                  <th className="px-4 py-4 text-right">{periodLabel} 상세조회</th>
                  <th className="px-4 py-4 text-right">{periodLabel} 원문이동</th>
                  <th className="px-4 py-4 text-right">{periodLabel} 상담기여</th>
                  <th className="px-4 py-4">관리</th>
                </tr>
              </thead>
              <tbody>
                {contents.map((content) => (
                  <tr key={content.id} className="border-t border-black/6">
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="font-semibold text-text-primary">{content.title}</div>
                        {content.isFeatured ? <Badge tone="gold">홈 추천</Badge> : null}
                      </div>
                      <div className="mt-1 text-xs text-text-secondary">/contents/{content.slug}</div>
                    </td>

                    <td className="px-4 py-4">{content.grade}</td>
                    <td className="px-4 py-4">{content.topic}</td>
                    <td className="px-4 py-4">{content.contentType}</td>

                    <td className="px-4 py-4">
                      <div className="space-y-2">
                        <Badge tone={content.isPublished ? "success" : "muted"}>
                          {content.isPublished ? "공개" : "비공개"}
                        </Badge>
                        <p className="text-xs text-text-secondary">
                          {content.isPublished ? "노출 중" : "노출 안 함"}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right font-semibold text-text-primary">
                      {content.periodContentViews}
                    </td>
                    <td className="px-4 py-4 text-right font-semibold text-text-primary">
                      {content.periodOutboundClicks}
                    </td>
                    <td className="px-4 py-4 text-right font-semibold text-text-primary">
                      {content.periodConsultClicks}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex min-w-[124px] flex-wrap gap-3">
                        <Link href={`/admin/contents/${content.id}/edit`} className="font-semibold text-navy">
                          수정
                        </Link>
                        <form action={duplicateContentAction.bind(null, content.id)}>
                          <button type="submit" className="font-semibold text-text-secondary transition hover:text-navy">
                            복제
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState title="조건에 맞는 콘텐츠가 없습니다." description="검색어나 필터를 조정해 보세요." />
      )}
    </div>
  );
}
