"use client";

import React, { FC, useState } from "react";
import Image from "next/image";
import { BookImage } from "@/app/types/book";

interface Props {
  images: BookImage[];
}

const ImageGallery: FC<Props> = ({ images }) => {
  console.log(images);
  const [mainImage, setMainImage] = useState<BookImage | null>(
    images && images.length > 0 ? images[0] : null,
  );

  if (!images || images.length === 0) {
    return (
      <div className="flex h-[668px] w-full items-center justify-center rounded-2xl bg-gray-200">
        <div className="text-center">
          <div className="mb-2 text-lg text-gray-500">📷</div>
          <span className="text-sm text-gray-500">No images available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex space-x-4">
      <div className="scrollbar-hidden flex h-[668px] flex-col gap-4 overflow-y-auto">
        {images.map((imageObj, index) => (
          <Image
            onClick={() => setMainImage(imageObj)}
            quality={100}
            key={imageObj.id}
            src={imageObj.url}
            alt={`Image ${index + 1}`}
            width={148}
            height={120}
            className={`cursor-pointer rounded-[8px] border-2 object-cover transition-opacity hover:opacity-80 ${
              mainImage && imageObj.id === mainImage.id
                ? "border-primary-netural-palette-500"
                : "border-transparent hover:border-gray-300"
            }`}
            sizes="148px"
          />
        ))}
      </div>
      <div className="h-[100%] w-full overflow-hidden rounded-2xl">
        {mainImage ? (
          <Image
            className="h-full w-full rounded-xl object-cover"
            quality={100}
            width={600}
            height={668}
            src={mainImage.url}
            alt="Main photo"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjY2OCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjY2NjIi8+PC9zdmc+"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 600px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-xl bg-gray-200">
            <span className="text-gray-500">Loading...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGallery;
