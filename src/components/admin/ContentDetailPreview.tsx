"use client";

import { PlainTextContent } from "@/components/ui/PlainTextContent";
import { normalizeMultilineText } from "@/lib/utils/text";

interface ContentDetailPreviewProps {
  title: string;
  summary: string;
  body: string;
}

export function ContentDetailPreview({ title, summary, body }: ContentDetailPreviewProps) {
  const normalizedTitle = title.trim();
  const normalizedSummary = normalizeMultilineText(summary);
  const normalizedBody = normalizeMultilineText(body);
  const hasBody = normalizedBody.length > 0;

  return (
    <div className="rounded-[28px] border border-black/8 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-text-primary">상세 화면 미리보기</p>
          <p className="mt-1 text-sm text-text-secondary">입력한 줄바꿈이 실제 상세 페이지에서 보이는 느낌을 바로 확인할 수 있어요.</p>
        </div>
        <span className="rounded-full bg-gold-light px-3 py-1 text-xs font-semibold text-navy">가벼운 미리보기</span>
      </div>

      <div className="mt-4 rounded-[24px] bg-ivory px-5 py-6 sm:px-6">
        <div className="space-y-4 border-b border-black/6 pb-5">
          <p className="text-sm font-semibold text-text-secondary">제목</p>
          <h3 className="text-[28px] font-bold leading-[1.22] tracking-[-0.03em] text-text-primary">
            {normalizedTitle || "제목이 여기에 보입니다."}
          </h3>
          <p className="text-sm font-semibold text-text-secondary">요약</p>
          <p className="whitespace-pre-line text-base leading-8 text-text-secondary">
            {normalizedSummary || "요약은 카드 소개와 상세 상단 설명에 사용됩니다."}
          </p>
        </div>

        <div className="mt-5">
          <p className="text-sm font-semibold text-text-secondary">본문</p>
          {hasBody ? (
            <PlainTextContent
              text={normalizedBody}
              className="mt-3"
              paragraphClassName="text-base leading-8 text-text-primary"
            />
          ) : (
            <p className="mt-3 whitespace-pre-line text-base leading-8 text-text-secondary">
              본문이 비어 있으면 퍼블릭 상세 페이지에서는 요약 중심으로 보여집니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
