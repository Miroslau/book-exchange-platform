"use client";

import React, { FC } from "react";
import Image from "next/image";
import BookIcon from "@/app/assets/images/book.png";
import Button from "@/app/ui/button/button";
import Link from "next/link";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";

interface Book {
  author: string;
  categories: string[];
  createdAt: string;
  description: string;
  id: number;
  images: string[];
  owner: {
    avatar: string;
    email: string;
    id: number;
    username: string;
  };
  title: string;
}
interface Props {
  books: Book[];
}

const SAMPLE_DATA = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
  { id: 7 },
  { id: 8 },
  { id: 9 },
];

const MyBooks: FC<Props> = ({ books }) => {
  return (
    <div className="pt-5">
      {books.length ? (
        <div className="relative flex items-center">
          <ChevronDoubleLeftIcon
            width={40}
            height={40}
            className="cursor-pointer"
          />
          <div className="scroll h-full w-full overflow-x-scroll scroll-smooth whitespace-nowrap">
            {SAMPLE_DATA.map((book) => (
              <div
                key={book.id}
                className="bg-primary-netural-palette-500 ml-6 inline-block h-[200px] w-[200px] first:ml-0"
              >
                {book.id}
              </div>
            ))}
          </div>
          <ChevronDoubleRightIcon
            width={40}
            height={40}
            className="cursor-pointer"
          />
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
