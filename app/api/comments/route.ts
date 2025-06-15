import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

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

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body: {
      content: string;
      bookId: number;
    } = await req.json();
    const { bookId, content } = body;

    if (!content || !bookId) {
      return NextResponse.json(
        { error: "Missing text, bookId" },
        { status: 400 },
      );
    }

    const newComment = await db.comment.create({
      data: {
        text: content,
        book: { connect: { id: bookId } },
        author: { connect: { id: session.user.id } },
      },
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
    });

    return NextResponse.json(
      {
        message: "success",
        comment: newComment,
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
