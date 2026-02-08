export { default } from "next-auth/middleware";

export const config = {
  // A rota /time-record (e sub-rotas) será protegida
  matcher: ["/time-record/:path*"],
};