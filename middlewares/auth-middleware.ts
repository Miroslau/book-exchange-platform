import { MiddlewareFactory } from "@/middlewares/diddleware-factory";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes = ["/dashboard"];
const authPages = ["/sign-in", "/sign-up"];

export const authMiddleware: MiddlewareFactory = (next) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
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

    return next(request, _next);
  };
};
