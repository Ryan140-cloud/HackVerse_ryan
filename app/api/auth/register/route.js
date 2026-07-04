import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import prisma from '@/lib/prisma';

const schema = z.object({
  name: z.string().min(1).max(60).optional(),
  email: z.string().email(),
  password: z.string().min(8).max(72),
});

export async function POST(request) {
  if (!prisma) {
    return NextResponse.json(
      { error: 'Database is not yet configured. Set DATABASE_URL and run `npx prisma migrate deploy`.' },
      { status: 503 }
    );
  }
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    const { name, email, password } = parsed.data;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'An account with that email already exists.' }, { status: 409 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, hashedPassword, role: 'USER' },
      select: { id: true, email: true, name: true, role: true },
    });
    return NextResponse.json({ ok: true, user });
  } catch (e) {
    console.error('[register]', e);
    return NextResponse.json({ error: 'Unable to create account right now.' }, { status: 500 });
  }
}
