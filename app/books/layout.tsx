"use client";

import React, { useEffect } from "react";
import { useSideBar } from "@/app/context/side-bar-context";
import SideBar from "@/app/ui/side-bar/side-bar";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { isOpen } = useSideBar();

  useEffect(() => {
    console.log("isOpen: ", isOpen);
  }, [isOpen]);

  return (
    <div className="mt-[128px] flex h-screen">
      {isOpen && (
        <div className="w-full max-w-[286px]">
          <SideBar />
        </div>
      )}
      {children}
    </div>
  );
};

export default Layout;
