import { NextResponse, NextRequest } from "next/server";
import { middlewareShape } from "./type";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const url = request.nextUrl;

  let payloadObject: middlewareShape | null = null;

  if (token) {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) {
        throw new Error("Invalid token format");
      }
      const decodedPayload = atob(parts[1]);
      payloadObject = JSON.parse(decodedPayload);
    } catch (error) {
      console.error("Error decoding token:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (
    !token &&
    (url.pathname === "/" ||
      url.pathname.startsWith("/user") ||
      url.pathname.startsWith("/admin"))
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (
    token &&
    (payloadObject?.role === "user" || payloadObject?.role === "admin") &&
    (url.pathname === "/login" ||
      url.pathname === "/register" ||
      url.pathname === "/send-email" ||
      url.pathname === "/verify-email" ||
      url.pathname === "/forgot-send-email" ||
      url.pathname.startsWith("/forgot-password"))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    token &&
    payloadObject?.role === "user" &&
    url.pathname.startsWith("/admin")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    token &&
    payloadObject?.role === "admin" &&
    (url.pathname === "/" || url.pathname.startsWith("/user"))
  ) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/send-email",
    "/verify-email",
    "/forgot-send-email",
    "/forgot-password/:token",
    "/user/:path*",
    "/admin/:path*",
  ],
};
