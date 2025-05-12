import React from "react";
import searchIcon from "@/app/assets/icons/search-icon.svg";
import filterIcon from "@/app/assets/icons/filter-icon.svg";
import Image from "next/image";
import Button from "@/app/ui/button/button";

const SearchBar = () => {
  return (
    <form className="flex items-center md:max-w-[492px]">
      <div className="relative w-full">
        <div className="absolute inset-y-0 start-0 flex items-center ps-[20px] pointer-events-none">
          <Image src={searchIcon} alt="search" priority />
        </div>
        <input id="search-input" type="text" className="outline-none
                                      focus:ring-information-500
                                      focus:border-information-500
                                      border
                                      border-secondary-200 text-secondary-400
                                      text-[14px]
                                      font-medium
                                      rounded-[10px]
                                      md:rounded-[70px]
                                      block
                                      w-[80%]
                                      md:w-full
                                      ps-[56px]
                                      md:ps-[64px]
                                      py-[12px]
                                      px-[24px]
                                      md:py-[10px]
                                      md:px-[20px]"
               placeholder="Search something here" />
        <Button type="button" className="absolute border border-secondary-200 rounded-[10px] md:border-none md:rounded-full inset-y-0 end-0 px-[12px] md:px-[20px] flex justify-center items-center cursor-pointer hover:bg-secondary-100">
          <Image src={filterIcon} alt="filter" priority />
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;