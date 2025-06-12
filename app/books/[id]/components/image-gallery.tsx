"use client";

import React, { FC, useState } from "react";
import Image from "next/image";

interface Props {
  images: string[];
}

const ImageGallery: FC<Props> = ({ images }) => {
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className="flex space-x-4">
      <div className="flex flex-col gap-4 overflow-y-auto">
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
      <div className="h-[100%] w-full overflow-hidden rounded-2xl">
        <Image
          className="h-auto max-h-[668px] w-auto rounded-xl"
          quality={100}
          width={0}
          height={0}
          src={mainImage}
          alt="main photo"
          blurDataURL="data:image/svg+xml;base64"
        />
      </div>
    </div>
  );
};

export default ImageGallery;
