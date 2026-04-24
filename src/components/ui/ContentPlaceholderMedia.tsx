import { CONTENT_THUMBNAIL_ASPECT_CLASS } from "@/constants/media";
import type { ContentItem } from "@/types/content";

type ContentVisualVariant = "article" | "video" | "announcement";
type ContentPlaceholderTone = "light" | "dark";
type ContentPlaceholderSize = "default" | "hero";

type PlaceholderContent = Pick<ContentItem, "contentType">;

interface ContentPlaceholderMediaProps {
  content: PlaceholderContent;
  tone?: ContentPlaceholderTone;
  size?: ContentPlaceholderSize;
  className?: string;
  variant?: ContentVisualVariant;
}

function joinClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export function hasRealThumbnail(thumbnailUrlRaw: string | null | undefined): boolean {
  return Boolean(thumbnailUrlRaw && !thumbnailUrlRaw.startsWith("/seed/"));
}

export function getContentVisualVariant(content: PlaceholderContent, variant?: ContentVisualVariant): ContentVisualVariant {
  if (variant) {
    return variant;
  }
  return content.contentType === "영상" ? "video" : "article";
}

function PlaceholderIcon({
  variant,
  size,
}: {
  variant: ContentVisualVariant;
  size: ContentPlaceholderSize;
}) {
  const iconClassName = size === "hero" ? "h-9 w-9" : "h-6 w-6";
  const strokeWidth = size === "hero" ? 1.95 : 1.85;

  if (variant === "article") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={iconClassName}>
        <path
          d="M8 4.75h6l4 4V18a1.75 1.75 0 0 1-1.75 1.75h-8.5A1.75 1.75 0 0 1 6 18V6.5A1.75 1.75 0 0 1 7.75 4.75H8Z"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
        <path d="M14 4.75v4h4" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round" />
        <path
          d="M9 11.5h6M9 15h5"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (variant === "video") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={iconClassName}>
        <rect x="5.5" y="6.5" width="13" height="11" rx="2.75" fill="none" stroke="currentColor" strokeWidth={strokeWidth} />
        <path d="M10.3 10.15v3.7l3.45-1.85-3.45-1.85Z" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={iconClassName}>
      <path
        d="M7.1 19.25h9.8a2 2 0 0 0 2-2V7.4a2 2 0 0 0-2-2H7.1a2 2 0 0 0-2 2v9.85a2 2 0 0 0 2 2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8 9.25h8M8 12h8M8 14.75h5" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

export function ContentPlaceholderMedia({
  content,
  tone = "light",
  size = "default",
  className,
  variant,
}: ContentPlaceholderMediaProps) {
  const visualVariant = getContentVisualVariant(content, variant);
  const isDark = tone === "dark";

  const palette = isDark
    ? {
        root: "border border-white/10 bg-[linear-gradient(180deg,rgba(24,38,67,0.98),rgba(13,23,42,0.98))] text-white",
        glow: "bg-[radial-gradient(circle_at_top,rgba(173,194,226,0.18),transparent_42%)]",
        frame: "border-white/10",
        iconWrap:
          "border-white/14 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.04))] text-white shadow-[0_22px_40px_-30px_rgba(7,14,28,0.75)]",
      }
    : {
        root:
          "border border-[rgba(27,42,74,0.08)] bg-[linear-gradient(180deg,rgba(244,248,252,0.98),rgba(235,241,248,0.98))] text-[#20314d]",
        glow: "bg-[radial-gradient(circle_at_top,rgba(83,111,159,0.16),transparent_42%)]",
        frame: "border-[rgba(27,42,74,0.08)]",
        iconWrap:
          "border-[rgba(27,42,74,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(248,251,255,0.72))] text-[#20314d] shadow-[0_20px_36px_-30px_rgba(27,42,74,0.24)]",
      };

  const frameInset = size === "hero" ? "inset-[8%] rounded-[22px]" : "inset-[10%] rounded-[18px]";
  const iconWrap = size === "hero" ? "h-16 w-16" : "h-12 w-12";

  return (
    <div className={joinClassNames("relative overflow-hidden", CONTENT_THUMBNAIL_ASPECT_CLASS, palette.root, className)}>
      <div className={joinClassNames("absolute inset-0", palette.glow)} />
      <div className={joinClassNames("absolute border opacity-75", frameInset, palette.frame)} />
      <div className="absolute inset-x-[18%] bottom-[14%] h-px bg-current/10" />

      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div
          className={joinClassNames(
            "flex items-center justify-center rounded-full border text-current shadow-[0_16px_28px_-22px_rgba(27,42,74,0.24)]",
            iconWrap,
            palette.iconWrap,
          )}
        >
          <PlaceholderIcon variant={visualVariant} size={size} />
        </div>
      </div>
    </div>
  );
}
