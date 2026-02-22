'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface PremiumGateProps {
  children: React.ReactNode;
}

export default function PremiumGate({ children }: PremiumGateProps) {
  const { data: session, status } = useSession();
  const isPremium = session?.user?.tier === 'premium';

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-yellow-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isPremium) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="text-6xl mb-6">🔒</div>
        <h2 className="text-2xl font-bold mb-3">Premium Feature</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
          Archive puzzles and bonus challenges are available to Premium subscribers.
          Upgrade now for unlimited access to all puzzles, past and future.
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <Link
            href="/pricing"
            className="px-8 py-3 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold rounded-full transition-colors"
          >
            Upgrade to Premium – $4.99/mo
          </Link>
          {!session && (
            <Link
              href="/login"
              className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
