import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { STRIPE_ENABLED, getStripeDisabledMessage } from '@/lib/stripe-config';

const stripe = STRIPE_ENABLED ? new Stripe(process.env.STRIPE_SECRET_KEY!) : null;

export async function POST(req: NextRequest) {
  // Return friendly error if Stripe is not configured
  if (!STRIPE_ENABLED || !stripe) {
    return NextResponse.json(
      { 
        error: 'Stripe not configured',
        message: getStripeDisabledMessage()
      },
      { status: 503 }
    );
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const origin = req.headers.get('origin') ?? 'http://localhost:3000';

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: user.stripeCustomerId ? undefined : user.email,
    customer: user.stripeCustomerId ?? undefined,
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    success_url: `${origin}/account?upgraded=true`,
    cancel_url: `${origin}/pricing`,
    metadata: { userId: user.id },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
