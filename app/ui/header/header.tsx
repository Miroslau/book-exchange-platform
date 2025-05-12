import React from "react";
import SearchBar from "@/app/ui/search-bar/search-bar";
import Button from "@/app/ui/button/button";
import Link from "next/link";

const Header = () => {
  return (
    <header className="fixed top-0 z-10 grid w-full grid-rows-2 items-center gap-[20px] bg-white px-[24px] py-[30px] md:grid-cols-(--header-grid-cols) md:grid-rows-1 md:py-[40px] md:pr-[32px] md:pl-[60px]">
      <div>
        <Link
          className="text-primary-netural-palette-500 text-[24px] font-[650] uppercase no-underline md:text-[32px]"
          href="/"
        >
          BookShop
        </Link>
      </div>
      <div className="col-span-2 col-start-1 md:col-span-1 md:col-start-2">
        <SearchBar />
      </div>
      <div className="col-start-2 row-start-1 md:col-start-3">
        <div className="flex justify-end gap-[20px]">
          <Link href="/sign-in">
            <Button size="small">Sign in</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
