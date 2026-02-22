import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

// Protect /account — must be logged in
export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // /account requires auth
        if (req.nextUrl.pathname.startsWith('/account')) {
          return !!token;
        }
        return true;
      },
    },
    pages: { signIn: '/login' },
  }
);

export const config = {
  matcher: ['/account/:path*'],
};
