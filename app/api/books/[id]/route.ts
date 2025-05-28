import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/db";

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
        owner: true,
        comments: true,
      },
    });

    if (!book) {
      return NextResponse.json(
        { message: "The book doesn't exist" },
        { status: 404 },
      );
    }

    return NextResponse.json({ book: book }, { status: 201 });
  } catch (error) {}
}
