import { createBannerAction, deleteBannerAction, updateBannerAction } from "@/app/admin/actions";
import { EmptyState } from "@/components/ui/EmptyState";
import { getAdminBanners } from "@/lib/data/admin";

export default async function AdminBannersPage() {
  const banners = await getAdminBanners();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-[-0.03em] text-text-primary">배너 관리</h1>
        <p className="mt-2 text-sm text-text-secondary">설명회와 이벤트 노출 배너를 간단하게 관리합니다.</p>
      </div>

      <form action={createBannerAction} className="card-surface grid gap-4 p-5 xl:grid-cols-5">
        <input
          name="image_url"
          required
          placeholder="이미지 URL"
          className="min-h-12 rounded-2xl border border-black/10 bg-ivory px-4 outline-none xl:col-span-2"
        />
        <input
          name="link_url"
          placeholder="링크 URL"
          className="min-h-12 rounded-2xl border border-black/10 bg-ivory px-4 outline-none"
        />
        <input
          name="starts_at"
          type="date"
          className="min-h-12 rounded-2xl border border-black/10 bg-ivory px-4 outline-none"
        />
        <input
          name="ends_at"
          type="date"
          className="min-h-12 rounded-2xl border border-black/10 bg-ivory px-4 outline-none"
        />
        <label className="flex min-h-12 items-center gap-3 rounded-2xl bg-ivory px-4 text-sm font-semibold text-text-primary">
          <input name="is_active" type="checkbox" defaultChecked />
          활성
        </label>
        <button
          type="submit"
          className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-cta-primary px-5 text-sm font-semibold text-white xl:col-span-5"
        >
          배너 추가
        </button>
      </form>

      {banners.length > 0 ? (
        <div className="grid gap-4">
          {banners.map((banner) => (
            <form
              key={banner.id}
              action={updateBannerAction.bind(null, banner.id)}
              className="card-surface grid gap-4 p-5 xl:grid-cols-5"
            >
              <input
                name="image_url"
                defaultValue={banner.imageUrl}
                className="min-h-12 rounded-2xl border border-black/10 bg-ivory px-4 outline-none xl:col-span-2"
              />
              <input
                name="link_url"
                defaultValue={banner.linkUrl}
                className="min-h-12 rounded-2xl border border-black/10 bg-ivory px-4 outline-none"
              />
              <input
                name="starts_at"
                type="date"
                defaultValue={banner.startsAt ?? ""}
                className="min-h-12 rounded-2xl border border-black/10 bg-ivory px-4 outline-none"
              />
              <input
                name="ends_at"
                type="date"
                defaultValue={banner.endsAt ?? ""}
                className="min-h-12 rounded-2xl border border-black/10 bg-ivory px-4 outline-none"
              />
              <label className="flex min-h-12 items-center gap-3 rounded-2xl bg-ivory px-4 text-sm font-semibold text-text-primary">
                <input name="is_active" type="checkbox" defaultChecked={banner.isActive} />
                활성
              </label>
              <div className="flex flex-wrap gap-3 xl:col-span-5">
                <button
                  type="submit"
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-black/10 bg-white px-5 text-sm font-semibold text-text-primary"
                >
                  저장
                </button>
                <button
                  type="submit"
                  formAction={deleteBannerAction.bind(null, banner.id)}
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-error/20 bg-white px-5 text-sm font-semibold text-error"
                >
                  삭제
                </button>
              </div>
            </form>
          ))}
        </div>
      ) : (
        <EmptyState title="등록된 배너가 없습니다." description="설명회나 이벤트 배너를 추가해 보세요." />
      )}
    </div>
  );
}
