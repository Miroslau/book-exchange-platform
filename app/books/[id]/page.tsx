import React from "react";
import Book from "@/app/types/book";
import ImageGallery from "@/app/books/[id]/components/image-gallery";
import Button from "@/app/ui/button/button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import Link from "next/link";
import Discussion from "@/app/books/[id]/components/discussion";

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
    <div className="mr-[32px] ml-[32px] pt-[20px]">
      <div className="flex items-center justify-between pb-4">
        <Link href="/">
          <Button size="medium">Go Back</Button>
        </Link>
        {session && session.user.id && session.user.id === book.owner.id && (
          <Link href={`/dashboard/edit-book/${id}`}>
            <Button size="medium">Edit book</Button>
          </Link>
        )}
      </div>
      <div className="flex gap-[20px]">
        <ImageGallery images={book.images} />
        <div className="flex-1 rounded-[10px] bg-white p-[24px]">
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
      </div>
      <Discussion bookId={id} />
    </div>
  );
}
