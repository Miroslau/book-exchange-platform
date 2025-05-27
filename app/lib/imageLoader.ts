"use client";

import { ImageLoaderProps } from "next/image";

export default function imageLoader({ src, width, quality }: ImageLoaderProps) {
  if (src.includes("cloudinary.com")) {
    return `${src}?im=Resize=(${3000});Crop, rect=(0,0,2560,1441)`;
  }

  return `${src}?w=${width}&q=${quality || 75}`;
}
