export function normalizeMultilineText(value: string | null | undefined): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/\r\n?/g, "\n").trim();
}

export function toNullableMultilineText(value: string | null | undefined): string | null {
  const normalized = normalizeMultilineText(value);
  return normalized.length > 0 ? normalized : null;
}

const DEFAULT_PROTECTED_PHRASES = [
  "무료 상담",
  "무료 학습 상담",
  "학습 상담",
  "상담 신청",
  "설명회 일정",
  "입학설명회 일정",
  "대표 콘텐츠 보기",
  "전체 콘텐츠 보기",
  "전체 콘텐츠 둘러보기",
  "최신 콘텐츠 보기",
  "콘텐츠 검색",
  "원문 보기",
  "영상 보기",
] as const;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function protectPhraseSpacing(
  value: string | null | undefined,
  phrases: readonly string[] = DEFAULT_PROTECTED_PHRASES,
): string {
  if (typeof value !== "string" || value.length === 0) {
    return "";
  }

  return [...phrases]
    .sort((left, right) => right.length - left.length)
    .reduce((result, phrase) => {
      const protectedPhrase = phrase.replaceAll(" ", "\u00A0");
      return result.replace(new RegExp(escapeRegExp(phrase), "g"), protectedPhrase);
    }, value);
}
