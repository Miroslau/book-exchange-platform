import React, { Suspense } from "react";
import Loading from "@/app/(profile)/dashboard/loading";
import MyBooks from "@/app/(profile)/dashboard/components/MyBooks";

import { cookies } from "next/headers";
import ClientProfile from "@/app/ui/client-profile/client-profile";

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

async function getMyBooks() {
  const cookieStore = await cookies();
  const booksResponse = await fetch("http://localhost:3000/api/books?user=me", {
    method: "GET",
    headers: {
      Cookie: cookieStore.toString(),
    },
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
        <div className="text-[18px] font-medium">My books</div>
        <Suspense fallback={<Loading />}>
          <MyBooks books={books} />
        </Suspense>
      </div>
    </div>
  );
};

export default Page;
