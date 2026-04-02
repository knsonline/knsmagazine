import { CONTENT_THUMBNAIL_ASPECT_CLASS } from "@/constants/media";
import { MagazineImage } from "@/components/ui/MagazineImage";

interface ContentThumbnailProps {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  containerClassName?: string;
  imageClassName?: string;
}

function joinClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export function ContentThumbnail({
  src,
  alt,
  sizes,
  priority = false,
  containerClassName,
  imageClassName,
}: ContentThumbnailProps) {
  return (
    <div className={joinClassNames("relative overflow-hidden", CONTENT_THUMBNAIL_ASPECT_CLASS, containerClassName)}>
      <MagazineImage
        src={src}
        alt={alt}
        className={joinClassNames("object-cover", imageClassName)}
        sizes={sizes}
        priority={priority}
      />
    </div>
  );
}
