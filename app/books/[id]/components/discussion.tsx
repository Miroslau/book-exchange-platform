"use client";

import React, { FC, useEffect, useRef, useState } from "react";
import Button from "@/app/ui/button/button";
import { useRouter, useSearchParams } from "next/navigation";
import Comment from "@/app/types/comment";
import DefaultUserImage from "@/app/assets/images/user.png";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface Props {
  bookId: string;
}

const TAKE = 8;

const Discussion: FC<Props> = ({ bookId }) => {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalComments, setTotalComments] = useState<number>(0);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const fetchComments = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `/api/comments?bookId=${bookId}&skip=${skip}&take=${TAKE}`,
        {
          method: "GET",
        },
      );

      const {
        comments: newComments,
        total,
      }: {
        comments: Comment[];
        message: string;
        total: number;
      } = await response.json();
      setTotalComments(total);
      setComments((prev) => [...prev, ...newComments]);
      setSkip((prev) => prev + TAKE);
      if (newComments.length < TAKE) {
        setHasMore(false);
      }
    } catch (error: unknown) {
      console.error("Fetch failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [bookId]);

  return (
    <div className="mt-[20px] rounded-[10px] bg-white p-[24px]">
      <div className="flex items-center gap-x-[12px]">
        <span className="text-[20px] font-semibold">Reviews</span>
        {totalComments > 0 && (
          <span className="bg-primary-netural-palette-500 rounded-[4px] pt-[6px] pr-[12px] pb-[6px] pl-[12px] text-[14px] font-bold text-white">
            {totalComments}
          </span>
        )}
      </div>
      {session?.user && (
        <div className="w-full pt-[32px]">
          <div className="relative flex w-full justify-between gap-2">
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 bg-white px-5 py-3 text-lg leading-relaxed font-normal text-gray-900 placeholder-gray-400 shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] focus:outline-none"
              placeholder="Write comments here...."
            />
            <Link href="" className="absolute top-[18px] right-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M11.3011 8.69906L8.17808 11.8221M8.62402 12.5909L8.79264 12.8821C10.3882 15.638 11.1859 17.016 12.2575 16.9068C13.3291 16.7977 13.8326 15.2871 14.8397 12.2661L16.2842 7.93238C17.2041 5.17273 17.6641 3.79291 16.9357 3.06455C16.2073 2.33619 14.8275 2.79613 12.0679 3.71601L7.73416 5.16058C4.71311 6.16759 3.20259 6.6711 3.09342 7.7427C2.98425 8.81431 4.36221 9.61207 7.11813 11.2076L7.40938 11.3762C7.79182 11.5976 7.98303 11.7083 8.13747 11.8628C8.29191 12.0172 8.40261 12.2084 8.62402 12.5909Z"
                  stroke="#111827"
                  stroke-width="1.6"
                  stroke-linecap="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      )}
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
          {hasMore && (
            <div ref={loaderRef} className="py-4 text-center text-gray-500">
              {loading ? "Loading..." : "Scroll to load more"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Discussion;
