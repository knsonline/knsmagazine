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
        <h1 className="text-3xl font-bold tracking-[-0.03em] text-text-primary">{"\uCF58\uD150\uCE20 \uC218\uC815"}</h1>
        <p className="mt-2 text-sm text-text-secondary">
          {"\uC2AC\uB7EC\uADF8\uB294 ID \uC55E 8\uC790\uB9AC\uB85C \uC790\uB3D9 \uC0DD\uC131\uB429\uB2C8\uB2E4."}
        </p>
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
            {"\uCF58\uD150\uCE20 \uC0AD\uC81C"}
          </button>
        }
      />
    </div>
  );
}
