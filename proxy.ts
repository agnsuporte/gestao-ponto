
// export { default } from "next-auth/middleware";

// import NextAuth from "next-auth/middleware";
// import type { NextRequest } from "next/server";

// export function proxy(req: NextRequest) {
//   return NextAuth(req);
// }

// export const config = {
//   matcher: ["/time-record/:path*"],
// };

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const status = token?.billingStatus;
    // const isAuth = !!token;
    // const isTryingToAccessApp = req.nextUrl.pathname.startsWith("/time-record");

    // Se estiver logado, mas NÃO for 'active' nem 'free_trial'
    if (req.nextUrl.pathname.startsWith("/time-record") && status !== "active" && status !== "free_trial") {
      return NextResponse.redirect(new URL("/billing", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // O middleware só executa se o user estiver autenticado
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/time-record/:path*"],
};
