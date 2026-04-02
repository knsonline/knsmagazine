import type { ContentType } from "@/types/content";

interface ContentTypeInlineProps {
  contentType: ContentType;
  className?: string;
}

function joinClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

function DocumentIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4">
      <path
        d="M6 3.75h5.5L15 7.25v8A1.75 1.75 0 0 1 13.25 17h-7.5A1.75 1.75 0 0 1 4 15.25v-9.5A1.75 1.75 0 0 1 5.75 4H6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M11.5 3.75v3.5H15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M7 10h5.5M7 13h4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4">
      <path d="M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 7.25v5.5l4.5-2.75L8 7.25Z" fill="currentColor" />
    </svg>
  );
}

export function ContentTypeInline({ contentType, className }: ContentTypeInlineProps) {
  return (
    <span className={joinClassNames("inline-flex items-center gap-1.5", className)}>
      {contentType === "영상" ? <VideoIcon /> : <DocumentIcon />}
      <span>{contentType}</span>
    </span>
  );
}
