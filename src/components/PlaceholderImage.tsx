import Image from "next/image";

interface Props {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  rounded?: string;
}

/**
 * Görsel henüz public/images altında yoksa zarif bir gradient placeholder gösterir.
 * Kullanıcı dosyayı koyduğunda otomatik olarak gerçek görsel görünür.
 */
export function PlaceholderImage({
  src,
  alt,
  className = "",
  fill,
  width,
  height,
  sizes,
  priority,
  rounded,
}: Props) {
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-deep)] to-[var(--color-accent-deep)] ${rounded ?? ""} ${className}`}
      style={!fill && width && height ? { aspectRatio: `${width}/${height}` } : undefined}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 grid place-items-center text-white/30 font-serif text-lg"
      >
        Grafta Clinic
      </span>
      {fill ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width ?? 800}
          height={height ?? 600}
          sizes={sizes}
          priority={priority}
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
}
