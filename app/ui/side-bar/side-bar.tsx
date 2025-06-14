"use client";

import React from "react";
import HomeIconOutline from "@/app/assets/icons/home-icon-outline.svg";
import HomeIconFill from "@/app/assets/icons/home-icon-fill.svg";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const links = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: {
      outline: HomeIconOutline,
      fill: HomeIconFill,
    },
  },
];

const SideBar = () => {
  const pathname = usePathname();
  return (
    <div className="border-chefs-hat flex h-full flex-col bg-white pt-[36px] pr-[16px] pb-[36px] pl-[16px]">
      <div className="flex-1">
        <div>
          <p className="pl-[16px] text-[12px] text-[#94A7CB] uppercase opacity-40">
            main menu
          </p>
          <ul className="pt-[14px]">
            {links.map((link) => {
              const { outline, fill } = link.icon;
              const activePathStyle = "bg-primary-netural-palette-500";
              return (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`${pathname === link.href && activePathStyle} flex items-center gap-[12px] rounded-[10px] pt-[14px] pb-[14px] pl-[16px]`}
                  >
                    <Image
                      src={pathname === link.href ? fill : outline}
                      alt="home"
                    />
                    <p className="text-[16px] font-medium text-white">
                      {link.name}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div>log out</div>
    </div>
  );
};

export default SideBar;
