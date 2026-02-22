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
        token.tier = (user as any).tier;
      }
      // Refresh tier from DB on each session check so upgrades take effect immediately
      if (token.id) {
        const dbUser = await prisma.user.findUnique({ where: { id: token.id as string } });
        if (dbUser) token.tier = dbUser.tier as 'free' | 'premium';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).tier = token.tier as string;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
