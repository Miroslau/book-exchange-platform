import React from "react";
import SideBar from "@/app/ui/side-bar/side-bar";

const Layout = () => {
  return (
    <div className="flex h-screen pt-[124px]">
      <div className="w-[286px]">
        <SideBar />
      </div>
      <div className="flex-grow md:overflow-y-auto">content</div>
    </div>
  );
};

export default Layout;
