import React from "react";
import SideBar from "@/app/ui/side-bar/side-bar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import SessionProviderClientComponent from "@/app/ui/session-provider-client-component/session-provider-client-component";

const Layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await getServerSession(authOptions);
  return (
    <SessionProviderClientComponent session={session}>
      <div className="flex h-screen pt-[124px]">
        <div className="flex-grow p-[32px] md:overflow-y-auto">{children}</div>
      </div>
    </SessionProviderClientComponent>
  );
};

export default Layout;
