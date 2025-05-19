import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import ClientProfile from "@/app/ui/client-profile/client-profile";

const Page = async () => {
  const session = await getServerSession(authOptions);

  const { user } = session!;

  return (
    <div className="rounded-[10px] bg-white">
      <div className="h-[94px] rounded-t-[10px] bg-linear-to-r from-cyan-500 to-blue-500"></div>
      <ClientProfile user={user} />
    </div>
  );
};

export default Page;
