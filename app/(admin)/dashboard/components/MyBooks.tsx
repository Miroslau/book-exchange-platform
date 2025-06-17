"use client";

import React, { FC, useEffect, useRef, useState } from "react";
import Image from "next/image";
import BookIcon from "@/app/assets/images/book.png";
import Button from "@/app/ui/button/button";
import Link from "next/link";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";
import Book from "@/app/types/book";
import { useRouter } from "next/navigation";

const ITEM_WIDTH = 200;

interface Props {
  books: Book[];
}

const MyBooks: FC<Props> = ({ books }) => {
  const router = useRouter();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (scrollAmount: number) => {
    console.log("scrollAmount: ", scrollAmount);
    const newScrollPosition = scrollPosition + scrollAmount;
    setScrollPosition(newScrollPosition);
    console.log("newScrollPosition: ", newScrollPosition);
    if (containerRef.current) {
      containerRef.current.scrollLeft = newScrollPosition;
      console.log("containerRef.current: ", containerRef.current.scrollLeft);
    }
  };

  const handleClick = (bookId: number) => {
    router.push(`/books/${bookId}`);
  };

  useEffect(() => {
    const getDimensions = () => ({
      width: containerRef.current?.offsetWidth || 0,
      height: containerRef.current?.offsetHeight || 0,
    });

    const handleResize = () => {
      setDimensions(getDimensions());
    };

    if (containerRef.current) {
      setDimensions(getDimensions());
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [containerRef]);

  return (
    <div className="pt-5">
      {books.length ? (
        <div className="relative flex items-center">
          {scrollPosition > 0 && (
            <ChevronDoubleLeftIcon
              width={40}
              height={40}
              className="cursor-pointer"
              onClick={handleScroll.bind(null, -ITEM_WIDTH)}
            />
          )}
          <div
            className="scroll h-full w-full overflow-x-scroll scroll-smooth whitespace-nowrap"
            ref={containerRef}
          >
            {books.map((book) => (
              <Button
                key={book.id}
                onClick={handleClick.bind(this, book.id)}
                className="ml-6 inline-block max-w-[182px] cursor-pointer rounded-lg border p-4 shadow first:ml-0"
              >
                <div className="relative mb-[8px] h-40 w-full">
                  {book.images && book.images.length > 0 ? (
                    <Image
                      src={book.images[0].url}
                      alt={book.title}
                      quality={100}
                      fill={true}
                      className="rounded-xl object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-xl bg-gray-200">
                      <Image
                        src={BookIcon}
                        alt="No image"
                        width={40}
                        height={40}
                        className="opacity-50"
                      />
                    </div>
                  )}
                </div>
                <div className="text-secondary-500 truncate text-[14px] font-bold">
                  {book.title.length > 25
                    ? `${book.title.slice(0, 25)}...`
                    : book.title}
                </div>
                <div className="text-secondary-300 pt-[4px] text-[14px] font-bold">
                  {book.author}
                </div>
              </Button>
            ))}
          </div>
          {books.length * ITEM_WIDTH > dimensions.width && (
            <ChevronDoubleRightIcon
              width={40}
              height={40}
              className="cursor-pointer"
              onClick={handleScroll.bind(null, ITEM_WIDTH)}
            />
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center rounded-xl border-1 p-15">
          <div className="flex flex-col items-center justify-center gap-[10px]">
            <Image src={BookIcon} alt="book" width={50} height={50} />
            <h3 className="text-secondary-500 text-[20px] font-medium">
              No books
            </h3>
            <p className="text-secondary-300 text-[15px]">
              Add your first book
            </p>
            <Link href="/dashboard/create-book">
              <Button size="medium">Add book</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBooks;
