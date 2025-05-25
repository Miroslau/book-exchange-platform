import React, { Suspense } from "react";
import Loading from "@/app/(profile)/dashboard/loading";
import MyBooksList from "@/app/(profile)/dashboard/components/MyBooksList";
import ClientProfile from "@/app/ui/client-profile/client-profile";

const Page = async () => {
  return (
    <div className="rounded-[10px] bg-white">
      <div className="h-[94px] rounded-t-[10px] bg-linear-to-r from-cyan-500 to-blue-500"></div>
      <ClientProfile />
      <div className="p-[32px]">
        <div className="text-[18px] font-medium">My books</div>
        <Suspense fallback={<Loading />}>
          <MyBooksList />
        </Suspense>
      </div>
    </div>
  );
};

export default Page;
