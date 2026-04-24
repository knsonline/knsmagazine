import { createCtaAction, deleteCtaAction, updateCtaAction } from "@/app/admin/actions";
import { EmptyState } from "@/components/ui/EmptyState";
import { getAdminCtas } from "@/lib/data/admin";

export default async function AdminCtasPage() {
  const ctas = await getAdminCtas();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-[-0.03em] text-text-primary">CTA 관리</h1>
        <p className="mt-2 text-sm text-text-secondary">
          상담 신청, 설명회 등의 행동 유도(Call-to-Action) 버튼을 관리합니다.
        </p>
      </div>

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">새 CTA 등록</h2>
        </div>
        <form action={createCtaAction} className="card-surface grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-4">
          <input
            name="label"
            required
            placeholder="버튼 문구 (예: 고등관 상담 전화)"
            className="min-h-12 rounded-2xl border border-black/10 bg-ivory px-4 outline-none"
          />
          <input
            name="url"
            required
            placeholder="연결 URL (예: tel:02-1234-5678 또는 https://...)"
            className="min-h-12 rounded-2xl border border-black/10 bg-ivory px-4 outline-none"
          />
          <select
            name="kind"
            defaultValue="consult"
            className="min-h-12 rounded-2xl border border-black/10 bg-ivory px-4 outline-none"
          >
            <option value="consult">상담 연결</option>
            <option value="external">외부 안내</option>
          </select>
          <select
            name="consult_segment"
            defaultValue=""
            className="min-h-12 rounded-2xl border border-black/10 bg-ivory px-4 outline-none"
          >
            <option value="">상담 세그먼트 없음</option>
            <option value="초등">초등</option>
            <option value="중1">중1</option>
            <option value="고등관">고등관</option>
          </select>
          <button
            type="submit"
            className="md:col-span-2 xl:col-span-4 inline-flex min-h-12 items-center justify-center rounded-2xl bg-cta-primary px-5 text-sm font-semibold text-white"
          >
            CTA 추가
          </button>
        </form>
      </section>

      {ctas.length > 0 ? (
        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">등록된 CTA</h2>
          </div>

          <div className="grid gap-4">
            {ctas.map((cta) => (
              <form
                key={cta.id}
                action={updateCtaAction.bind(null, cta.id)}
                className="card-surface grid gap-4 p-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)_180px_180px_180px_auto_auto]"
              >
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-text-secondary">문구</label>
                  <input
                    name="label"
                    defaultValue={cta.label}
                    required
                    className="min-h-12 rounded-2xl border border-black/10 bg-ivory px-4 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-text-secondary">URL</label>
                  <input
                    name="url"
                    defaultValue={cta.url}
                    required
                    className="min-h-12 rounded-2xl border border-black/10 bg-ivory px-4 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-text-secondary">종류</label>
                  <select
                    name="kind"
                    defaultValue={cta.kind}
                    className="min-h-12 rounded-2xl border border-black/10 bg-ivory px-4 outline-none"
                  >
                    <option value="consult">상담 연결</option>
                    <option value="external">외부 안내</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-text-secondary">상담 세그먼트</label>
                  <select
                    name="consult_segment"
                    defaultValue={cta.consultSegment ?? ""}
                    className="min-h-12 rounded-2xl border border-black/10 bg-ivory px-4 outline-none"
                  >
                    <option value="">세그먼트 없음</option>
                    <option value="초등">초등</option>
                    <option value="중1">중1</option>
                    <option value="고등관">고등관</option>
                  </select>
                </div>
                <div className="flex min-h-12 items-center rounded-2xl bg-ivory px-4 text-sm text-text-secondary">
                  사용 중인 콘텐츠 {cta.usageCount}개
                </div>
                <button
                  type="submit"
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-black/10 bg-white px-5 text-sm font-semibold text-text-primary"
                >
                  수정
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
        </section>
      ) : (
        <EmptyState title="등록된 CTA가 없습니다." description="새로운 CTA를 등록해 보세요." />
      )}
    </div>
  );
}
