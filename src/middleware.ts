import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const url = req.nextUrl;

  const authRoutes = url.pathname === "/signin" || url.pathname === "/signup";
  const publicRoutes = url.pathname === "/" || authRoutes;

  if (token && authRoutes) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!token && !publicRoutes) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
