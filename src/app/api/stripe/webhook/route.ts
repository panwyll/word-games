import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { STRIPE_WEBHOOK_ENABLED } from '@/lib/stripe-config';

// Never statically pre-render — Stripe key is only available at runtime.
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const stripe = STRIPE_WEBHOOK_ENABLED ? new Stripe(process.env.STRIPE_SECRET_KEY!) : null;

export async function POST(req: NextRequest) {
  // Silently accept webhooks if Stripe is not configured (e.g., in dev/sandbox mode)
  if (!STRIPE_WEBHOOK_ENABLED || !stripe) {
    return NextResponse.json({ received: true, sandbox: true });
  }

  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) return NextResponse.json({ error: 'No signature' }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('[webhook] signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const cs = event.data.object as Stripe.Checkout.Session;
      if (cs.mode === 'subscription' && cs.metadata?.userId) {
        await prisma.user.update({
          where: { id: cs.metadata.userId },
          data: {
            tier: 'premium',
            stripeCustomerId: cs.customer as string,
            subscriptionId: cs.subscription as string,
            subscriptionStatus: 'active',
          },
        });
      }
      break;
    }
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      const status = sub.status;
      const tier = status === 'active' || status === 'trialing' ? 'premium' : 'free';
      // Store the period end so we know when access expires even after cancellation.
      const subscriptionEnd = sub.current_period_end
        ? new Date(sub.current_period_end * 1000)
        : null;
      await prisma.user.updateMany({
        where: { stripeCustomerId: sub.customer as string },
        data: { tier, subscriptionStatus: status, subscriptionEnd },
      });
      break;
    }
    case 'invoice.payment_failed': {
      const inv = event.data.object as Stripe.Invoice;
      await prisma.user.updateMany({
        where: { stripeCustomerId: inv.customer as string },
        data: { tier: 'free', subscriptionStatus: 'past_due' },
      });
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
