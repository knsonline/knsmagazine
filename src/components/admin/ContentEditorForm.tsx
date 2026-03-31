"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { createContentAction, updateContentAction } from "@/app/admin/actions";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { GRADES, TOPICS } from "@/constants/taxonomy";
import { prepareThumbnailFile } from "@/lib/storage/thumbnail-image-client";
import {
  THUMBNAIL_ACCEPT_ATTRIBUTE,
  THUMBNAIL_MAX_FILE_SIZE_BYTES,
  THUMBNAIL_TARGET_MAX_DIMENSION,
  extractThumbnailStoragePath,
  getThumbnailValidationError,
} from "@/lib/storage/thumbnails";
import type { ContentItem, Cta } from "@/types/content";

interface ContentEditorFormProps {
  content?: ContentItem;
  ctas: Cta[];
  footerAction?: ReactNode;
}

function SubmitButton({ hasContent, disabled }: { hasContent: boolean; disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-cta-primary px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "저장 중..." : hasContent ? "콘텐츠 수정하기" : "새 콘텐츠 등록하기"}
    </button>
  );
}

export function ContentEditorForm({ content, ctas, footerAction }: ContentEditorFormProps) {
  const action = content ? updateContentAction.bind(null, content.id) : createContentAction;
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);

  return (
    <form action={action} className="card-surface space-y-6 p-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-primary" htmlFor="title">
            제목
          </label>
          <input
            id="title"
            name="title"
            required
            defaultValue={content?.title}
            className="min-h-12 w-full rounded-2xl border border-black/10 bg-ivory px-4 outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-primary" htmlFor="external_url">
            외부 링크 URL
          </label>
          <input
            id="external_url"
            name="external_url"
            type="url"
            required
            defaultValue={content?.externalUrl}
            className="min-h-12 w-full rounded-2xl border border-black/10 bg-ivory px-4 outline-none"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-text-primary" htmlFor="summary">
          요약
        </label>
        <textarea
          id="summary"
          name="summary"
          rows={4}
          defaultValue={content?.summary}
          className="w-full rounded-2xl border border-black/10 bg-ivory px-4 py-3 outline-none"
        />
      </div>

      <ImageUploader
        initialUrl={content?.thumbnailUrlRaw}
        onUploadingChange={setIsUploadingThumbnail}
        uploadEndpoint="/api/admin/uploads/thumbnails"
        fileInputId="thumbnail_file"
        assetName="썸네일 이미지"
        acceptAttribute={THUMBNAIL_ACCEPT_ATTRIBUTE}
        acceptDisplayLabel="JPG, PNG, WEBP"
        maxFileSizeBytes={THUMBNAIL_MAX_FILE_SIZE_BYTES}
        targetMaxDimension={THUMBNAIL_TARGET_MAX_DIMENSION}
        emptyPreviewMessage="업로드한 썸네일이 여기에서 미리 보여요."
        replaceHintMessage="수정 화면에서는 새 파일을 올린 뒤 저장하면 기존 썸네일이 자동으로 교체됩니다."
        fieldNames={{
          url: "thumbnail_url",
          storagePath: "thumbnail_storage_path",
          previousStoragePath: "previous_thumbnail_storage_path",
        }}
        extractStoragePath={extractThumbnailStoragePath}
        validateFile={getThumbnailValidationError}
        prepareFile={prepareThumbnailFile}
      />

      <div className="grid gap-6 xl:grid-cols-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-primary" htmlFor="grade">
            학년
          </label>
          <select
            id="grade"
            name="grade"
            defaultValue={content?.grade}
            className="min-h-12 w-full rounded-2xl border border-black/10 bg-ivory px-4 outline-none"
          >
            {GRADES.map((grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-primary" htmlFor="topic">
            주제
          </label>
          <select
            id="topic"
            name="topic"
            defaultValue={content?.topic}
            className="min-h-12 w-full rounded-2xl border border-black/10 bg-ivory px-4 outline-none"
          >
            {TOPICS.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-primary" htmlFor="content_type">
            콘텐츠 타입
          </label>
          <select
            id="content_type"
            name="content_type"
            defaultValue={content?.contentType}
            className="min-h-12 w-full rounded-2xl border border-black/10 bg-ivory px-4 outline-none"
          >
            <option value="글">글</option>
            <option value="영상">영상</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-primary" htmlFor="cta_id">
            CTA 연결
          </label>
          <select
            id="cta_id"
            name="cta_id"
            defaultValue={content?.ctaId ?? ""}
            className="min-h-12 w-full rounded-2xl border border-black/10 bg-ivory px-4 outline-none"
          >
            <option value="">연결 안 함</option>
            {ctas.map((cta) => (
              <option key={cta.id} value={cta.id}>
                {cta.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <label className="flex min-h-11 items-center gap-3 rounded-2xl bg-ivory px-4 text-sm font-semibold text-text-primary">
          <input name="is_published" type="checkbox" defaultChecked={content?.isPublished} />
          공개
        </label>
        <label className="flex min-h-11 items-center gap-3 rounded-2xl bg-ivory px-4 text-sm font-semibold text-text-primary">
          <input name="is_featured" type="checkbox" defaultChecked={content?.isFeatured} />
          홈 추천
        </label>
        <label className="flex min-h-11 items-center gap-3 rounded-2xl bg-ivory px-4 text-sm font-semibold text-text-primary">
          <input name="is_hero" type="checkbox" defaultChecked={content?.isHero} />
          대표 콘텐츠
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton hasContent={Boolean(content)} disabled={isUploadingThumbnail} />
        {footerAction}
        {isUploadingThumbnail ? (
          <p className="text-sm text-warning">썸네일 업로드가 끝난 뒤 저장할 수 있어요.</p>
        ) : null}
        {content ? (
          <p className="text-sm text-text-secondary">퍼블릭 경로: /contents/{content.slug}</p>
        ) : null}
      </div>
    </form>
  );
}
