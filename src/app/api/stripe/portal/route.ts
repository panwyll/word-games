import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user?.stripeCustomerId) {
    return NextResponse.json({ error: 'No billing account found' }, { status: 400 });
  }

  const origin = req.headers.get('origin') ?? 'http://localhost:3000';
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${origin}/account`,
  });

  return NextResponse.json({ url: portalSession.url });
}
