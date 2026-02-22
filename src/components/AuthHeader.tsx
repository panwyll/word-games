'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function AuthHeader() {
  const { data: session, status } = useSession();

  if (status === 'loading') return null;

  if (!session) {
    return (
      <div className="flex items-center gap-2 ml-2 border-l border-gray-200 dark:border-gray-700 pl-4">
        <Link href="/login" className="hover:underline text-gray-600 dark:text-gray-400">Sign in</Link>
        <Link href="/signup" className="px-3 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full text-xs font-bold hover:opacity-90 transition-opacity">
          Sign up
        </Link>
      </div>
    );
  }

  const tier = session.user.tier;
  const isPremium = tier === 'premium';

  return (
    <div className="flex items-center gap-2 ml-2 border-l border-gray-200 dark:border-gray-700 pl-4">
      {isPremium && (
        <span className="px-2 py-0.5 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
          PREMIUM
        </span>
      )}
      <Link href="/account" className="hover:underline text-gray-600 dark:text-gray-400 max-w-24 truncate">
        {session.user?.name ?? session.user?.email?.split('@')[0]}
      </Link>
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:underline"
      >
        Sign out
      </button>
    </div>
  );
}
