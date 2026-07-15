import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = [
  "/",
  "/about",
  "/faq",
  "/partners",
  "/mothers",
  "/chew",
  "/login",
  "/register",
  "/setup",
  "/_next",
  "/favicon.ico",
  "/logo.png",
];

function isPublicPath(pathname: string): boolean {
  return publicPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) return NextResponse.next();

  const authToken = request.cookies.get("mama_auth_token")?.value;

  if (!authToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/admin")) {
    try {
      const payload = JSON.parse(atob(authToken.split(".")[1]));
      if (payload.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (pathname.startsWith("/dashboard")) {
    try {
      const payload = JSON.parse(atob(authToken.split(".")[1]));
      if (payload.role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
