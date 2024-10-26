// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function middleware(request: NextRequest) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const isAuthenticated = Boolean(user);

  // List of public routes that do not require authentication
  const publicRoutes = ["/", "/public-page"];

  // If the route is public, allow access without authentication
  if (publicRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // If the user is not authenticated, redirect to the login page
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/api/auth/login", request.url));
  }

  // Proceed if the user is authenticated
  return NextResponse.next();
}

// Configure matcher to apply middleware to all routes except Next.js internal files and APIs
export const config = {
  matcher: ["/((?!api|_next|public).*)"],
};
