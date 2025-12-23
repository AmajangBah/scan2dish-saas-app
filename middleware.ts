import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n";

// Create i18n middleware
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "as-needed", // Don't add /en prefix for default locale
});

/**
 * Middleware to:
 * 1. Handle internationalization (i18n)
 * 2. Protect authenticated routes
 * 3. Refresh Supabase session
 */
export async function middleware(request: NextRequest) {
  // Handle i18n first
  const intlResponse = intlMiddleware(request);
  
  // If i18n middleware wants to redirect, let it
  if (intlResponse && intlResponse.headers.get("x-middleware-rewrite")) {
    return intlResponse;
  }
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!user) {
      // Redirect to login with return URL
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect authenticated users away from auth pages
  if (
    (request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/register") &&
    user
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    // Enable i18n routing on all paths except static files
    "/((?!api|_next|_vercel|.*\\..*).*)",
    // Also match root
    "/",
  ],
};
