import type { ReactNode } from "react";
import { createContentAction, updateContentAction } from "@/app/admin/actions";
import { GRADES, TOPICS } from "@/constants/taxonomy";
import type { ContentItem, Cta } from "@/types/content";

interface ContentEditorFormProps {
  content?: ContentItem;
  ctas: Cta[];
  footerAction?: ReactNode;
}

export function ContentEditorForm({ content, ctas, footerAction }: ContentEditorFormProps) {
  const action = content ? updateContentAction.bind(null, content.id) : createContentAction;

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

      <div className="space-y-2">
        <label className="text-sm font-semibold text-text-primary" htmlFor="thumbnail_url">
          썸네일 이미지 URL
        </label>
        <input
          id="thumbnail_url"
          name="thumbnail_url"
          type="url"
          defaultValue={content?.thumbnailUrl}
          className="min-h-12 w-full rounded-2xl border border-black/10 bg-ivory px-4 outline-none"
        />
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
          대표 콘텐츠
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-cta-primary px-5 text-sm font-semibold text-white"
        >
          {content ? "콘텐츠 저장하기" : "새 콘텐츠 등록하기"}
        </button>
        {footerAction}
        {content ? (
          <p className="text-sm text-text-secondary">퍼블릭 경로: /contents/{content.slug}</p>
        ) : null}
      </div>
    </form>
  );
}
