import { CONTENT_THUMBNAIL_ASPECT_CLASS } from "@/constants/media";
import type { ContentItem } from "@/types/content";

type ContentVisualVariant = "article" | "video" | "announcement";
type ContentPlaceholderTone = "light" | "dark";
type ContentPlaceholderSize = "default" | "hero";

type PlaceholderContent = Pick<ContentItem, "title" | "summary" | "topic" | "contentType">;

interface ContentPlaceholderMediaProps {
  content: PlaceholderContent;
  tone?: ContentPlaceholderTone;
  size?: ContentPlaceholderSize;
  className?: string;
  variant?: ContentVisualVariant;
}

const VARIANT_COPY = {
  article: {
    label: "글 콘텐츠",
    tag: "ARTICLE",
  },
  video: {
    label: "영상 콘텐츠",
    tag: "VIDEO",
  },
  announcement: {
    label: "안내 콘텐츠",
    tag: "GUIDE",
  },
} satisfies Record<ContentVisualVariant, { label: string; tag: string }>;

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
  const iconClassName = size === "hero" ? "h-7 w-7" : "h-5 w-5";

  if (variant === "article") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={iconClassName}>
        <path
          d="M8 4.75h6l4 4V18a1.75 1.75 0 0 1-1.75 1.75h-8.5A1.75 1.75 0 0 1 6 18V6.5A1.75 1.75 0 0 1 7.75 4.75H8Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.55"
          strokeLinejoin="round"
        />
        <path d="M14 4.75v4h4" fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinejoin="round" />
        <path d="M9 12h6M9 15h4.5" fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" />
      </svg>
    );
  }

  if (variant === "video") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={iconClassName}>
        <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.55" />
        <path d="M10.25 9v6l4.75-3-4.75-3Z" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={iconClassName}>
      <path
        d="M7.25 4.75v2M16.75 4.75v2M5.75 9.25h12.5M7.25 3.75v1M16.75 3.75v1M7.1 19.25h9.8a2 2 0 0 0 2-2V7.4a2 2 0 0 0-2-2H7.1a2 2 0 0 0-2 2v9.85a2 2 0 0 0 2 2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9.2 12.2h5.6v3.2H9.2z" fill="currentColor" opacity="0.16" />
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
  const copy = VARIANT_COPY[visualVariant];
  const isDark = tone === "dark";

  const palette = isDark
    ? {
        root:
          "border border-white/10 bg-[linear-gradient(180deg,rgba(24,38,67,0.96),rgba(12,22,42,0.98))] text-white",
        halo:
          "bg-[radial-gradient(circle_at_top_left,rgba(170,192,225,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(103,126,171,0.12),transparent_32%)]",
        iconWrap: "border-white/12 bg-white/6 text-white/94",
        label: "border border-white/12 bg-white/10 text-white/84",
        brand: "text-white/50",
      }
    : {
        root:
          "border border-[rgba(27,42,74,0.08)] bg-[linear-gradient(180deg,rgba(241,246,252,0.98),rgba(231,238,247,0.96))] text-[#20314d]",
        halo:
          "bg-[radial-gradient(circle_at_top_left,rgba(90,117,164,0.12),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(150,171,203,0.12),transparent_34%)]",
        iconWrap: "border-[rgba(27,42,74,0.08)] bg-[rgba(255,255,255,0.38)] text-[#20314d]",
        label: "border border-[rgba(255,255,255,0.78)] bg-[rgba(255,255,255,0.72)] text-[#465873]",
        brand: "text-[#5a6d89]",
      };

  const frameInset = size === "hero" ? "inset-[8%]" : "inset-[9%]";
  const iconWrap = size === "hero" ? "h-14 w-14" : "h-10 w-10";
  const labelClassName = size === "hero" ? "px-3.5 py-1.5 text-xs sm:text-[13px]" : "px-3 py-1 text-[11px]";

  return (
    <div className={joinClassNames("relative overflow-hidden", CONTENT_THUMBNAIL_ASPECT_CLASS, palette.root, className)}>
      <div className={joinClassNames("absolute inset-0", palette.halo)} />
      <div className={joinClassNames("absolute rounded-[18px] border border-current/8 opacity-70", frameInset)} />

      <span className={joinClassNames("absolute right-3 top-3 z-10 text-[10px] font-semibold tracking-[0.16em]", palette.brand)}>
        KNS
      </span>

      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div
          className={joinClassNames(
            "flex items-center justify-center rounded-full border text-current shadow-[0_16px_28px_-22px_rgba(27,42,74,0.24)]",
            palette.iconWrap,
            iconWrap,
          )}
        >
          <PlaceholderIcon variant={visualVariant} size={size} />
        </div>
      </div>

      <div className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2">
        <span className={joinClassNames("inline-flex items-center rounded-full font-semibold whitespace-nowrap", palette.label, labelClassName)}>
          {copy.label}
        </span>
      </div>

      <span className={joinClassNames("absolute left-3 top-3 z-10 text-[10px] font-semibold tracking-[0.14em]", palette.brand)}>
        {copy.tag}
      </span>
    </div>
  );
}
