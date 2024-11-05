// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "@auth0/nextjs-auth0/edge";

export async function middleware(request: NextRequest) {
  const session = await getSession();

  const user = session?.user;
  // const isAuthenticated = Boolean(user);

  // List of public routes that do not require authentication
  const publicRoutes = ["/", "/public"];

  // List of assets in the public folder that should be accessible without authentication
  const publicAssets = ["/logo.svg", "/favicon.ico"]; // Add any other public assets here

  const response = NextResponse.next();

  // Allow access to public assets like logo, favicon, etc.
  if (publicAssets.includes(request.nextUrl.pathname)) {
    return response;
  }

  // If the route is public, allow access without authentication
  if (publicRoutes.includes(request.nextUrl.pathname)) {
    return response;
  }

  // If the user is not authenticated, redirect to the login page
  if (!user) {
    return NextResponse.redirect(new URL("/api/auth/login", request.url));
  }

  // Proceed if the user is authenticated
  return response;
}

// Configure matcher to apply middleware to all routes except Next.js internal files and APIs
export const config = {
  matcher: ["/((?!api|_next).*)"],
};
