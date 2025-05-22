import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes = ["/dashboard"];
const authPages = ["/sign-in", "/sign-up"];

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });
  const pathname = request.nextUrl.pathname;

  const isProtected = protectedRoutes.some((route) => {
    return pathname.startsWith(route);
  });
  const isAuthPage = authPages.includes(pathname);

  if (isProtected && !token) {
    const loginUrl = new URL("/sign-in", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico).*)"], // фильтруем только реальные страницы
};
