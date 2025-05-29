"use client";

import React, { FC, useState } from "react";
import Image from "next/image";

interface Props {
  images: string[];
}

const ImageGallery: FC<Props> = ({ images }) => {
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className="flex flex-col space-y-4">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl shadow-lg">
        <Image
          className="rounded-xl object-cover"
          quality={100}
          width={0}
          height={0}
          src={mainImage}
          alt="main photo"
          sizes="100vw"
          blurDataURL="data:image/svg+xml;base64"
          style={{ width: "100%", height: "auto" }}
        />
      </div>
      <div className="flex flex-wrap gap-[14px] space-x-2 overflow-x-auto">
        {images.map((image, index) => (
          <Image
            onClick={setMainImage.bind(this, image)}
            quality={100}
            key={index}
            src={image}
            alt="image"
            width={0}
            height={0}
            className={`cursor-pointer rounded-[8px] border-2 object-cover ${image === mainImage ? "border-primary-netural-palette-500" : "border-transparent"}`}
            style={{
              width: "148px",
              height: "124px",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
