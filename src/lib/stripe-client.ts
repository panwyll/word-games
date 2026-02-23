/**
 * Client-side Stripe utilities
 * 
 * These functions help the UI gracefully handle when Stripe is not configured
 */

/**
 * Check if Stripe checkout is available
 * Makes a lightweight check to the checkout endpoint
 */
export async function isStripeAvailable(): Promise<boolean> {
  try {
    const res = await fetch('/api/stripe/checkout', { 
      method: 'HEAD',
    });
    // 401 means authenticated route but Stripe works, 503 means Stripe not configured
    return res.status !== 503;
  } catch {
    return false;
  }
}
