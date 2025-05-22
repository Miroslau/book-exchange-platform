import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/app/lib/db";

export async function GET(req: NextRequest) {
  try {
    let books;
    let username = req.nextUrl.searchParams.get("user");

    if (username && username === "me") {
      const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
        cookieName: "next-auth.session-token",
      });
      console.log("token: ", token);

      if (!token) {
        return NextResponse.json(
          { error: "Unauthorized or expired" },
          { status: 401 },
        );
      }

      username = token.username as string;
      console.log("username");
    }

    if (username) {
      books = await db.book.findMany({
        where: {
          owner: {
            username,
          },
        },
        include: {
          owner: true,
        },
      });
    } else {
      books = await db.book.findMany({
        include: {
          owner: true,
        },
      });
    }

    return NextResponse.json({
      message: "success",
      books: books,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        message: "Something went wrong. Please try again later",
      },
      { status: 500 },
    );
  }
}
