"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";

interface CollectionEditorFormProps {
  action: (formData: FormData) => void;
  submitLabel: string;
  defaultName?: string;
  defaultVisible?: boolean;
  defaultSortOrder?: number;
  selectedContentIds?: string[];
  footerAction?: ReactNode;
  contentOptions: Array<{
    id: string;
    title: string;
    grade: string;
    topic: string;
  }>;
}

export function CollectionEditorForm({
  action,
  submitLabel,
  defaultName,
  defaultVisible,
  defaultSortOrder,
  selectedContentIds = [],
  footerAction,
  contentOptions,
}: CollectionEditorFormProps) {
  const [query, setQuery] = useState("");

  const filteredOptions = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return contentOptions.filter((option) => {
      if (!normalized) {
        return true;
      }

      return `${option.title} ${option.grade} ${option.topic}`.toLowerCase().includes(normalized);
    });
  }, [contentOptions, query]);

  return (
    <form action={action} className="space-y-4 rounded-3xl border border-black/6 bg-white p-5">
      <div className="grid gap-4 xl:grid-cols-[1fr_140px]">
        <div>
          <label className="mb-2 block text-sm font-semibold text-text-primary">컬렉션 이름</label>
          <input
            name="name"
            defaultValue={defaultName}
            required
            className="min-h-12 w-full rounded-2xl border border-black/10 bg-ivory px-4 outline-none"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-text-primary">정렬 순서</label>
          <input
            name="sort_order"
            type="number"
            defaultValue={defaultSortOrder ?? 0}
            className="min-h-12 w-full rounded-2xl border border-black/10 bg-ivory px-4 outline-none"
          />
        </div>
      </div>

      <label className="flex min-h-11 items-center gap-3 text-sm font-semibold text-text-primary">
        <input name="is_visible_home" type="checkbox" defaultChecked={defaultVisible} />
        홈에 노출하기
      </label>

      <div className="space-y-3">
        <label className="block text-sm font-semibold text-text-primary">콘텐츠 검색</label>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="제목, 학년, 주제로 검색"
          className="min-h-12 w-full rounded-2xl border border-black/10 bg-ivory px-4 outline-none"
        />
      </div>

      <div className="max-h-72 space-y-2 overflow-y-auto rounded-2xl border border-black/6 bg-ivory/70 p-3">
        {filteredOptions.map((option) => (
          <label
            key={option.id}
            className="flex min-h-11 items-start gap-3 rounded-2xl bg-white px-4 py-3 text-sm"
          >
            <input name="content_ids" type="checkbox" value={option.id} defaultChecked={selectedContentIds.includes(option.id)} />
            <span>
              <span className="block font-semibold text-text-primary">{option.title}</span>
              <span className="mt-1 block text-xs text-text-secondary">
                {option.grade} · {option.topic}
              </span>
            </span>
          </label>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-cta-primary px-5 text-sm font-semibold text-white"
        >
          {submitLabel}
        </button>
        {footerAction}
      </div>
    </form>
  );
}
