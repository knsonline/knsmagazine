import { ContentEditorForm } from "@/components/admin/ContentEditorForm";
import { getAdminCtas } from "@/lib/data/admin";

export default async function AdminContentNewPage() {
  const ctas = await getAdminCtas();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-[-0.03em] text-text-primary">새 콘텐츠 등록</h1>
        <p className="mt-2 text-sm text-text-secondary">저장하면 퍼블릭 매거진에 바로 반영됩니다.</p>
      </div>
      <ContentEditorForm ctas={ctas} />
    </div>
  );
}
