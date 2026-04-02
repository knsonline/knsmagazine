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
