import { Resend } from 'resend';
import { getDb } from '../../../lib/db';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request) {
  const data = await request.json();
  const { org, contact, email, phone, url, tier, message } = data;

  // 1. Save to Firestore
  const db = getDb();
  if (db) {
    try {
      await db.collection('applications').add({
        org, contact, email, phone: phone || null, url: url || null,
        tier, message: message || null, createdAt: new Date(),
      });
    } catch (e) {
      console.error('[Firestore] write error:', e.message);
    }
  }

  // 2. Email notification
  if (resend) {
    try {
      await resend.emails.send({
        from: 'CMMCReview <onboarding@resend.dev>',
        to:   'santenrobert@gmail.com',
        subject: `New listing application — ${org} (${tier})`,
        html: `
          <div style="font-family:sans-serif;max-width:580px;background:#0F172A;color:#EDF2F7;padding:32px;border-radius:12px">
            <div style="font-size:11px;color:#00E5B0;font-weight:700;letter-spacing:1.5px;margin-bottom:16px">LISTING APPLICATION — CMMCREVIEW.ORG</div>
            <h2 style="font-size:20px;margin:0 0 20px">${org}</h2>
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:8px 0;color:#4A5568;font-size:12px;width:140px">Tier</td><td style="padding:8px 0;font-size:14px;color:#00E5B0;font-weight:700">${tier?.toUpperCase()}</td></tr>
              <tr><td style="padding:8px 0;color:#4A5568;font-size:12px">Contact</td><td style="padding:8px 0;font-size:14px">${contact}</td></tr>
              <tr><td style="padding:8px 0;color:#4A5568;font-size:12px">Email</td><td style="padding:8px 0;font-size:14px"><a href="mailto:${email}" style="color:#42A5F5">${email}</a></td></tr>
              ${phone   ? `<tr><td style="padding:8px 0;color:#4A5568;font-size:12px">Phone</td><td style="padding:8px 0;font-size:14px">${phone}</td></tr>` : ''}
              ${url     ? `<tr><td style="padding:8px 0;color:#4A5568;font-size:12px">Website</td><td style="padding:8px 0;font-size:14px"><a href="${url}" style="color:#42A5F5">${url}</a></td></tr>` : ''}
              ${message ? `<tr><td style="padding:8px 0;color:#4A5568;font-size:12px;vertical-align:top">Notes</td><td style="padding:8px 0;font-size:14px">${message}</td></tr>` : ''}
            </table>
            <div style="margin-top:24px;padding-top:16px;border-top:1px solid #1E2D4A;font-size:11px;color:#4A5568">
              ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} ET
            </div>
          </div>
        `,
      });
    } catch (e) {
      console.error('[Resend] email error:', e.message);
    }
  }

  return Response.json({ ok: true });
}
