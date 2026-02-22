import type { DefaultSession, DefaultUser } from 'next-auth';
import type { JWT as DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & { id: string; tier: 'free' | 'premium' };
  }
  interface User extends DefaultUser {
    tier: 'free' | 'premium';
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    tier: 'free' | 'premium';
  }
}
