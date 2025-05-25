import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { hash } from "bcrypt";
import * as z from "zod";

interface signUpDTO {
  email: string;
  username: string;
  password: string;
}

interface updateAvatarDTO {
  id: number;
  url: string;
}

const userSchema = z.object({
  username: z.string().min(1, "Username is required").max(100),
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must have than 8 characters"),
});

function errorResponse(message: string, status: number) {
  return NextResponse.json({ user: null, message }, { status });
}

export async function POST(request: Request) {
  try {
    const body: signUpDTO = await request.json();
    const { email, username, password } = userSchema.parse(body);

    const [existingUserByEmail, existingUserByUsername] = await Promise.all([
      db.user.findUnique({ where: { email } }),
      db.user.findUnique({ where: { username } }),
    ]);

    if (existingUserByEmail) {
      return errorResponse("User with this email already exists", 409);
    }

    if (existingUserByUsername) {
      return errorResponse("User with this username already exists", 409);
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await db.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: newUserPassword, ...rest } = newUser;

    return NextResponse.json(
      {
        user: rest,
        message: "User created successfully",
      },
      { status: 201 },
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: unknown) {
    return NextResponse.json(
      {
        message: "Something went wrong. Please try again later",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body: updateAvatarDTO = await request.json();
    const { id, url } = body;
    const user = await db.user.update({
      where: { id },
      data: {
        avatar: url,
      },
    });

    if (!user) {
      return errorResponse("User does not found", 409);
    }

    return NextResponse.json({ user });
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
