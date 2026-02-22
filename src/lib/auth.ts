import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user) return null;
        const valid = await compare(credentials.password, user.passwordHash);
        if (!valid) return null;
        return { id: user.id, email: user.email, name: user.name ?? undefined, tier: user.tier as 'free' | 'premium' };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.tier = user.tier;
      }
      // Refresh tier from DB at most every 5 minutes so upgrades take effect promptly
      // without hammering the database on every request.
      const FIVE_MINUTES = 5 * 60;
      const now = Math.floor(Date.now() / 1000);
      const lastRefresh = (token.tierRefreshedAt as number | undefined) ?? 0;
      if (token.id && now - lastRefresh > FIVE_MINUTES) {
        const dbUser = await prisma.user.findUnique({ where: { id: token.id } });
        if (dbUser) {
          token.tier = dbUser.tier as 'free' | 'premium';
          token.tierRefreshedAt = now;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.tier = token.tier;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
