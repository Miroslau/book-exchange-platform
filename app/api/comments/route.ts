import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/db";

export async function GET(req: NextRequest) {
  try {
    const bookId = parseInt(req.nextUrl.searchParams.get("bookId") as string);

    if (isNaN(bookId)) {
      return NextResponse.json(
        { message: "Missing or invalid bookId" },
        { status: 400 },
      );
    }

    const limit = parseInt(req.nextUrl.searchParams.get("take") as string) | 8;
    const offset = parseInt(req.nextUrl.searchParams.get("skip") as string) | 0;

    const total = await db.comment.count({ where: { bookId } });

    const comments = await db.comment.findMany({
      where: { bookId },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
            email: true,
          },
        },
      },
      take: limit,
      skip: offset,
    });

    return NextResponse.json(
      {
        message: "success",
        comments: comments,
        total: total,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    let message = "Something went wrong. Please try again later";
    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json(
      {
        message: message,
      },
      { status: 500 },
    );
  }
}
