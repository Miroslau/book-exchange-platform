"use client";

import React from "react";

import { usePathname } from "next/navigation";

const SideBar = () => {
  return (
    <div className="border-chefs-hat flex h-full flex-col bg-white pt-[36px] pr-[16px] pb-[36px] pl-[16px]">
      <div className="flex-1">
        <div></div>
      </div>
      <div>log out</div>
    </div>
  );
};

export default SideBar;
