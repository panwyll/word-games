/**
 * Stripe configuration and sandbox mode detection
 * 
 * When Stripe environment variables are missing, the app runs in "sandbox mode":
 * - Stripe API routes return helpful error messages
 * - Premium features are disabled or simulated
 * - Word games remain fully functional
 */

export const STRIPE_ENABLED = !!(
  process.env.STRIPE_SECRET_KEY &&
  process.env.STRIPE_PRICE_ID
);

export const STRIPE_WEBHOOK_ENABLED = !!(
  STRIPE_ENABLED && process.env.STRIPE_WEBHOOK_SECRET
);

/**
 * Check if Stripe is configured on the server side
 */
export function isStripeConfigured(): boolean {
  return STRIPE_ENABLED;
}

/**
 * Get a user-friendly message for when Stripe is not configured
 */
export function getStripeDisabledMessage(): string {
  return 'Payment processing is not configured in this environment. All features are available for testing.';
}
