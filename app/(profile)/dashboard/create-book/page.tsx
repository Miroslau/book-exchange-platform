import React from "react";
import BookForm from "@/app/ui/form/book-form";

const Page = () => {
  return (
    <div className="rounded-[10px] bg-white p-[32px]">
      <h1 className="text-secondary-500 text-[20px] font-bold">
        Create your book
      </h1>
      <div className="mt-[32px]">
        <BookForm />
      </div>
    </div>
  );
};

export default Page;
