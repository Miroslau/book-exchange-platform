import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/app/lib/db";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

interface createBookDTO {
  title: string;
  author: string;
  description: string;
  categories: string[];
  images: string[];
}

const bookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  description: z.string().min(1),
  categories: z.array(z.string()).min(1),
  images: z.array(z.string()).optional().default([]),
});

export async function GET(req: NextRequest) {
  try {
    let books;
    let username = req.nextUrl.searchParams.get("user");

    if (username && username === "me") {
      const session = await getServerSession(authOptions);

      if (!session || !session.user || !session.user.email) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      username = session.user.username as string;
      console.log("username");
    }

    if (username) {
      books = await db.book.findMany({
        where: {
          owner: {
            username,
          },
        },
        select: {
          id: true,
          title: true,
          author: true,
          description: true,
          categories: true,
          images: true,
          createdAt: true,
          owner: {
            select: {
              id: true,
              email: true,
              username: true,
              avatar: true,
            },
          },
        },
      });
    } else {
      books = await db.book.findMany({
        select: {
          id: true,
          title: true,
          author: true,
          description: true,
          categories: true,
          images: true,
          createdAt: true,
          owner: {
            select: {
              id: true,
              email: true,
              username: true,
              avatar: true,
            },
          },
        },
      });
    }

    return NextResponse.json({
      message: "success",
      books: books,
    });
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
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: createBookDTO = await req.json();
    const parsed = bookSchema.parse(body);

    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const book = await db.book.create({
      data: {
        title: parsed.title,
        author: parsed.author,
        description: parsed.description,
        categories: parsed.categories,
        images: parsed.images,
        ownerId: user.id,
      },
      select: {
        id: true,
        title: true,
        author: true,
        description: true,
        categories: true,
        images: true,
        createdAt: true,
        owner: {
          select: {
            id: true,
            email: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json(book, {
      status: 201,
    });
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
