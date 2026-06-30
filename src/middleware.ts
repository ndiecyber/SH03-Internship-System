import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getRequiredRoleForPath } from "@/lib/auth/role-guards";

export default auth((request) => {
  const requiredRole = getRequiredRoleForPath(request.nextUrl.pathname);
  const userRole = request.auth?.user?.role;

  if (!requiredRole) {
    return NextResponse.next();
  }

  if (!request.auth?.user) {
    const loginUrl = new URL("/login", request.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.href);
    return NextResponse.redirect(loginUrl);
  }

  if (userRole !== requiredRole) {
    return NextResponse.redirect(new URL("/", request.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/mentor/:path*", "/intern/:path*"]
};
