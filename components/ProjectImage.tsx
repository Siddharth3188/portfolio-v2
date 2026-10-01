import Image from "next/image";
import type { ProjectImage as PI } from "@/data/types";

export default function ProjectImage({ image, priority, sizes, className = "" }: { image: PI; priority?: boolean; sizes?: string; className?: string }) {
  return (
    <Image
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      priority={priority}
      sizes={sizes ?? "(min-width:1024px) 60vw, 100vw"}
      unoptimized={image.src.endsWith(".svg")}
      className={`h-auto w-full ${className}`}
    />
  );
}
