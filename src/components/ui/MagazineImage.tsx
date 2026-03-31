/* eslint-disable @next/next/no-img-element */

import Image from "next/image";
import { isRemoteImageUrl } from "@/lib/storage/images";

interface MagazineImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export function MagazineImage({
  src,
  alt,
  className,
  sizes,
  priority = false,
}: MagazineImageProps) {
  if (isRemoteImageUrl(src)) {
    return (
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 h-full w-full ${className ?? ""}`}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        sizes={sizes}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={className}
      sizes={sizes}
      priority={priority}
    />
  );
}
