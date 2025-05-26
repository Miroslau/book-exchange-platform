"use client";

import React from "react";
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

const BookList = () => {
  return (
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
  );
};

export default BookList;
