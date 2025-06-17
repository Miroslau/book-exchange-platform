import React from "react";
import Book from "@/app/types/book";
import Image from "next/image";
import heartIcon from "@/app/assets/icons/heart-outline-icon.svg";
import Button from "@/app/ui/button/button";
import Link from "next/link";
import BookIcon from "@/app/assets/images/book.png";

export const revalidate = 60;

export const dynamicParams = false;

async function getBooks() {
  const booksResponse = await fetch("http://localhost:3000/api/books", {
    method: "GET",
    next: { revalidate },
  });

  const {
    books,
  }: {
    books: Book[];
  } = await booksResponse.json();

  return books;
}

const Page = async () => {
  const books = await getBooks();
  console.log(books);

  return (
    <div className="w-full p-[32px]">
      <div className="flex flex-wrap gap-[32px]">
        {books.map((book) => (
          <div
            key={book.id}
            className="flex min-w-[317px] flex-col justify-between rounded-[10px] bg-white p-[24px]"
          >
            <div className="flex justify-between">
              <div className="flex flex-col">
                <span className="text-secondary-500 text-[20px] font-bold">
                  {book.title.length > 25
                    ? `${book.title.slice(0, 25)}...`
                    : book.title}
                </span>
                <span className="text-secondary-300 text-[14px] font-bold">
                  {book.author}
                </span>
              </div>
              <div className="flex h-[24px] w-[24px] items-center justify-center">
                <Image src={heartIcon} alt="like" priority />
              </div>
            </div>
            <div className="mt-[20px] flex items-center justify-center">
              {book.images && book.images.length > 0 ? (
                <Image
                  src={book.images[0].url}
                  alt={book.title}
                  quality={100}
                  width={150}
                  height={0}
                  objectFit="cover"
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64"
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
            <Link href={`/books/${book.id}`}>
              <Button customClassName="mt-[20px] w-full" size="medium">
                Show details
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
