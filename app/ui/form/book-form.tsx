"use client";

import React from "react";
import BookGenre from "@/app/lib/constants";
import dynamic from "next/dynamic";

const Select = dynamic(
  () => import("react-select").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => null,
  },
);

const BookForm = () => {
  return (
    <form>
      <div className="grid grid-cols-5 grid-rows-5 gap-10">
        <div className="col-span-2">
          <label
            htmlFor="title"
            className="mb-2 block text-[16px] font-semibold"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="Enter a title"
            autoComplete="off"
            className="peer bg-athens-gray placeholder:text-secondary-300 block w-full rounded-md py-[9px] pl-5 text-sm outline-none"
          />
        </div>
        <div className="col-span-2 col-start-1 row-start-2">
          <label
            htmlFor="author"
            className="mb-2 block text-[16px] font-semibold"
          >
            Author
          </label>
          <input
            id="author"
            type="text"
            placeholder="Enter an author of the book"
            autoComplete="off"
            className="peer bg-athens-gray placeholder:text-secondary-300 block w-full rounded-md py-[9px] pl-5 text-sm outline-none"
          />
        </div>
        <div className="col-span-3 col-start-3 row-span-2 row-start-1">
          <label
            htmlFor="description"
            className="mb-2 block text-[16px] font-semibold"
          >
            Description
          </label>
          <textarea
            id="description"
            rows="6"
            className="peer bg-athens-gray placeholder:text-secondary-300 block w-full resize-none rounded-md py-[9px] pl-5 text-sm outline-none"
            placeholder="Write your thoughts here..."
          ></textarea>
        </div>
        <div className="col-span-5 row-start-3">
          <label
            htmlFor="genres"
            className="mb-2 block text-[16px] font-semibold"
          >
            List of genres
          </label>
          <Select
            name="genres"
            isMulti={true}
            className={{
              control: (state) =>
                state.isFocused ? "border-red-500" : "border-b-secondary-300",
            }}
            classNamePrefix="Select genre"
            defaultValue={[BookGenre[0], BookGenre[1]]}
            options={BookGenre}
            onChange={() => {}}
            onInputChange={() => {}}
          />
        </div>
        <div className="col-span-5 row-span-2 row-start-4 border-2">5</div>
      </div>
    </form>
  );
};

export default BookForm;
