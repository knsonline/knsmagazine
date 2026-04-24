import { AdminAlertList } from "@/components/admin/AdminAlertList";
import { AdminInsightList } from "@/components/admin/AdminInsightList";
import { AdminPeriodTabs } from "@/components/admin/AdminPeriodTabs";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminSummaryList } from "@/components/admin/AdminSummaryList";
import { AdminTrendChart } from "@/components/admin/AdminTrendChart";
import { getAdminDashboardData } from "@/lib/data/admin-dashboard";
import { normalizeAdminCalendarPeriod } from "@/lib/data/admin-analytics";

const numberFormatter = new Intl.NumberFormat("ko-KR");

interface AdminDashboardPageProps {
  searchParams: Promise<{
    period?: string;
  }>;
}

function formatRate(rate: number) {
  return `${Math.round(rate * 100)}%`;
}

export default async function AdminDashboardPage({
  searchParams,
}: AdminDashboardPageProps) {
  const resolvedSearchParams = await searchParams;
  const period = normalizeAdminCalendarPeriod(resolvedSearchParams.period);
  const dashboard = await getAdminDashboardData(period);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-[0.03em] text-text-secondary">
            KNS 교육 큐레이션 인사이트
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.03em] text-text-primary">
            학부모 여정 관제 센터
          </h1>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            유입 경로, 콘텐츠 관심, 원문 이동, 상담 전환을 {dashboard.periodLabel} 기준으로
            한 번에 확인합니다.
          </p>
          <p className="mt-2 text-xs font-semibold tracking-[0.02em] text-text-muted">
            집계 범위: {dashboard.rangeLabel}
          </p>
        </div>

        <AdminPeriodTabs selectedPeriod={period} basePath="/admin" />
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        <AdminStatCard
          label="총 유입 세션"
          value={numberFormatter.format(dashboard.totalSessions)}
          help={`${dashboard.periodLabel} 동안 KNS 매거진에 입장한 세션 수입니다.`}
          tooltip="session_start 또는 첫 page_view 기준으로 중복을 제거한 값입니다."
        />
        <AdminStatCard
          label="콘텐츠 상세 진입"
          value={numberFormatter.format(dashboard.contentViews)}
          help="콘텐츠 상세 페이지를 실제로 열어 본 횟수입니다."
        />
        <AdminStatCard
          label="외부 원문 이동"
          value={numberFormatter.format(dashboard.contentClicks)}
          help="콘텐츠에서 카페·블로그·유튜브 등 원문으로 넘어간 횟수입니다."
        />
        <AdminStatCard
          label="상담 클릭"
          value={numberFormatter.format(dashboard.consultClicks)}
          help="문맥별 상담 CTA를 눌러 전화 연결을 시도한 횟수입니다."
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.9fr)]">
        <AdminTrendChart
          title={`${dashboard.periodLabel} 날짜별 흐름`}
          description="유입 세션, 상세조회, 원문 이동, 상담 클릭을 날짜 단위로 비교합니다."
          items={dashboard.trendPoints}
        />
        <AdminAlertList items={dashboard.alerts} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <AdminInsightList
          title="유입 경로"
          description="어느 채널과 방식으로 학부모가 가장 많이 들어오는지 보여줍니다."
          items={dashboard.sourceMediumBreakdown}
          emptyTitle="아직 유입 경로 데이터가 없습니다."
          emptyDescription="QR, 블로그, 카페, 검색 유입이 쌓이면 여기부터 읽을 수 있습니다."
          valueSuffix="세션"
        />
        <AdminInsightList
          title="QR·UTM 캠페인"
          description="설명회 QR, 외부 링크, 채널별 캠페인 반응을 비교합니다."
          items={dashboard.utmCampaignBreakdown}
          emptyTitle="캠페인 태깅 데이터가 없습니다."
          emptyDescription="UTM이 붙은 유입이 생기면 캠페인별 반응이 표시됩니다."
          valueSuffix="세션"
        />
        <AdminInsightList
          title="첫 랜딩 페이지"
          description="학부모가 어떤 진입 페이지에서 매거진 여정을 시작했는지 확인합니다."
          items={dashboard.landingPageBreakdown}
          emptyTitle="랜딩 페이지 데이터가 없습니다."
          emptyDescription="session_start와 page_view가 쌓이면 진입 페이지 흐름이 보입니다."
          valueSuffix="세션"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <AdminInsightList
          title="학년 관심도"
          description="학년 선택, 콘텐츠 상세 진입, 원문 이동에서 읽힌 학년 반응입니다."
          items={dashboard.gradeBreakdown}
          emptyTitle="학년 관심도 데이터가 없습니다."
          emptyDescription="학부모의 탐색이 늘어나면 어느 학년이 먼저 반응하는지 보입니다."
          valueSuffix="회"
        />
        <AdminInsightList
          title="주제 관심도"
          description="내신, 수능, 특목고, 학습법 등 어떤 주제가 더 반응하는지 보여줍니다."
          items={dashboard.topicBreakdown}
          emptyTitle="주제 관심도 데이터가 없습니다."
          emptyDescription="콘텐츠 상세 진입과 원문 이동이 쌓이면 주제별 반응이 보입니다."
          valueSuffix="회"
        />
        <AdminInsightList
          title="상담 세그먼트"
          description="초등, 중1, 고등관 중 어느 상담 연결이 먼저 반응하는지 확인합니다."
          items={dashboard.consultSegmentBreakdown}
          emptyTitle="상담 세그먼트 클릭이 없습니다."
          emptyDescription="문맥별 상담 CTA가 눌리면 여기에서 세그먼트별 반응을 볼 수 있습니다."
          valueSuffix="회"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <AdminSummaryList
          title="콘텐츠 상세 조회 Top 10"
          description="가장 많이 읽힌 콘텐츠와 그 뒤에 이어진 원문 이동·상담 반응을 함께 확인합니다."
          items={dashboard.topContentViews.map((item) => ({
            label: item.title,
            value: item.views,
            href: item.href,
            meta: `원문 이동 ${item.outboundClicks}회 · 상담 클릭 ${item.consultClicks}회`,
          }))}
          emptyTitle="상세 조회 데이터가 없습니다."
          emptyDescription="콘텐츠 상세 진입이 생기면 우선순위를 여기서 바로 볼 수 있습니다."
          valueLabel="조회"
        />
        <AdminSummaryList
          title="원문 이동률이 높은 콘텐츠"
          description="단순 조회수보다, 읽은 뒤 실제 원문으로 더 이어지는 콘텐츠를 모았습니다."
          items={dashboard.topContentOutboundRates.map((item) => ({
            label: item.title,
            value: item.outboundClicks,
            href: item.href,
            meta: `원문 이동률 ${formatRate(item.rate)} · 상세조회 ${item.views}회`,
          }))}
          emptyTitle="원문 이동률 데이터가 없습니다."
          emptyDescription="상세조회와 원문 이동이 함께 쌓이면 전환력이 높은 콘텐츠가 보입니다."
          valueLabel="원문"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <AdminInsightList
          title="CTA 클릭 순위"
          description="설명회, 상담, 진단 중 어떤 CTA가 더 많이 눌리는지 확인합니다."
          items={dashboard.ctaBreakdown}
          emptyTitle="CTA 클릭 데이터가 없습니다."
          emptyDescription="헤더, 소프트 CTA, 상세 CTA에서 발생한 반응이 여기에 모입니다."
          valueSuffix="회"
        />
        <AdminInsightList
          title="배너 클릭 순위"
          description="운영 중인 배너 중 어떤 안내가 더 주목받는지 보여줍니다."
          items={dashboard.bannerBreakdown}
          emptyTitle="배너 클릭 데이터가 없습니다."
          emptyDescription="배너를 누른 반응이 생기면 어떤 안내가 강한지 비교할 수 있습니다."
          valueSuffix="회"
        />
        <AdminInsightList
          title="배치 위치 반응"
          description="헤더, 하단 CTA, 상세 페이지, 배너 중 어디서 클릭이 더 잘 일어나는지 보여줍니다."
          items={dashboard.placementBreakdown}
          emptyTitle="배치 위치 데이터가 없습니다."
          emptyDescription="외부 이동 이벤트가 쌓이면 위치별 반응을 비교할 수 있습니다."
          valueSuffix="회"
        />
      </div>

      <div className="rounded-[28px] border border-black/6 bg-[linear-gradient(180deg,rgba(244,247,251,0.95),rgba(237,241,247,0.94))] px-5 py-5">
        <p className="text-sm font-semibold tracking-[0.03em] text-text-secondary">운영 메모</p>
        <div className="mt-3 grid gap-3 lg:grid-cols-3">
          <div className="rounded-[24px] bg-white px-4 py-4">
            <p className="text-xs font-semibold text-text-secondary">공개 콘텐츠</p>
            <p className="mt-2 text-2xl font-bold tracking-[-0.03em] text-text-primary">
              {numberFormatter.format(dashboard.totalPublished)}
            </p>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              현재 학부모가 볼 수 있는 공개 콘텐츠 수입니다.
            </p>
          </div>
          <div className="rounded-[24px] bg-white px-4 py-4">
            <p className="text-xs font-semibold text-text-secondary">현재 히어로</p>
            <p className="mt-2 text-lg font-semibold tracking-[-0.02em] text-text-primary">
              {dashboard.heroTitle ?? "미지정"}
            </p>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              홈 첫 화면에서 가장 먼저 학부모를 맞이하는 커버 스토리입니다.
            </p>
          </div>
          <div className="rounded-[24px] bg-white px-4 py-4">
            <p className="text-xs font-semibold text-text-secondary">이번 기간 핵심 판단</p>
            <p className="mt-2 text-sm leading-7 text-text-primary">
              유입이 충분한데 원문 이동이 약하면 콘텐츠 연결 문구를 손보고, 상담 클릭이
              약하면 CTA 위치와 상담 세그먼트를 함께 점검해 주세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
