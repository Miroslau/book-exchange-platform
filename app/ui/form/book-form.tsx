"use client";

import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import BookGenre from "@/app/lib/constants";
import dynamic from "next/dynamic";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { XCircleIcon } from "@heroicons/react/16/solid";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/app/ui/button/button";

interface createBookDTO {
  title: string;
  author: string;
  description: string;
  categories: string[];
  images: string[];
}

const Select = dynamic(
  () => import("react-select").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => null,
  },
);

const FormSchema = z.object({
  title: z.string().min(1, "The title of book is required").max(100),
  author: z.string().min(1, "The author of book is required").max(100),
  description: z.string().min(1, "The description of is required").max(1000),
  categories: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
      }),
    )
    .min(1, "List of genres is required"),
});

const BookForm = () => {
  const [images, setImages] = useState<File[]>([]);
  const router = useRouter();
  const [message, setMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      author: "",
      description: "",
      categories: [],
    },
  });

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const submitForm = async (value: z.infer<typeof FormSchema>) => {
    setLoading(true);
    try {
      const uploadPromises = images.map(async (image) => {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("folderRoot", "Books");
        formData.append("folderName", `${value.title}`);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await uploadResponse.json();

        if (uploadResponse.ok && data.imgUrl) {
          return data.imgUrl;
        } else {
          console.error("Upload failed:", data);
          return null;
        }
      });

      const uploadResults = await Promise.all(uploadPromises);
      const uploadedImageUrls = uploadResults.filter((url) => url !== null);

      console.log("value: ", value);
      const body: createBookDTO = {
        title: value.title,
        author: value.author,
        description: value.description,
        categories: value.categories.map((g: { value: string }) => g.value),
        images: uploadedImageUrls,
      };

      console.log("body: ", body);

      const response = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        router.back();
      }
    } catch (error: unknown) {
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    setMessage("");
    const files = event.dataTransfer.files;
    const validImageTypes = ["image/gif", "image/jpeg", "image/png"];

    const newImages: File[] = [];

    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      if (validImageTypes.includes(file.type)) {
        newImages.push(file);
      } else {
        setMessage("only images accepted");
      }
    }

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleImages = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage("");

    const image = event.target.files!;

    for (let index = 0; index < image.length; index++) {
      const fileType = image[index]["type"];
      const validImageTypes = ["image/gif", "image/jpeg", "image/png"];

      if (validImageTypes.includes(fileType)) {
        setImages([...images, image[index]]);
      } else {
        setMessage("only images accepted");
      }
    }
  };

  const removeImage = (imageName: string) => {
    setImages(images.filter((image) => image.name !== imageName));
  };

  useEffect(() => {
    console.log("errors: ", errors);
  }, [errors]);

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <div className="grid grid-cols-5 grid-rows-5 gap-10">
        <div className="col-span-2">
          <label
            htmlFor="title"
            className="mb-2 block text-[16px] font-semibold"
          >
            Title
          </label>
          <input
            {...register("title", { required: true })}
            id="title"
            type="text"
            placeholder="Enter a title"
            autoComplete="off"
            className="peer bg-athens-gray placeholder:text-secondary-300 block w-full rounded-md py-[9px] pl-5 text-sm outline-none"
          />
          {errors?.title && (
            <p className="text-error-600 mt-2 text-sm">
              {errors?.title?.message}
            </p>
          )}
        </div>
        <div className="col-span-2 col-start-1 row-start-2">
          <label
            htmlFor="author"
            className="mb-2 block text-[16px] font-semibold"
          >
            Author
          </label>
          <input
            {...register("author", { required: true })}
            id="author"
            type="text"
            placeholder="Enter an author of the book"
            autoComplete="off"
            className="peer bg-athens-gray placeholder:text-secondary-300 block w-full rounded-md py-[9px] pl-5 text-sm outline-none"
          />
          {errors?.author && (
            <p className="text-error-600 mt-2 text-sm">
              {errors?.author?.message}
            </p>
          )}
        </div>
        <div className="col-span-3 col-start-3 row-span-2 row-start-1">
          <label
            htmlFor="description"
            className="mb-2 block text-[16px] font-semibold"
          >
            Description
          </label>
          <textarea
            {...register("description", { required: true })}
            id="description"
            rows="6"
            className="peer bg-athens-gray placeholder:text-secondary-300 block w-full resize-none rounded-md py-[9px] pl-5 text-sm outline-none"
            placeholder="Write your thoughts here..."
            maxLength="520"
          ></textarea>
          {errors?.description && (
            <p className="text-error-600 mt-2 text-sm">
              {errors?.description?.message}
            </p>
          )}
        </div>
        <div className="col-span-5 row-start-3">
          <label
            htmlFor="genres"
            className="mb-2 block text-[16px] font-semibold"
          >
            List of genres
          </label>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value, name, ref } }) => (
              <Select
                options={BookGenre}
                onChange={onChange}
                isMulti={true}
                onBlur={onBlur}
                name={name}
                value={value}
                ref={ref}
                classNamePrefix="Select genre"
              />
            )}
            name="categories"
          />
          {errors?.categories && (
            <p className="text-error-600 mt-2 text-sm">
              Genre list must not be empty
            </p>
          )}
        </div>
        <div className="col-span-5 row-span-2 row-start-4">
          <div
            onDrop={handleDrop}
            onDragOver={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
            onClick={handleClick}
            className={`relative h-50 cursor-pointer rounded-md border-2 border-dotted ${message ? "border-error-600" : "bg-athens-gray border-secondary-200"}`}
          >
            <input
              type="file"
              multiple
              name="images[]"
              onChange={handleImages}
              style={{ display: "none" }}
              ref={fileInputRef}
            />
            <div className="flex h-full w-full items-center justify-center">
              <div className="flex flex-col items-center">
                <PhotoIcon className="pointer-events-none h-[30px] w-[30px] text-gray-500 peer-focus:text-gray-900" />
                <span className="text-secondary-300 text-sm">
                  Drag and Drop an image
                </span>
              </div>
            </div>
          </div>
          {message && <span className="text-error-600">{message}</span>}
          <div className="flex flex-wrap gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative overflow-hidden">
                <div className="h-full w-full border-2 p-5">
                  <XCircleIcon
                    onClick={removeImage.bind(this, image.name)}
                    className="e absolute top-2 right-2 h-8 w-8 cursor-pointer text-gray-500"
                  />
                  <Image
                    className="pt-2"
                    src={URL.createObjectURL(image)}
                    alt="photo"
                    width={60}
                    height={60}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <Button disabled={loading} type="submit" size="large">
          Create
        </Button>
        <Button
          type="button"
          size="large"
          variant="secondary"
          onClick={(event) => {
            event.preventDefault();
            router.back();
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default BookForm;
