import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const protectedRoutes = ["/dashboard", "/editor", "/admin/dashboard"];
const authRoutes = ["/login", "/signup", "/forgot-password", "/reset-password"];
const adminRoutePrefix = "/admin";

const verifyAccessToken = async (token: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return null;
  }

  try {
    const encodedSecret = new TextEncoder().encode(secret);
    const result = await jwtVerify(token, encodedSecret);
    return result.payload as { id?: string; role?: string };
  } catch {
    return null;
  }
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const hasSessionCookie = Boolean(accessToken || refreshToken);

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !hasSessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  let userRole: string | undefined;
  if (accessToken) {
    const payload = await verifyAccessToken(accessToken);
    userRole = payload?.role;
  }

  if (pathname.startsWith(adminRoutePrefix)) {
    if (!hasSessionCookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (!accessToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (userRole !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  if (isAuthRoute && hasSessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/editor/:path*",
    "/admin/:path*",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
  ],
};
