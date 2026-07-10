// Email delivery layer. Uses Resend when RESEND_API_KEY is set; otherwise
// falls back to console.log so development can proceed without credentials.

export async function sendEmail({ to, subject, html, text }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || 'HackVerse <no-reply@hackverse.dev>';

  if (!apiKey) {
    // eslint-disable-next-line no-console
    console.log('[email:stub]', { to, subject, from });
    return { ok: true, stubbed: true };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to, subject, html, text }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }
    return { ok: true };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('[email:error]', e);
    return { ok: false, error: String(e) };
  }
}

export function verifyEmailTemplate({ url, name }) {
  return `
    <div style="font-family: Inter, sans-serif; padding: 24px;">
      <h1 style="color:#7c3aed;">Welcome to HackVerse✨</h1>
      <p>Hi ${name || 'there'}, please verify your email to activate your account.</p>
      <p><a href="${url}" style="background:#7c3aed;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;">Verify email</a></p>
      <p style="color:#666;">Or open this link: ${url}</p>
    </div>
  `;
}

export function resetPasswordTemplate({ url }) {
  return `
    <div style="font-family: Inter, sans-serif; padding: 24px;">
      <h1 style="color:#7c3aed;">Reset your password</h1>
      <p>Click below to choose a new password. The link expires in 1 hour.</p>
      <p><a href="${url}" style="background:#7c3aed;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;">Reset password</a></p>
      <p style="color:#666;">If you didn’t request this, ignore this email.</p>
    </div>
  `;
}
