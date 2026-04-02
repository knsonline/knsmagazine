"use client";

import type { ChangeEvent, ReactNode } from "react";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { createContentAction, updateContentAction } from "@/app/admin/actions";
import { ContentDetailPreview } from "@/components/admin/ContentDetailPreview";
import { ImageUploader } from "@/components/admin/ImageUploader";
import {
  CONTENT_THUMBNAIL_RECOMMENDED_RATIO,
  CONTENT_THUMBNAIL_RECOMMENDED_SIZE,
  CONTENT_THUMBNAIL_SAFE_AREA_GUIDE,
} from "@/constants/media";
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

const THUMBNAIL_GUIDE_COPY = {
  ratio: `권장 비율 ${CONTENT_THUMBNAIL_RECOMMENDED_RATIO}`,
  size: `권장 해상도 ${CONTENT_THUMBNAIL_RECOMMENDED_SIZE}`,
  safeArea: CONTENT_THUMBNAIL_SAFE_AREA_GUIDE,
};

const CONTENT_FIELD_GUIDE = [
  "제목: 홈과 카드에서 먼저 눈에 띄는 짧고 강한 한 줄",
  "요약: 카드 소개와 상세 상단 설명에 들어가는 1~3문장",
  "본문: 상세 페이지에서 읽히는 설명형 텍스트",
];

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
  const [titlePreview, setTitlePreview] = useState(content?.title ?? "");
  const [summaryPreview, setSummaryPreview] = useState(content?.summary ?? "");
  const [bodyPreview, setBodyPreview] = useState(content?.body ?? "");

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitlePreview(event.target.value);
  };

  const handleSummaryChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setSummaryPreview(event.target.value);
  };

  const handleBodyChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setBodyPreview(event.target.value);
  };

  return (
    <form action={action} className="card-surface space-y-6 p-6">
      <div className="rounded-2xl bg-ivory px-4 py-4 text-sm text-text-secondary">
        <p className="font-semibold text-text-primary">입력 역할 가이드</p>
        <div className="mt-2 space-y-2">
          {CONTENT_FIELD_GUIDE.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-primary" htmlFor="title">
            제목
          </label>
          <input
            id="title"
            name="title"
            required
            value={titlePreview}
            onChange={handleTitleChange}
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
        <p className="text-sm text-text-secondary">카드와 상세 상단에 노출되는 소개 문구입니다. 1~3문장 정도가 가장 안정적입니다.</p>
        <textarea
          id="summary"
          name="summary"
          rows={4}
          value={summaryPreview}
          onChange={handleSummaryChange}
          className="w-full rounded-2xl border border-black/10 bg-ivory px-4 py-3 outline-none"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-primary" htmlFor="body">
            본문
          </label>
          <p className="text-sm text-text-secondary">
            긴 설명형 텍스트를 입력하는 영역입니다. Enter 줄바꿈과 빈 줄이 상세 페이지에서도 그대로 보존됩니다.
          </p>
          <textarea
            id="body"
            name="body"
            rows={16}
            value={bodyPreview}
            onChange={handleBodyChange}
            className="min-h-[360px] w-full resize-y rounded-3xl border border-black/10 bg-ivory px-4 py-4 text-base leading-8 outline-none"
            placeholder={"예시)\n입시 변화 포인트를 먼저 정리해 주세요.\n\n학부모가 바로 이해할 수 있는 설명을 문단별로 나누어 작성하면 읽기 편합니다."}
          />
        </div>

        <ContentDetailPreview title={titlePreview} summary={summaryPreview} body={bodyPreview} />
      </div>

      <ImageUploader
        initialUrl={content?.thumbnailUrlRaw}
        onUploadingChange={setIsUploadingThumbnail}
        uploadEndpoint="/api/admin/uploads/thumbnails"
        fileInputId="thumbnail_file"
        assetName="콘텐츠 썸네일 이미지"
        acceptAttribute={THUMBNAIL_ACCEPT_ATTRIBUTE}
        acceptDisplayLabel="JPG, PNG, WEBP"
        maxFileSizeBytes={THUMBNAIL_MAX_FILE_SIZE_BYTES}
        targetMaxDimension={THUMBNAIL_TARGET_MAX_DIMENSION}
        emptyPreviewMessage="업로드한 썸네일이 여기에서 미리 보입니다."
        replaceHintMessage="수정 화면에서 새 파일을 저장하면 기존 썸네일은 자동으로 교체됩니다."
        fieldNames={{
          url: "thumbnail_url",
          storagePath: "thumbnail_storage_path",
          previousStoragePath: "previous_thumbnail_storage_path",
        }}
        previewAspectClassName="aspect-video"
        extractStoragePath={extractThumbnailStoragePath}
        validateFile={getThumbnailValidationError}
        prepareFile={prepareThumbnailFile}
      />

      <div className="rounded-2xl bg-ivory px-4 py-4 text-sm text-text-secondary">
        <p className="font-semibold text-text-primary">콘텐츠 썸네일 가이드</p>
        <p className="mt-2">{THUMBNAIL_GUIDE_COPY.ratio}</p>
        <p className="mt-1">{THUMBNAIL_GUIDE_COPY.size}</p>
        <p className="mt-1">{THUMBNAIL_GUIDE_COPY.safeArea}</p>
      </div>

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
          히어로 콘텐츠
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
