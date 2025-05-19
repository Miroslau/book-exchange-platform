"use client";

import React, { ChangeEvent, FC, useRef } from "react";
import Image, { ImageProps } from "next/image";

interface UploadImageProps extends ImageProps {
  handleSubmit: (file: File | Blob) => void;
}

const UploadImage: FC<UploadImageProps> = ({
  src,
  alt,
  width,
  height,
  priority,
  handleSubmit,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { target } = event;
    const { files } = target;

    if (files && files.length > 0) {
      handleSubmit(files[0]);
    }
  };

  return (
    <div>
      <Image
        className="cursor-pointer rounded-[50%]"
        src={src}
        alt={alt}
        priority={priority}
        width={width}
        height={height}
        onClick={handleClick}
      />
      <input
        onChange={handleChange}
        style={{ display: "none" }}
        type="file"
        accept="image/*"
        ref={fileInputRef}
      />
    </div>
  );
};

export default UploadImage;
