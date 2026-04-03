import { notFound } from "next/navigation";
import { deleteContentAction } from "@/app/admin/actions";
import { ContentEditorForm } from "@/components/admin/ContentEditorForm";
import { getAdminContentById, getAdminCtas } from "@/lib/data/admin";

interface AdminContentEditPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    duplicated?: string;
  }>;
}

export default async function AdminContentEditPage({ params, searchParams }: AdminContentEditPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const [content, ctas] = await Promise.all([
    getAdminContentById(decodeURIComponent(resolvedParams.id)),
    getAdminCtas(),
  ]);

  if (!content) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-[-0.03em] text-text-primary">콘텐츠 수정</h1>
        <p className="mt-2 text-sm text-text-secondary">슬러그는 ID 앞 8자리로 자동 생성됩니다.</p>
      </div>
      {resolvedSearchParams?.duplicated === "1" ? (
        <div className="rounded-2xl border border-warning/20 bg-warning/10 px-4 py-4 text-sm text-text-primary">
          <p className="font-semibold">복제본 초안을 만들었습니다.</p>
          <p className="mt-2 text-text-secondary">
            외부 링크는 비워 두었고, 공개 상태·홈 추천·히어로 지정은 모두 해제했습니다. 제목과 썸네일, 요약/본문을 확인한 뒤 저장해 주세요.
          </p>
        </div>
      ) : null}
      <ContentEditorForm
        content={content}
        ctas={ctas}
        footerAction={
          <button
            type="submit"
            formAction={deleteContentAction.bind(null, content.id)}
            className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-error/20 bg-white px-5 text-sm font-semibold text-error"
          >
            콘텐츠 삭제
          </button>
        }
      />
    </div>
  );
}
