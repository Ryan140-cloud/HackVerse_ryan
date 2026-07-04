import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const { token, password } = await request.json();
    if (!token || !password || password.length < 8) {
      return NextResponse.json({ error: 'Invalid input.' }, { status: 400 });
    }
    if (!prisma) {
      return NextResponse.json({ error: 'Database is not configured.' }, { status: 503 });
    }
    const record = await prisma.passwordResetToken.findUnique({ where: { token } });
    if (!record || record.expires < new Date()) {
      return NextResponse.json({ error: 'Token expired.' }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { email: record.email },
      data: { hashedPassword },
    });
    await prisma.passwordResetToken.delete({ where: { token } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[reset-password]', e);
    return NextResponse.json({ error: 'Unable to reset password.' }, { status: 500 });
  }
}
