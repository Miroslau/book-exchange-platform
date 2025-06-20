"use client";

import React from "react";
import UserDefaultImage from "@/app/assets/images/user.png";
import Image from "next/image";
import Button from "@/app/ui/button/button";
import { signOut, useSession } from "next-auth/react";

const ClientProfile = () => {
  const { data: session } = useSession();

  return (
    <div className="p-[32px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[24px]">
          <Image
            className="rounded-[50%]"
            src={
              session && session.user.image
                ? session.user.image
                : UserDefaultImage
            }
            alt="user"
            priority={true}
            width={100}
            height={100}
          />

          <div>
            <div className="text-secondary-500 text-[20px] font-medium">
              {session ? session.user.username : ""}
            </div>
            <div className="text-secondary-300 text-[16px]">
              {session ? session.user.email : ""}
            </div>
          </div>
        </div>
        <Button size="small" onClick={() => signOut()}>
          Sign out
        </Button>
      </div>
    </div>
  );
};

export default ClientProfile;
