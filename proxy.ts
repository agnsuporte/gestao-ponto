
export { default } from "next-auth/middleware";

import NextAuth from "next-auth/middleware";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  return NextAuth(req);
}

export const config = {
  matcher: ["/time-record/:path*"],
};