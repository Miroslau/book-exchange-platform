import React from "react";
import Book from "@/app/types/book";
import ImageGallery from "@/app/(profile)/books/[id]/components/image-gallery";
import Button from "@/app/ui/button/button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

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

  const session = await getServerSession(authOptions);

  const {
    book,
  }: {
    book: Book;
  } = await fetch(`http://localhost:3000/api/books/${id}`).then((response) =>
    response.json(),
  );

  console.log("book: ", book);

  return (
    <div className="mt-[160px] mr-[32px] ml-[32px]">
      <div className="flex items-center justify-between">
        <Button size="medium">Go Back</Button>
        {session && session.user.id && session.user.id === book.owner.id && (
          <Button size="medium">Edit book</Button>
        )}
      </div>
      <div className="grid grid-cols-2 grid-rows-3 gap-[20px]">
        <div className="row-span-2">
          <ImageGallery images={book.images} />
        </div>
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
    </div>
  );
}
