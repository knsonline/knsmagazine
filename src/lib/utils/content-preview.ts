import type { ContentItem } from "@/types/content";
import { normalizeMultilineText } from "@/lib/utils/text";

function getFirstParagraph(text: string): string {
  return normalizeMultilineText(text).split(/\n{2,}/).find(Boolean) ?? "";
}

function collapseForCard(text: string): string {
  return normalizeMultilineText(text).replace(/\s*\n+\s*/g, " ").replace(/\s{2,}/g, " ").trim();
}

function getPrimaryText(content: Pick<ContentItem, "summary" | "body">): string {
  const summary = normalizeMultilineText(content.summary);

  if (summary) {
    return summary;
  }

  return getFirstParagraph(content.body);
}

export function getHeroDescription(content: Pick<ContentItem, "summary" | "body">): string {
  const lines = getPrimaryText(content)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.slice(0, 2).join("\n");
}

export function getCardDescription(content: Pick<ContentItem, "summary" | "body">): string {
  return collapseForCard(getPrimaryText(content));
}

export function getCompactDescription(content: Pick<ContentItem, "summary" | "body">): string {
  return collapseForCard(getPrimaryText(content));
}
