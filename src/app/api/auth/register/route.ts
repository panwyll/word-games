import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }
    const passwordHash = await hash(password, 12);
    const user = await prisma.user.create({
      data: { email, passwordHash, name: name || null },
    });
    return NextResponse.json({ id: user.id, email: user.email });
  } catch (err) {
    console.error('[register] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
