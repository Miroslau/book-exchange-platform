import React, { Suspense } from "react";
import Loading from "@/app/(admin)/dashboard/loading";
import MyBooks from "@/app/(admin)/dashboard/components/MyBooks";

import { cookies } from "next/headers";
import ClientProfile from "@/app/ui/client-profile/client-profile";
import Button from "@/app/ui/button/button";
import Link from "next/link";
import Book from "@/app/types/book";

async function getMyBooks() {
  const cookieStore = await cookies();
  const booksResponse = await fetch("http://localhost:3000/api/books?user=me", {
    method: "GET",
    headers: {
      Cookie: cookieStore.toString(),
    },
    cache: "no-store",
  });
  const {
    books,
  }: {
    books: Book[];
  } = await booksResponse.json();

  return books;
}

const Page = async () => {
  const books = await getMyBooks();
  return (
    <div className="rounded-[10px] bg-white">
      <div className="h-[94px] rounded-t-[10px] bg-linear-to-r from-cyan-500 to-blue-500"></div>
      <ClientProfile />
      <div className="p-[32px]">
        <div className="flex items-center justify-between">
          <span className="text-[18px] font-medium">My books</span>
          {books && books.length > 0 && (
            <Link href="/dashboard/create-book">
              <Button size="medium" customClassName="pl-[32px] pr-[32px]">
                Add
              </Button>
            </Link>
          )}
        </div>
        <Suspense fallback={<Loading />}>
          <MyBooks books={books} />
        </Suspense>
      </div>
    </div>
  );
};

export default Page;
