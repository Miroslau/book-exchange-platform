"use client";

import React, { FC, useEffect, useRef, useState } from "react";
import Comment from "@/app/types/comment";
import DefaultUserImage from "@/app/assets/images/user.png";
import Image from "next/image";
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
  const inputRef = useRef<HTMLInputElement | null>(null);

  const fetchComments = async () => {
    setLoading(true);

    if (skip === 0) {
      setComments([]);
      setHasMore(true);
    }

    try {
      const response = await fetch(
        `/api/comments?bookId=${bookId}&skip=${skip}&take=${TAKE}`,
        {
          method: "GET",
          cache: "no-store",
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
      setComments((prev) => {
        const merged = [...prev, ...newComments];
        return Array.from(new Map(merged.map((c) => [c.id, c])).values());
      });
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

  const handleSubmit = async () => {
    const tempId = Date.now();
    console.log(tempId);
    const comment: Comment = {
      id: tempId,
      text: inputRef.current?.value as string,
      book: parseInt(bookId),
      author: {
        id: session?.user?.id as number,
        username: session?.user?.username as string,
        email: session?.user?.email as string,
        avatar: session?.user?.image || DefaultUserImage,
      },
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
    };
    setComments((prev) => [comment, ...prev]);
    if (inputRef.current && inputRef.current.value) {
      inputRef.current.value = "";
    }
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: comment.text,
          bookId: parseInt(bookId),
        }),
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const { comment: newComment } = await response.json();

      setComments((prev) =>
        prev.map((c) => (c.id === tempId ? newComment : c)),
      );
    } catch (error: unknown) {
      console.error("Fetch failed", error);
      setComments((prev) => prev.filter((c) => c.id !== tempId));
    }
  };

  useEffect(() => {
    fetchComments();
  }, [bookId]);

  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        console.log("fetch comments");
        fetchComments();
      }
    });

    const loader = loaderRef.current;

    if (loader) observer.observe(loader);

    return () => {
      if (loader) observer.unobserve(loader);
    };
  }, [hasMore, loading]);

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
              ref={inputRef}
              onKeyDown={(event) => {
                if (event.key === "Enter" && inputRef.current?.value !== "") {
                  event.preventDefault();
                  handleSubmit();
                }
              }}
            />
          </div>
        </div>
      )}
      <div className="pt-[32px]">
        <div className="flex flex-col gap-y-[24px]">
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
              <div className="text-secondary-400 pt-[12px] pl-[70px] text-[14px] tracking-tighter">
                {comment.text}
              </div>
            </div>
          ))}
        </div>
        {hasMore && (
          <div ref={loaderRef} className="py-4 text-center text-gray-500">
            {loading ? "Loading..." : "Scroll to load more"}
          </div>
        )}
      </div>
    </div>
  );
};

export default Discussion;
