import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import {
  deleteImagesFromCloudinary,
  extractImageIdFromUrl,
  extractPublicIdFromCloudinaryUrl,
  generateImageHash,
} from "@/app/lib/imageUtils";
import { UpdateBookDTO, updateBookSchema } from "@/app/api/books/route";

type Params = {
  id: Promise<string>;
};

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
    const body: UpdateBookDTO = await request.json();
    const parsed = updateBookSchema.parse(body);

    // Check if book exists and user owns it
    const existingBook = await db.book.findUnique({
      where: { id: +id },
      include: {
        owner: true,
        images: true,
      },
    });

    if (!existingBook) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }

    if (existingBook.owner.email !== session.user.email) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const updatedBook = await db.$transaction(async (prisma) => {
      let deletedFromCloudinary: string[] = [];
      let failedToDeleteFromCloudinary: string[] = [];

      if (parsed.imagesToDelete.length > 0) {
        const imagesToDelete = await prisma.bookImage.findMany({
          where: {
            id: {
              in: parsed.imagesToDelete,
            },
            bookId: +id,
          },
          select: {
            id: true,
            url: true,
          },
        });

        const publicIds = imagesToDelete
          .map((img) => extractPublicIdFromCloudinaryUrl(img.url))
          .filter((publicId): publicId is string => publicId !== null);

        if (publicIds.length > 0) {
          try {
            const cloudinaryResult =
              await deleteImagesFromCloudinary(publicIds);

            deletedFromCloudinary = cloudinaryResult.deleted;
            failedToDeleteFromCloudinary = cloudinaryResult.failed;

            if (failedToDeleteFromCloudinary.length > 0) {
              console.warn(
                "Failed to delete some images from Cloudinary:",
                failedToDeleteFromCloudinary,
              );
            }
          } catch (error) {
            console.error("Error deleting images from Cloudinary:", error);
            // Продолжаем выполнение, даже если удаление из Cloudinary не удалось
          }
        }

        await prisma.bookImage.deleteMany({
          where: {
            id: {
              in: parsed.imagesToDelete,
            },
            bookId: +id,
          },
        });
      }

      if (parsed.newImages && parsed.newImages.length > 0) {
        const imageData = parsed.newImages.map((imageInfo) => {
          if (typeof imageInfo === "string") {
            return {
              url: imageInfo,
              hash: "legacy_hash", // Временное значение для legacy данных
              bookId: +id,
            };
          } else if (imageInfo && typeof imageInfo === "object") {
            return {
              url: imageInfo.url || imageInfo.imgUrl, // поддерживаем оба варианта
              hash: imageInfo.phash || imageInfo.hash || "fallback_hash",
              bookId: +id,
            };
          } else {
            throw new Error(
              `Invalid image data structure: ${JSON.stringify(imageInfo)}`,
            );
          }
        });
        await prisma.bookImage.createMany({
          data: imageData,
          skipDuplicates: true,
        });
      }

      const updated = await prisma.book.update({
        where: { id: +id },
        data: {
          title: parsed.title,
          author: parsed.author,
          description: parsed.description,
          categories: parsed.categories,
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
              avatar: true,
            },
          },
        },
      });

      return {
        book: updated,
        cloudinaryDeletionResults: {
          deleted: deletedFromCloudinary,
          failed: failedToDeleteFromCloudinary,
        },
      };
    });

    const responseData: any = {
      book: updatedBook.book,
    };

    if (process.env.NODE_ENV === "development") {
      responseData.cloudinaryDeletionResults =
        updatedBook.cloudinaryDeletionResults;
    }

    return NextResponse.json(responseData, { status: 200 });
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
