"use client";

import React, { useEffect } from "react";
import SearchBar from "@/app/ui/search-bar/search-bar";
import Button from "@/app/ui/button/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";
import heartIcon from "@/app/assets/icons/heart-icon.svg";
import notificationIcon from "@/app/assets/icons/notification-icon.svg";
import settingsIcon from "@/app/assets/icons/settings-icon.svg";
import DefaultUserImage from "@/app/assets/images/user.png";

const Header = () => {
  const { data: session } = useSession();

  useEffect(() => {
    console.log("session: ", session);
  }, [session]);

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
          {session?.user && (
            <>
              <button className="md:border-secondary-200 hidden rounded-full border md:flex md:h-[44px] md:w-[44px] md:items-center md:justify-center">
                <Image src={heartIcon} alt="Like" priority />
              </button>
              <button className="md:border-secondary-200 hidden rounded-full border md:flex md:h-[44px] md:w-[44px] md:items-center md:justify-center">
                <Image src={notificationIcon} alt="Notification" priority />
              </button>
              <button className="md:border-secondary-200 hidden rounded-full border md:flex md:h-[44px] md:w-[44px] md:items-center md:justify-center">
                <Image src={settingsIcon} alt="Settings" priority />
              </button>
              <div className="flex items-center justify-center rounded-full">
                <Image
                  width={44}
                  height={44}
                  src={
                    session?.user?.image
                      ? session?.user?.image
                      : DefaultUserImage
                  }
                  alt="user"
                  priority
                  style={{
                    borderRadius: "50%",
                    height: "auto",
                  }}
                />
              </div>
            </>
          )}
          {!session?.user && (
            <Link href="/sign-in">
              <Button size="small">Sign in</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
