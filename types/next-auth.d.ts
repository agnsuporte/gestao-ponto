import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      billingStatus?: string | null;
    } & DefaultSession['user'];
  }
  /**
   * O objeto User que vem do adaptador ou do authorize
   */
  interface User {
    billingStatus?: string | null;
  }  
}

declare module "next-auth/jwt" {
  /** Retornado pelo callback `jwt` */
  interface JWT {
    id: string;
    billingStatus?: string | null;
  }
}