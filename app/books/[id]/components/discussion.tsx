"use client";

import React, { FC, useEffect } from "react";
import Button from "@/app/ui/button/button";
import { useRouter, useSearchParams } from "next/navigation";
import Comment from "@/app/types/comment";
import DefaultUserImage from "@/app/assets/images/user.png";
import Image from "next/image";

interface Props {
  comments: Comment[];
  bookId: string;
  showAll: boolean;
}

const Discussion: FC<Props> = ({ comments, showAll, bookId }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleShowAllComments = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("showAll", "true");
    router.push(`/books/${bookId}?${params.toString()}`);
  };

  useEffect(() => {
    console.log("showAll: ", showAll);
  }, [showAll]);

  return (
    <div className="mt-[20px] rounded-[10px] bg-white p-[24px]">
      <div className="flex items-center gap-x-[12px]">
        <span className="text-[20px] font-semibold">Reviews</span>
        {comments.length > 0 && (
          <span className="bg-primary-netural-palette-500 rounded-[4px] pt-[6px] pr-[12px] pb-[6px] pl-[12px] text-[14px] font-bold text-white">
            {comments.length}
          </span>
        )}
      </div>
      <div className="pt-[32px]">
        <div>
          {comments.map((comment) => (
            <div key={comment.id}>
              <div className="flex justify-between">
                <div className="flex items-center gap-x-[16px]">
                  <Image
                    width={56}
                    height={56}
                    src={
                      comment?.author?.avatar
                        ? comment?.author?.avatar
                        : DefaultUserImage
                    }
                    alt="user"
                    priority
                    style={{
                      borderRadius: "50%",
                      height: "auto",
                    }}
                  />
                  <div className="flex flex-col gap-y-[8px]">
                    <span className="text-secondary-500 text-[20px] font-bold">
                      {comment.author.username}
                    </span>
                    <span className="text-secondary-300 text-[14px] font-medium">
                      {comment.author.email}
                    </span>
                  </div>
                </div>
                <div>date and rating</div>
              </div>
            </div>
          ))}
        </div>
        {!showAll && (
          <div className="flex items-center justify-center pt-[24px] pb-[24px]">
            <Button onClick={handleShowAllComments} size="medium">
              Show All
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Discussion;
