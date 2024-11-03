// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
//
const corsOptions: {
  allowedMethods: string[];
  allowedOrigins: string[];
  allowedHeaders: string[];
  exposedHeaders: string[];
  maxAge?: number;
  credentials: boolean;
} = {
  allowedMethods: (process.env?.ALLOWED_METHODS || "").split(","),
  allowedOrigins: (process.env?.ALLOWED_ORIGIN || "").split(","),
  allowedHeaders: (process.env?.ALLOWED_HEADERS || "").split(","),
  exposedHeaders: (process.env?.EXPOSED_HEADERS || "").split(","),
  maxAge: (process.env?.MAX_AGE && parseInt(process.env?.MAX_AGE)) || undefined, // 60 * 60 * 24 * 30, // 30 days
  credentials: process.env?.CREDENTIALS == "true",
};
//
export async function middleware(request: NextRequest) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const isAuthenticated = Boolean(user);

  // List of public routes that do not require authentication
  const publicRoutes = ["/", "/public"];

  // List of assets in the public folder that should be accessible without authentication
  const publicAssets = ["/logo.svg", "/favicon.ico"]; // Add any other public assets here

  const response = NextResponse.next();
//
  const origin = request.headers.get("origin") ?? "";
  if (
    corsOptions.allowedOrigins.includes("*") ||
    corsOptions.allowedOrigins.includes(origin)
  ) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }

  // Set default CORS headers
  response.headers.set(
    "Access-Control-Allow-Credentials",
    corsOptions.credentials.toString()
  );
  response.headers.set(
    "Access-Control-Allow-Methods",
    corsOptions.allowedMethods.join(",")
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    corsOptions.allowedHeaders.join(",")
  );
  response.headers.set(
    "Access-Control-Expose-Headers",
    corsOptions.exposedHeaders.join(",")
  );
  response.headers.set(
    "Access-Control-Max-Age",
    corsOptions.maxAge?.toString() ?? ""
  );

//
  // Allow access to public assets like logo, favicon, etc.
  if (publicAssets.includes(request.nextUrl.pathname)) {
    return response;
  }

  // If the route is public, allow access without authentication
  if (publicRoutes.includes(request.nextUrl.pathname)) {
    return response;
  }

  // If the user is not authenticated, redirect to the login page
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/api/auth/login", request.url));
  }

  // Proceed if the user is authenticated
  return response;
}

// Configure matcher to apply middleware to all routes except Next.js internal files and APIs
export const config = {
  matcher: ["/((?!api|_next).*)"],
};
