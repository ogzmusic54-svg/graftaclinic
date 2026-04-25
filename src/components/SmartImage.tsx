"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

const FALLBACK = "/images/placeholder.svg";

/**
 * Next/Image sarmalayıcısı: kaynak dosya yoksa otomatik placeholder.svg gösterir.
 * Kullanıcı public/images altına dosya yerleştirdiğinde otomatik olarak gerçek görsel görünür.
 */
export function SmartImage(props: ImageProps) {
  const [src, setSrc] = useState(props.src);
  return (
    <Image
      {...props}
      src={src}
      onError={() => {
        if (src !== FALLBACK) setSrc(FALLBACK);
      }}
    />
  );
}
