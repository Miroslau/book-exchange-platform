import React from "react";
import SideBar from "@/app/ui/side-bar/side-bar";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex h-screen pt-[124px]">
      <div className="flex-grow p-[32px] md:overflow-y-auto">{children}</div>
    </div>
  );
};

export default Layout;
