/**
 * Custom React hook to check if Stripe is configured
 * Used by pricing and account pages to detect sandbox mode
 */
import { useEffect, useState } from 'react';

export function useStripeAvailable() {
  const [stripeDisabled, setStripeDisabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkStripe() {
      try {
        const res = await fetch('/api/stripe/checkout', { method: 'HEAD' });
        setStripeDisabled(res.status === 503);
      } catch {
        setStripeDisabled(true);
      } finally {
        setLoading(false);
      }
    }
    checkStripe();
  }, []);

  return { stripeDisabled, loading };
}
