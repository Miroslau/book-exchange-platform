import React from "react";
import Book from "@/app/types/book";
import BookForm from "@/app/ui/form/book-form";

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

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const {
    book,
  }: {
    book: Book;
  } = await fetch(`http://localhost:3000/api/books/${id}`).then((response) =>
    response.json(),
  );

  return (
    <div className="rounded-[10px] bg-white p-[32px]">
      <h1 className="text-secondary-500 text-[20px] font-bold">
        {`Edit book ${id}`}
      </h1>
      <div className="mt-[32px]">
        <BookForm book={book} mode="edit" />
      </div>
    </div>
  );
};

export default Page;
