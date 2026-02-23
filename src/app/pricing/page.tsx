'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const FREE_FEATURES = [
  "Today's daily Wordle",
  "Today's daily Connections",
  "Today's daily Spelling Bee",
  'Score tracking',
  'Streaks & statistics',
];

const PREMIUM_FEATURES = [
  'Everything in Free',
  'Full puzzle archive (all past puzzles)',
  'Bonus challenge puzzles',
  'Unlimited puzzle replays',
  'Priority support',
];

export default function PricingPage() {
  const { data: session } = useSession();
  const isPremium = session?.user?.tier === 'premium';
  const [loading, setLoading] = useState(false);
  const [stripeDisabled, setStripeDisabled] = useState(false);

  useEffect(() => {
    // Check if Stripe is available on mount
    async function checkStripe() {
      try {
        const res = await fetch('/api/stripe/checkout', { method: 'HEAD' });
        setStripeDisabled(res.status === 503);
      } catch {
        setStripeDisabled(true);
      }
    }
    checkStripe();
  }, []);

  async function handleUpgrade() {
    if (!session) {
      window.location.href = '/login?callbackUrl=/pricing';
      return;
    }
    setLoading(true);
    const res = await fetch('/api/stripe/checkout', { method: 'POST' });
    const data = await res.json();
    
    if (res.status === 503) {
      // Stripe not configured
      alert(data.message || 'Payment processing is not available in this environment.');
      setLoading(false);
      return;
    }
    
    if (data.url) window.location.href = data.url;
    else setLoading(false);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Simple, Honest Pricing</h1>
        <p className="text-gray-500 text-lg">Play daily puzzles for free. Unlock everything for less than a coffee.</p>
        {stripeDisabled && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300 rounded-lg text-sm">
            ℹ️ Payment processing is not configured in this environment. All features are available for testing.
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
        {/* Free */}
        <div className="border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-1">Free</h2>
            <div className="text-4xl font-black">$0</div>
            <div className="text-sm text-gray-500">forever</div>
          </div>
          <ul className="space-y-3 mb-8">
            {FREE_FEATURES.map(f => (
              <li key={f} className="flex items-start gap-2 text-sm">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/"
            className="block text-center py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-full font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Play for free
          </Link>
        </div>

        {/* Premium */}
        <div className="border-2 border-yellow-400 rounded-2xl p-8 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="px-4 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
              MOST POPULAR
            </span>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-1">Premium</h2>
            <div className="text-4xl font-black">$4.99</div>
            <div className="text-sm text-gray-500">per month</div>
          </div>
          <ul className="space-y-3 mb-8">
            {PREMIUM_FEATURES.map(f => (
              <li key={f} className="flex items-start gap-2 text-sm">
                <span className="text-yellow-500 mt-0.5">✓</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          {isPremium ? (
            <div className="text-center py-2.5 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 rounded-full font-bold text-sm">
              ✓ You&apos;re Premium!
            </div>
          ) : stripeDisabled ? (
            <div className="text-center py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full font-medium text-sm">
              Payments Not Available
            </div>
          ) : (
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full py-2.5 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold rounded-full transition-colors disabled:opacity-50"
            >
              {loading ? 'Redirecting to checkout…' : 'Upgrade to Premium'}
            </button>
          )}
        </div>
      </div>

      <p className="text-center text-sm text-gray-400 mt-8">
        Cancel anytime. No hidden fees. Secure payments via Stripe.
      </p>
    </div>
  );
}
