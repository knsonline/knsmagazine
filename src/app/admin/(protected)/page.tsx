import { AdminLineChart } from "@/components/admin/AdminLineChart";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { getAdminDashboardData } from "@/lib/data/admin";

export default async function AdminDashboardPage() {
  const dashboard = await getAdminDashboardData();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-3">
        <AdminStatCard
          label="총 공개 콘텐츠"
          value={`${dashboard.totalPublishedContents}`}
          help="현재 퍼블릭에 노출 가능한 콘텐츠 수입니다."
        />
        <AdminStatCard label="오늘 조회수" value={`${dashboard.todayViews}`} help="오늘 들어온 전체 조회 흐름입니다." />
        <AdminStatCard
          label="주간 CTA 클릭"
          value={`${dashboard.weeklyCtaClicks}`}
          help="최근 7일 동안 CTA가 눌린 횟수입니다."
        />
      </div>

      <AdminLineChart items={dashboard.dailyViews} />

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="card-surface p-5">
          <h2 className="text-lg font-semibold text-text-primary">이번 주 인기 콘텐츠 Top 5</h2>
          <div className="mt-4 space-y-3">
            {dashboard.popularContents.length > 0 ? (
              dashboard.popularContents.map((content, index) => (
                <div key={content.id} className="rounded-2xl bg-ivory p-4">
                  <p className="text-sm font-semibold text-text-secondary">#{index + 1}</p>
                  <p className="mt-2 font-semibold text-text-primary">{content.title}</p>
                  <p className="mt-1 text-sm text-text-secondary">
                    {content.grade} · {content.topic} · 조회 {content.score}
                  </p>
                </div>
              ))
            ) : (
              <EmptyState title="아직 데이터가 쌓이고 있어요." description="조회 이벤트가 들어오면 여기에 순위가 보입니다." />
            )}
          </div>
        </div>

        <div className="card-surface p-5">
          <h2 className="text-lg font-semibold text-text-primary">최근 등록한 콘텐츠 5개</h2>
          <div className="mt-4 space-y-3">
            {dashboard.recentContents.map((content) => (
              <div key={content.id} className="rounded-2xl bg-ivory p-4">
                <p className="font-semibold text-text-primary">{content.title}</p>
                <p className="mt-1 text-sm text-text-secondary">
                  {content.grade} · {content.topic} · {content.isPublished ? "공개" : "비공개"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="card-surface p-5">
          <h2 className="text-lg font-semibold text-text-primary">운영 알림</h2>
          <div className="mt-4 space-y-3">
            {dashboard.alerts.map((alert) => (
              <div key={alert} className="rounded-2xl bg-ivory p-4 text-sm font-medium text-text-primary">
                {alert}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-surface p-5">
            <h2 className="text-lg font-semibold text-text-primary">학년별 관심도</h2>
            <div className="mt-4 space-y-3">
              {dashboard.gradeInterest.length > 0 ? (
                dashboard.gradeInterest.map((item) => (
                  <div key={item.label} className="rounded-2xl bg-ivory p-4">
                    <p className="font-semibold text-text-primary">{item.label}</p>
                    <p className="mt-1 text-sm text-text-secondary">조회 {item.value}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-text-secondary">아직 학년별 조회 데이터가 없습니다.</p>
              )}
            </div>
          </div>

          <div className="card-surface p-5">
            <h2 className="text-lg font-semibold text-text-primary">CTA 클릭 순위</h2>
            <div className="mt-4 space-y-3">
              {dashboard.ctaRanking.length > 0 ? (
                dashboard.ctaRanking.map(({ cta, clicks }) => (
                  <div key={cta.id} className="rounded-2xl bg-ivory p-4">
                    <p className="font-semibold text-text-primary">{cta.label}</p>
                    <p className="mt-1 text-sm text-text-secondary">클릭 {clicks}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-text-secondary">아직 CTA 클릭 데이터가 없습니다.</p>
              )}
            </div>
          </div>

          <div className="card-surface p-5">
            <h2 className="text-lg font-semibold text-text-primary">UTM 유입</h2>
            <div className="mt-4 space-y-3">
              {dashboard.utmRanking.length > 0 ? (
                dashboard.utmRanking.map((item) => (
                  <div key={item.label} className="rounded-2xl bg-ivory p-4">
                    <p className="font-semibold text-text-primary">{item.label}</p>
                    <p className="mt-1 text-sm text-text-secondary">유입 {item.visits}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-text-secondary">아직 UTM 유입 데이터가 없습니다.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
