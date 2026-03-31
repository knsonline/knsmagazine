import { notFound } from "next/navigation";
import { deleteContentAction } from "@/app/admin/actions";
import { ContentEditorForm } from "@/components/admin/ContentEditorForm";
import { getAdminContentById, getAdminCtas } from "@/lib/data/admin";

interface AdminContentEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminContentEditPage({ params }: AdminContentEditPageProps) {
  const resolvedParams = await params;
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
