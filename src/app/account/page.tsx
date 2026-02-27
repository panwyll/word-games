'use client';

import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState, Suspense } from 'react';
import { useStripeAvailable } from '@/lib/stripe-client';

function AccountContent() {
  const { data: session } = useSession();
  const params = useSearchParams();
  const upgraded = params.get('upgraded') === 'true';
  const [portalLoading, setPortalLoading] = useState(false);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const { stripeDisabled } = useStripeAvailable();

  const tier = session?.user?.tier ?? 'free';
  const isPremium = tier === 'premium';

  async function openPortal() {
    setPortalLoading(true);
    const res = await fetch('/api/stripe/portal', { method: 'POST' });
    const data = await res.json();
    
    if (res.status === 503) {
      alert(data.message || 'Billing portal is not available in this environment.');
      setPortalLoading(false);
      return;
    }
    
    if (data.url) window.location.href = data.url;
    else setPortalLoading(false);
  }

  async function handleUpgrade() {
    setUpgradeLoading(true);
    const res = await fetch('/api/stripe/checkout', { method: 'POST' });
    const data = await res.json();
    
    if (res.status === 503) {
      alert(data.message || 'Payment processing is not available in this environment.');
      setUpgradeLoading(false);
      return;
    }
    
    if (data.url) window.location.href = data.url;
    else setUpgradeLoading(false);
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Account</h1>

      {upgraded && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded-xl" role="alert">
          🎉 Welcome to Premium! All puzzles are now unlocked.
        </div>
      )}

      {stripeDisabled && (
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300 rounded-xl text-sm">
          ℹ️ Payment processing is not configured in this environment. All features are available for testing.
        </div>
      )}

      <div className="space-y-6">
        {/* Profile */}
        <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-2xl">
          <h2 className="font-semibold mb-4 text-sm uppercase tracking-wide text-gray-500">Profile</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Name</dt>
              <dd className="font-medium">{session?.user?.name ?? '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Email</dt>
              <dd className="font-medium">{session?.user?.email}</dd>
            </div>
          </dl>
        </div>

        {/* Subscription */}
        <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-2xl">
          <h2 className="font-semibold mb-4 text-sm uppercase tracking-wide text-gray-500">Subscription</h2>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Current plan</span>
            {isPremium ? (
              <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-sm font-bold rounded-full">
                Premium
              </span>
            ) : (
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm font-medium rounded-full">
                Free
              </span>
            )}
          </div>
          {stripeDisabled ? (
            <div className="text-center py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-sm font-medium">
              Payments Not Available
            </div>
          ) : isPremium ? (
            <button
              onClick={openPortal}
              disabled={portalLoading}
              className="w-full py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-full text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {portalLoading ? 'Loading…' : 'Manage billing'}
            </button>
          ) : (
            <button
              onClick={handleUpgrade}
              disabled={upgradeLoading}
              className="w-full py-2.5 bg-yellow-400 hover:bg-yellow-300 text-gray-900 rounded-full text-sm font-bold transition-colors disabled:opacity-50"
            >
              {upgradeLoading ? 'Loading…' : 'Upgrade to Premium – $4.99/mo'}
            </button>
          )}
        </div>

        {/* Games */}
        <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-2xl">
          <h2 className="font-semibold mb-4 text-sm uppercase tracking-wide text-gray-500">Today&apos;s Puzzles</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { href: '/wordle', label: 'Wordle', emoji: '🟩' },
              { href: '/connections', label: 'Connections', emoji: '🟨' },
              { href: '/spelling-bee', label: 'Spelling Bee', emoji: '🐝' },
            ].map(g => (
              <Link key={g.href} href={g.href} className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-center text-sm">
                <span className="text-2xl mb-1">{g.emoji}</span>
                {g.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense>
      <AccountContent />
    </Suspense>
  );
}
