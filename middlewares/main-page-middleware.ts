import { MiddlewareFactory } from "@/middlewares/diddleware-factory";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export const mainPageMiddleware: MiddlewareFactory = (next) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    const url = request.nextUrl.clone();
    if (url.pathname === "/") {
      url.pathname = "/books";
      return NextResponse.redirect(url);
    }

    return next(request, _next);
  };
};
