import React from "react";
import { cookies } from "next/headers";
import Image from "next/image";
import BookIcon from "@/app/assets/images/book.png";
import Button from "@/app/ui/button/button";
import Link from "next/link";

const MyBooksList = async () => {
  const cookieStore = await cookies();
  const booksResponse = await fetch("http://localhost:3000/api/books?user=me", {
    method: "GET",
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  const { books } = await booksResponse.json();

  console.log("books: ", books);

  return (
    <div className="pt-5">
      {!books.length && (
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

export default MyBooksList;
