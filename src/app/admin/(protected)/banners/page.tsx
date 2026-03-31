import { createBannerAction, deleteBannerAction, updateBannerAction } from "@/app/admin/actions";
import { BannerEditorForm } from "@/components/admin/BannerEditorForm";
import { EmptyState } from "@/components/ui/EmptyState";
import { getAdminBanners } from "@/lib/data/admin";

export default async function AdminBannersPage() {
  const banners = await getAdminBanners();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-[-0.03em] text-text-primary">배너 관리</h1>
        <p className="mt-2 text-sm text-text-secondary">
          설명회와 이벤트 배너를 업로드하고 노출 일정을 관리합니다.
        </p>
      </div>

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">새 배너 등록</h2>
          <p className="mt-1 text-sm text-text-secondary">
            이미지 업로드 후 저장하면 홈 배너 영역과 상단 프로모션에서 바로 사용할 수 있습니다.
          </p>
        </div>
        <BannerEditorForm action={createBannerAction} />
      </section>

      {banners.length > 0 ? (
        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">등록된 배너</h2>
            <p className="mt-1 text-sm text-text-secondary">운영 중인 배너를 수정하거나 교체할 수 있습니다.</p>
          </div>

          <div className="grid gap-4">
            {banners.map((banner) => (
              <BannerEditorForm
                key={banner.id}
                banner={banner}
                action={updateBannerAction.bind(null, banner.id)}
                footerAction={
                  <button
                    type="submit"
                    formAction={deleteBannerAction.bind(null, banner.id)}
                    className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-error/20 bg-white px-5 text-sm font-semibold text-error"
                  >
                    배너 삭제
                  </button>
                }
              />
            ))}
          </div>
        </section>
      ) : (
        <EmptyState
          title="등록된 배너가 없습니다."
          description="설명회나 이벤트 배너를 등록해 홈 노출을 시작해 보세요."
        />
      )}
    </div>
  );
}
