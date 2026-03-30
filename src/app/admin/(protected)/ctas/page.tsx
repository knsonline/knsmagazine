import { createCtaAction, deleteCtaAction, updateCtaAction } from "@/app/admin/actions";
import { EmptyState } from "@/components/ui/EmptyState";
import { getAdminCtas } from "@/lib/data/admin";

export default async function AdminCtasPage() {
  const ctas = await getAdminCtas();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-[-0.03em] text-text-primary">CTA 관리</h1>
        <p className="mt-2 text-sm text-text-secondary">문구와 링크를 정리하고 연결 상태를 확인합니다.</p>
      </div>

      <form action={createCtaAction} className="card-surface grid gap-4 p-5 xl:grid-cols-[1fr_1fr_auto]">
        <input
          name="label"
          required
          placeholder="무료 학습 상담 신청하기"
          className="min-h-12 rounded-2xl border border-black/10 bg-ivory px-4 outline-none"
        />
        <input
          name="url"
          required
          placeholder="https://example.com"
          className="min-h-12 rounded-2xl border border-black/10 bg-ivory px-4 outline-none"
        />
        <button
          type="submit"
          className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-cta-primary px-5 text-sm font-semibold text-white"
        >
          CTA 추가
        </button>
      </form>

      {ctas.length > 0 ? (
        <div className="grid gap-4">
          {ctas.map((cta) => (
            <form
              key={cta.id}
              action={updateCtaAction.bind(null, cta.id)}
              className="card-surface grid gap-4 p-5 xl:grid-cols-[1fr_1fr_120px_auto_auto]"
            >
              <input
                name="label"
                defaultValue={cta.label}
                className="min-h-12 rounded-2xl border border-black/10 bg-ivory px-4 outline-none"
              />
              <input
                name="url"
                defaultValue={cta.url}
                className="min-h-12 rounded-2xl border border-black/10 bg-ivory px-4 outline-none"
              />
              <div className="flex min-h-12 items-center rounded-2xl bg-ivory px-4 text-sm text-text-secondary">
                사용 {cta.usageCount ?? 0}
              </div>
              <button
                type="submit"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-black/10 bg-white px-5 text-sm font-semibold text-text-primary"
              >
                저장
              </button>
              <button
                type="submit"
                formAction={deleteCtaAction.bind(null, cta.id)}
                className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-error/20 bg-white px-5 text-sm font-semibold text-error"
              >
                삭제
              </button>
            </form>
          ))}
        </div>
      ) : (
        <EmptyState title="등록된 CTA가 없습니다." description="먼저 기본 CTA를 하나 추가해 주세요." />
      )}
    </div>
  );
}
