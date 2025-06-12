import React, { FC } from "react";
import searchIcon from "@/app/assets/icons/search-icon.svg";
import filterIcon from "@/app/assets/icons/filter-icon.svg";
import Image from "next/image";
import Button from "@/app/ui/button/button";

interface SearchBarProps {
  handleSideBarMenu: () => void;
}

const SearchBar: FC<SearchBarProps> = ({ handleSideBarMenu }) => {
  return (
    <form className="flex items-center md:max-w-[492px]">
      <div className="relative w-full">
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-[20px]">
          <Image src={searchIcon} alt="search" priority />
        </div>
        <input
          id="search-input"
          type="text"
          className="focus:ring-information-500 focus:border-information-500 border-secondary-200 text-secondary-400 block w-[80%] rounded-[10px] border px-[24px] py-[12px] ps-[56px] text-[14px] font-medium outline-none md:w-full md:rounded-[70px] md:px-[20px] md:py-[10px] md:ps-[64px]"
          placeholder="Search something here"
        />
        <Button
          type="button"
          className="border-secondary-200 hover:bg-secondary-100 absolute inset-y-0 end-0 flex cursor-pointer items-center justify-center rounded-[10px] border px-[12px] md:rounded-full md:border-none md:px-[20px]"
          onClick={handleSideBarMenu}
        >
          <Image src={filterIcon} alt="filter" priority />
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
