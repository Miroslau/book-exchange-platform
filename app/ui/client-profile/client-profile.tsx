import React from "react";
import UserDefaultImage from "@/app/assets/images/user.png";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

const ClientProfile = async () => {
  const session = await getServerSession(authOptions);

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
      </div>
    </div>
  );
};

export default ClientProfile;
