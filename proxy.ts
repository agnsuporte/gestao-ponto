// // export const config = {
// //   // Mantém o teu matcher original
// //   matcher: ["/time-record/:path*"],
// // };

// export const config = {
//   matcher: [
//     {
//       source: '/time-record/:path*',
//     },
//   ],
// }

// import { withAuth } from "next-auth/middleware";

// export default withAuth();

// export const config = {
//   matcher: ["/time-record/:path*"],
// };
export { default } from "next-auth/middleware";

import NextAuth from "next-auth/middleware";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  return NextAuth(req);
}

export const config = {
  matcher: ["/time-record/:path*"],
};