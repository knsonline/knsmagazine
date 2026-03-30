import { createCollectionAction, deleteCollectionAction, updateCollectionAction } from "@/app/admin/actions";
import { CollectionEditorForm } from "@/components/admin/CollectionEditorForm";
import { EmptyState } from "@/components/ui/EmptyState";
import { getAdminCollections, getSelectableContents } from "@/lib/data/admin";

export default async function AdminCollectionsPage() {
  const [collections, contentOptions] = await Promise.all([getAdminCollections(), getSelectableContents()]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-[-0.03em] text-text-primary">컬렉션 관리</h1>
        <p className="mt-2 text-sm text-text-secondary">이름을 정하고 콘텐츠를 골라 홈 큐레이션 묶음을 만듭니다.</p>
      </div>

      <CollectionEditorForm action={createCollectionAction} submitLabel="컬렉션 추가" contentOptions={contentOptions} />

      {collections.length > 0 ? (
        <div className="space-y-6">
          {collections.map((collection) => (
            <div key={collection.id} className="space-y-3">
              <div>
                <h2 className="text-xl font-semibold text-text-primary">{collection.name}</h2>
                <p className="mt-1 text-sm text-text-secondary">
                  포함 콘텐츠 {collection.items.length}개 · 홈 노출 {collection.isVisibleHome ? "켜짐" : "꺼짐"}
                </p>
              </div>
              <CollectionEditorForm
                action={updateCollectionAction.bind(null, collection.id)}
                submitLabel="컬렉션 저장"
                defaultName={collection.name}
                defaultVisible={collection.isVisibleHome}
                defaultSortOrder={collection.sortOrder}
                selectedContentIds={collection.items.map((item) => item.id)}
                contentOptions={contentOptions}
                footerAction={
                  <button
                    type="submit"
                    formAction={deleteCollectionAction.bind(null, collection.id)}
                    className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-error/20 bg-white px-5 text-sm font-semibold text-error"
                  >
                    컬렉션 삭제
                  </button>
                }
              />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="등록된 컬렉션이 없습니다." description="먼저 첫 번째 주제 컬렉션을 만들어 주세요." />
      )}
    </div>
  );
}
