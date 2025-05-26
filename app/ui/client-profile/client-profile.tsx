"use client";

import React from "react";
import Button from "@/app/ui/button/button";
import UserDefaultImage from "@/app/assets/images/user.png";
import UploadImage from "@/app/ui/upload-image/upload-Image";
import { useSession } from "next-auth/react";

const ClientProfile = () => {
  const { update, data: session } = useSession();
  const uploadStagedFile = async (stagedFile: File | Blob) => {
    console.log("staged file: ", stagedFile);
    const form = new FormData();
    form.set("file", stagedFile);
    form.append("folderRoot", "Users");
    form.append("folderName", `user-${session?.user?.username}`);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: form,
    });

    const data = await response.json();

    await update({
      image: data.imgUrl,
    });

    await fetch("/api/user", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: session?.user.id,
        url: data.imgUrl,
      }),
    });

    console.log("image url: ", data.imgUrl);
  };

  return (
    <div className="p-[32px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[24px]">
          <UploadImage
            src={
              session && session.user.image
                ? session.user.image
                : UserDefaultImage
            }
            alt="User"
            priority
            width={100}
            height={100}
            handleSubmit={uploadStagedFile}
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
        <Button size="medium" customClassName="pl-[32px] pr-[32px]">
          Edit
        </Button>
      </div>
      <div>form inputs</div>
    </div>
  );
};

export default ClientProfile;
