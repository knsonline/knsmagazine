import { normalizeMultilineText } from "@/lib/utils/text";

interface PlainTextContentProps {
  text: string;
  className?: string;
  paragraphClassName?: string;
}

function joinClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export function PlainTextContent({
  text,
  className,
  paragraphClassName,
}: PlainTextContentProps) {
  const normalized = normalizeMultilineText(text);

  if (!normalized) {
    return null;
  }

  const paragraphs = normalized.split(/\n{2,}/).filter(Boolean);

  return (
    <div className={joinClassNames("space-y-5", className)}>
      {paragraphs.map((paragraph, index) => (
        <p
          key={`${index}-${paragraph.slice(0, 24)}`}
          className={joinClassNames("text-keep text-pretty whitespace-pre-line", paragraphClassName)}
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}
