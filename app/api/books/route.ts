import { NextRequest, NextResponse } from "next/server";
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

const baseBookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  description: z.string().min(1, "Description is required"),
  categories: z.array(z.string()).min(1, "At least one category is required"),
});

const updateBookSchema = baseBookSchema.extend({
  newImages: z
    .array(
      z.union([
        z.string(), // Для обратной совместимости - просто URL
        z.object({
          // Новый формат - объект с URL и phash
          url: z.string(),
          phash: z.string(),
        }),
        z.object({
          // Альтернативный формат от upload API
          imgUrl: z.string(),
          phash: z.string(),
        }),
      ]),
    )
    .optional()
    .default([]),
  imagesToDelete: z.array(z.string()).optional().default([]),
});

const createBookSchema = baseBookSchema.extend({
  images: z
    .array(
      z.union([
        z.string(),
        z.object({
          url: z.string(),
          phash: z.string(),
        }),
        z.object({
          imgUrl: z.string(),
          phash: z.string(),
        }),
      ]),
    )
    .optional()
    .default([]),
});

type CreateBookDTO = z.infer<typeof createBookSchema>;
type UpdateBookDTO = z.infer<typeof updateBookSchema>;

export async function GET(req: NextRequest) {
  try {
    let username = req.nextUrl.searchParams.get("user");

    if (username && username === "me") {
      const session = await getServerSession(authOptions);

      if (!session || !session.user || !session.user.email) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      username = session.user.username as string;
      console.log("username");
    }

    const whereClause = username
      ? {
          owner: {
            username,
          },
        }
      : {};

    const books = await db.book.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        author: true,
        description: true,
        categories: true,
        createdAt: true,
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
            email: true,
            username: true,
            image: true,
          },
        },
      },
    });

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
    const parsed = createBookSchema.parse(body);

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
        images: {
          create: parsed.images.map((imageInfo: any) => ({
            url: typeof imageInfo === "string" ? imageInfo : imageInfo.url,
            hash:
              typeof imageInfo === "string"
                ? "legacy_hash" // Для обратной совместимости
                : imageInfo.phash, // Теперь phash сохраняется в поле hash
          })),
        },
        ownerId: user.id,
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
            email: true,
            username: true,
            image: true,
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

export { createBookSchema, updateBookSchema };
export type { CreateBookDTO, UpdateBookDTO };
