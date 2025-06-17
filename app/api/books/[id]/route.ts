import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

type Params = {
  id: Promise<string>;
};

interface updateBookDTO {
  title: string;
  author: string;
  description: string;
  categories: string[];
  images: string[];
  imagesToDelete?: string[];
}

const updateBookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  description: z.string().min(1),
  categories: z.array(z.string()).min(1),
  images: z.array(z.string()).optional().default([]),
  imagesToDelete: z.array(z.string()).optional().default([]),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Params },
) {
  try {
    const { id } = await params;

    const book = await db.book.findUnique({
      where: {
        id: +id,
      },
      include: {
        images: {
          select: {
            id: true,
            url: true,
            hash: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        owner: {
          select: {
            id: true,
            username: true,
            avatar: true,
            email: true,
          },
        },
      },
    });

    if (!book) {
      return NextResponse.json(
        { message: "The book doesn't exist" },
        { status: 404 },
      );
    }

    return NextResponse.json({ book: book }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Params },
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body: updateBookDTO = await request.json();
    const parsed = updateBookSchema.parse(body);

    // Check if book exists and user owns it
    const existingBook = await db.book.findUnique({
      where: { id: +id },
      include: { owner: true },
    });

    if (!existingBook) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }

    if (existingBook.owner.email !== session.user.email) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // TODO: Delete images from Cloudinary if imagesToDelete is provided
    // This would require implementing a delete endpoint or using Cloudinary API directly

    const updatedBook = await db.book.update({
      where: { id: +id },
      data: {
        title: parsed.title,
        author: parsed.author,
        description: parsed.description,
        categories: parsed.categories,
        images: parsed.images,
      },
      include: {
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

    return NextResponse.json({ book: updatedBook }, { status: 200 });
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
