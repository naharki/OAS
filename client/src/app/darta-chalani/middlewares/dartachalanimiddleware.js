// src/middleware.js
import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access_token")?.value;

  const isLoginPage = pathname === "/darta-chalani/login";
  const isProtectedRoute = pathname.startsWith("/darta-chalani/dashboard");

  // 🔒 Not logged in → redirect BEFORE page renders
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(
      new URL("/darta-chalani/login", request.url)
    );
  }

  // 🔁 Logged in → block login page
  if (isLoginPage && token) {
    return NextResponse.redirect(
      new URL("/darta-chalani/dashboard", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/darta-chalani/dashboard/:path*", "/darta-chalani/login"],
};
