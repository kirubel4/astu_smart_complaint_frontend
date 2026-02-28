import { NextRequest, NextResponse } from "next/server";

const rolePathMap: Record<string, string> = {
  STUDENT: "/student",
  STAFF: "/staff",
  ADMIN: "/admin",
};

function decodeRole(token: string): string | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const parsed = JSON.parse(atob(padded));
    return parsed.role ?? null;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("astu_token")?.value;

  const protectedPrefixes = ["/student", "/staff", "/admin", "/notifications"];
  const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));

  if (!isProtected) return NextResponse.next();

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const role = decodeRole(token);
  if (!role) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const expectedPrefix = rolePathMap[role];
  const roleCompatiblePath =
    !!expectedPrefix &&
    (pathname === "/notifications" || pathname.startsWith(expectedPrefix) || pathname === `${expectedPrefix}/notifications`);

  if (!expectedPrefix || !roleCompatiblePath) {
    return NextResponse.redirect(new URL(expectedPrefix || "/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/student/:path*", "/staff/:path*", "/admin/:path*", "/notifications"],
};
