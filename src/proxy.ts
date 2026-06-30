// Next.js 16 Proxy (the file formerly known as Middleware — renamed in v16).
//
// Two jobs, both for the admin face only (the matcher scopes us to /admin):
//   1. Refresh the InsForge session on every admin navigation. `updateSession`
//      rotates the short-lived access token using the httpOnly refresh token and
//      writes the fresh cookies onto the response, so Server Components below
//      render with a valid session instead of a stale/expired one.
//   2. First-gate the admin area: if there's no access token after the refresh,
//      the visitor isn't signed in — bounce them to /admin/login (remembering
//      where they were headed via ?redirect=).
//
// This is only the FIRST gate. Per Next's own guidance ("always verify auth
// inside each Server Function rather than relying on the proxy alone"), the real
// JWT verification runs again in the admin layout (getSessionUser) and every
// Server Action, and the database itself is locked down by RLS. Defense in depth.

import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@insforge/sdk/ssr/middleware";

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request });

  // Keep the session fresh before any admin Server Component renders.
  // updateSession only READS the request cookies, so a thin reader adapter
  // sidesteps the RequestCookies-vs-CookieStore `set` signature mismatch (Next's
  // RequestCookies.set is 2-arg; InsForge's CookieStore expects 3-arg) without
  // an unsafe cast. The response cookie store is fully compatible as-is.
  await updateSession({
    requestCookies: { get: (name: string) => request.cookies.get(name) },
    responseCookies: response.cookies,
  });

  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/admin/login";

  // The login page must stay reachable while signed out — everything else under
  // /admin requires a session. Check the access token on both stores: the
  // response holds it if `updateSession` just refreshed; the request holds it if
  // the existing token was still valid and nothing was rewritten.
  if (!isLoginPage) {
    const accessToken =
      response.cookies.get("insforge_access_token")?.value ??
      request.cookies.get("insforge_access_token")?.value;

    if (!accessToken) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

// Scope the proxy to the admin face so the public landing page pays zero cost.
export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
