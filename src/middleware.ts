// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function middleware(request: NextRequest) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const isAuthenticated = Boolean(user);

  // List of public routes that do not require authentication
  const publicRoutes = ["/", "/public"];

  // List of assets in the public folder that should be accessible without authentication
  const publicAssets = ["/logo.svg", "/favicon.ico"]; // Add any other public assets here

  // Allow access to public assets like logo, favicon, etc.
  if (publicAssets.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

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
  matcher: ["/((?!api|_next).*)"],
};
