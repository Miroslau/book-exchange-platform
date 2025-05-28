import React from "react";
import Book from "@/app/types/book";

export const revalidate = 60;

export const dynamicParams = false;

export async function generateStaticParams() {
  const response: {
    message: string;
    books: Book[];
  } = await fetch("http://localhost:3000/api/books").then((res) => res.json());
  return response.books.map((book) => ({
    id: String(book.id),
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const {
    book,
  }: {
    book: Book;
  } = await fetch(`http://localhost:3000/api/books/${id}`).then((response) =>
    response.json(),
  );

  console.log("book: ", book);

  return (
    <div className="mt-[160px] mr-[32px] ml-[32px] grid grid-cols-2 grid-rows-3 gap-[20px]">
      <div className="row-span-2 border-2">images</div>
      <div className="row-span-2 rounded-[10px] bg-white p-[24px]">
        <h3 className="text-[32px] font-bold">{book.title}</h3>
        <p className="text-secondary-400 text-[14px] font-medium">
          {book.author}
        </p>
        <p className="text-secondary-400 mt-[32px] mb-[32px] text-[20px]">
          {book.description}
        </p>
        <div>
          <div className="flex items-center gap-6">
            <span className="text-secondary-300 text-[20px]">Genre:</span>
            <div className="flex items-center gap-6">
              {book.categories.map((category, index) => (
                <div
                  key={index}
                  className="text-secondary-400 text-[20px] font-semibold"
                >
                  {category}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-secondary-300 text-[20px]">Owner:</span>
            <span className="text-secondary-400 text-[20px] font-semibold">
              {book.owner.username}
            </span>
          </div>
        </div>
      </div>
      <div className="col-span-2 rounded-[10px] bg-white p-[24px]">
        Commnets
      </div>
    </div>
  );
}
