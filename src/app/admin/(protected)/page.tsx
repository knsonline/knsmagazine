import { AdminLineChart } from "@/components/admin/AdminLineChart";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminSummaryList } from "@/components/admin/AdminSummaryList";
import { EmptyState } from "@/components/ui/EmptyState";
import { getAdminDashboardData } from "@/lib/data/admin";

const numberFormatter = new Intl.NumberFormat("ko-KR");

export default async function AdminDashboardPage() {
  const dashboard = await getAdminDashboardData();

  const stats = [
    {
      label: "오늘 페이지뷰",
      value: dashboard.todayPageViews,
      help: "페이지가 열릴 때마다 1씩 쌓이는 오늘 기준 숫자입니다. 같은 방문 세션의 새로고침도 포함될 수 있습니다.",
      tooltip: "사람 수가 아니라 공개 페이지 진입 횟수입니다. 방문 흐름과 콘텐츠 반응을 함께 볼 때 기준점으로 쓰면 좋습니다.",
    },
    {
      label: "누적 페이지뷰",
      value: dashboard.totalPageViews,
      help: "운영 시작 이후 공개 페이지 진입이 얼마나 쌓였는지 보는 누적 숫자입니다.",
      tooltip: "같은 사람이 여러 페이지를 보거나 다시 들어오면 여러 번 집계될 수 있습니다.",
    },
    {
      label: "오늘 방문 세션",
      value: dashboard.todaySessions,
      help: "오늘 처음 잡힌 방문 흐름의 수입니다. 현재 구조에서는 세션 기준 방문 수로 이해해 주세요.",
      tooltip: "정확한 사용자 수가 아니라 브라우저 쿠키 기반 세션 수입니다.",
    },
    {
      label: "누적 방문 세션",
      value: dashboard.totalSessions,
      help: "운영 시작 이후 쌓인 전체 방문 세션 수입니다. 페이지뷰보다 덜 부풀려진 흐름 수로 보시면 됩니다.",
      tooltip: "브라우저 변경, 쿠키 삭제, 시크릿 창은 새로운 세션으로 잡힐 수 있습니다.",
    },
    {
      label: "오늘 콘텐츠 상세 조회",
      value: dashboard.todayContentViews,
      help: "카드 노출이 아니라 실제 상세 페이지 진입만 세는 숫자입니다.",
      tooltip: "content_view 기준이라 콘텐츠 관심도를 보는 데 더 적합합니다.",
    },
    {
      label: "오늘 CTA 클릭",
      value: dashboard.todayCtaClicks,
      help: "상담 신청이나 안내 버튼처럼 행동으로 이어지는 클릭 수입니다.",
      tooltip: "어떤 메시지가 실제 클릭으로 이어졌는지 보는 기준입니다.",
    },
    {
      label: "오늘 배너 클릭",
      value: dashboard.todayBannerClicks,
      help: "이벤트 배너와 상단 프로모션 배너 반응을 오늘 기준으로 본 숫자입니다.",
      tooltip: "배너 노출 대비 클릭률은 아직 별도 계산하지 않고, 반응 유무를 보는 용도로 사용합니다.",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-[-0.03em] text-text-primary">운영 요약</h1>
        <p className="mt-2 text-sm text-text-secondary">
          공개 콘텐츠 {numberFormatter.format(dashboard.totalPublishedContents)}개 기준으로 오늘 반응과 유입 흐름을 함께 봅니다.
        </p>
      </div>

      <div className="card-surface bg-ivory p-5">
        <p className="text-sm font-semibold text-text-primary">집계 기준 안내</p>
        <div className="mt-3 space-y-2 text-sm leading-6 text-text-secondary">
          <p>모든 수치는 한국 시간(KST) 기준으로 보여드립니다.</p>
          <p>오늘은 한국 시간 00:00부터 현재 시점까지 쌓인 값이며, 방문 세션은 현재 구조에서 세션 기준 방문 수를 뜻합니다.</p>
          <p>관리자 브라우저는 기본적으로 통계에서 제외되지만, 외부 테스트 접속이나 허용한 테스트 브라우저는 일부 포함될 수 있습니다.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <AdminStatCard
            key={stat.label}
            label={stat.label}
            value={numberFormatter.format(stat.value)}
            help={stat.help}
            tooltip={stat.tooltip}
          />
        ))}
      </div>

      <AdminLineChart items={dashboard.dailyPageViews} />

      <div className="grid gap-6 xl:grid-cols-2">
        <AdminSummaryList
          title="오늘 유입 source TOP"
          description="오늘 세션 기준으로 어떤 출처에서 가장 많이 들어왔는지 보여줍니다."
          items={dashboard.topSources}
          emptyTitle="아직 오늘 유입 source 데이터가 없어요."
          emptyDescription="session_start가 쌓이면 출처별 요약이 여기에 보입니다."
        />
        <AdminSummaryList
          title="오늘 유입 medium TOP"
          description="organic, referral, none 같은 유입 방식 요약입니다."
          items={dashboard.topMediums}
          emptyTitle="아직 오늘 유입 medium 데이터가 없어요."
          emptyDescription="세션이 쌓이면 어떤 방식으로 들어왔는지 볼 수 있습니다."
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <AdminSummaryList
          title="오늘 campaign TOP"
          description="UTM campaign 기준으로 어떤 캠페인 이름이 많이 들어왔는지 보여줍니다."
          items={dashboard.topCampaigns}
          emptyTitle="오늘 campaign 데이터가 아직 없어요."
          emptyDescription="UTM이 붙은 외부 유입이 들어오면 캠페인 이름이 집계됩니다."
        />
        <AdminSummaryList
          title="오늘 랜딩 페이지 TOP"
          description="방문 세션이 처음 들어온 페이지 기준입니다. 어떤 페이지가 입구 역할을 했는지 볼 수 있습니다."
          items={dashboard.topLandingPages}
          emptyTitle="오늘 랜딩 페이지 데이터가 아직 없어요."
          emptyDescription="session_start가 쌓이면 방문 입구 페이지가 여기에 보입니다."
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <AdminSummaryList
          title="오늘 많이 본 콘텐츠 TOP"
          description="오늘 상세 페이지 진입이 많았던 콘텐츠입니다. 카드 노출이 아니라 상세 조회 기준입니다."
          items={dashboard.topContents}
          emptyTitle="오늘 많이 본 콘텐츠가 아직 없어요."
          emptyDescription="content_view가 쌓이면 반응이 높은 콘텐츠를 바로 볼 수 있습니다."
        />
        <AdminSummaryList
          title="오늘 클릭 많은 CTA TOP"
          description="오늘 가장 많이 눌린 CTA 문구입니다."
          items={dashboard.topCtas}
          emptyTitle="오늘 CTA 클릭이 아직 없어요."
          emptyDescription="CTA 클릭이 생기면 어떤 문구가 반응을 얻는지 볼 수 있습니다."
        />
        <AdminSummaryList
          title="오늘 클릭 많은 배너 TOP"
          description="오늘 반응이 있었던 배너를 간단히 정리한 표입니다."
          items={dashboard.topBanners}
          emptyTitle="오늘 배너 클릭이 아직 없어요."
          emptyDescription="배너 클릭이 쌓이면 어떤 배너가 반응을 얻는지 여기에 보입니다."
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="card-surface p-5">
          <h2 className="text-lg font-semibold text-text-primary">최근 등록 콘텐츠</h2>
          <p className="mt-2 text-sm text-text-secondary">
            가장 최근에 등록하거나 수정한 콘텐츠를 빠르게 확인하는 영역입니다.
          </p>
          <div className="mt-4 space-y-3">
            {dashboard.recentContents.length > 0 ? (
              dashboard.recentContents.map((content) => (
                <div key={content.id} className="rounded-2xl bg-ivory p-4">
                  <p className="font-semibold text-text-primary">{content.title}</p>
                  <p className="mt-1 text-sm text-text-secondary">
                    {content.grade} · {content.topic} · {content.isPublished ? "공개" : "비공개"}
                  </p>
                </div>
              ))
            ) : (
              <EmptyState
                title="아직 등록된 콘텐츠가 없어요."
                description="콘텐츠를 등록하면 최근 등록 목록을 여기서 바로 확인할 수 있습니다."
              />
            )}
          </div>
        </div>

        <div className="card-surface p-5">
          <h2 className="text-lg font-semibold text-text-primary">숫자 해석 가이드</h2>
          <div className="mt-4 space-y-3 text-sm leading-6 text-text-secondary">
            <p>방문 세션은 현재 구조에서 브라우저 쿠키 기준 방문 수입니다. 정확한 사람 수와 완전히 같지는 않습니다.</p>
            <p>페이지뷰는 페이지가 열릴 때마다 쌓이고, 콘텐츠 상세 조회는 상세 페이지 진입만 따로 셉니다.</p>
            <p>유입 source, medium, campaign, 랜딩 페이지는 오늘 세션의 첫 진입 기준으로 요약합니다.</p>
            <p>운영 문서는 <span className="font-semibold text-text-primary">docs/utm-operation-guide.md</span>에 정리해 두었습니다.</p>
          </div>
        </div>
      </div>

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
    </div>
  );
}
