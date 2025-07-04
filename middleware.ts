import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Admin routes
    if (path.startsWith("/admin") && token?.userType !== "admin") {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    // Doctor routes
    if (path.startsWith("/doctor") && token?.userType !== "doctor") {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    // Patient routes
    if (path.startsWith("/patient") && token?.userType !== "patient") {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    // Dashboard routes
    if (path.startsWith("/dashboard")) {
      if (!token) {
        return NextResponse.redirect(new URL("/auth/signin", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/doctor/:path*",
    "/patient/:path*",
    "/appointments/:path*",
    "/sessions/:path*"
  ],
}; 