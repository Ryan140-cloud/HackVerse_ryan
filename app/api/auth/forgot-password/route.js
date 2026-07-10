import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import prisma from '@/lib/prisma';
import { sendEmail, resetPasswordTemplate } from '@/lib/mail';

export async function POST(request) {
  try {
    const { email } = await request.json();
    if (!email) return NextResponse.json({ error: 'Email is required.' }, { status: 400 });

    // Silent success — never reveal whether the account exists.
    if (prisma) {
      const user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        const token = randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 60 * 60 * 1000); // 1h
        await prisma.passwordResetToken.create({
          data: { email, token, expires },
        });
        const url = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
        await sendEmail({
          to: email,
          subject: 'Reset your HackVerse password',
          html: resetPasswordTemplate({ url }),
        });
      }
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[forgot-password]', e);
    // Still return ok to avoid enumeration.
    return NextResponse.json({ ok: true });
  }
}
