import { Resend } from 'resend';
import { getDb } from '../../../lib/db';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request) {
  const data = await request.json();
  const { name, company, email, need, message, providerName, providerId, providerType, score, grade, source } = data;

  const errors = [];

  // 1. Save to Firestore
  const db = getDb();
  if (db) {
    try {
      await db.collection('leads').add({
        name:         name         || null,
        company:      company      || null,
        email:        email        || null,
        need:         need         || null,
        message:      message      || null,
        providerId:   providerId   || null,
        providerName: providerName || null,
        providerType: providerType || null,
        score:        score        || null,
        grade:        grade        || null,
        source:       source       || 'directory',
        createdAt:    new Date(),
      });
    } catch (e) {
      console.error('[Firestore] write error:', e.message);
      errors.push('db');
    }
  } else {
    console.warn('[Firebase] not configured — set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY');
  }

  // 2. Email notification via Resend
  if (resend) {
    const isAssessLead = source === 'assess';
    const subject = isAssessLead
      ? `New assessment lead — ${grade || 'unknown'} (score ${score}/110)`
      : `New inquiry for ${providerName || 'a provider'}`;

    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0F172A;color:#EDF2F7;padding:32px;border-radius:12px">
        <div style="font-size:11px;color:#00E5B0;font-weight:700;letter-spacing:1.5px;margin-bottom:16px">NEW LEAD — CMMCREVIEW.ORG</div>
        <h2 style="font-size:20px;margin:0 0 20px;color:#fff">${subject}</h2>
        <table style="width:100%;border-collapse:collapse">
          ${name         ? `<tr><td style="padding:8px 0;color:#4A5568;font-size:12px;width:140px">Name</td><td style="padding:8px 0;font-size:14px">${name}</td></tr>` : ''}
          ${company      ? `<tr><td style="padding:8px 0;color:#4A5568;font-size:12px">Company</td><td style="padding:8px 0;font-size:14px">${company}</td></tr>` : ''}
          ${email        ? `<tr><td style="padding:8px 0;color:#4A5568;font-size:12px">Email</td><td style="padding:8px 0;font-size:14px"><a href="mailto:${email}" style="color:#42A5F5">${email}</a></td></tr>` : ''}
          ${need         ? `<tr><td style="padding:8px 0;color:#4A5568;font-size:12px">Need</td><td style="padding:8px 0;font-size:14px">${need}</td></tr>` : ''}
          ${message      ? `<tr><td style="padding:8px 0;color:#4A5568;font-size:12px;vertical-align:top">Message</td><td style="padding:8px 0;font-size:14px">${message}</td></tr>` : ''}
          ${providerName ? `<tr><td style="padding:8px 0;color:#4A5568;font-size:12px">Provider</td><td style="padding:8px 0;font-size:14px">${providerName} (${providerType}) — <a href="https://cmmcreview.org/directory/${providerId}" style="color:#42A5F5">view profile</a></td></tr>` : ''}
          ${score        ? `<tr><td style="padding:8px 0;color:#4A5568;font-size:12px">SPRS Score</td><td style="padding:8px 0;font-size:14px;color:#00E5B0;font-weight:700">${score}/110 — ${grade}</td></tr>` : ''}
        </table>
        <div style="margin-top:24px;padding-top:16px;border-top:1px solid #1E2D4A;font-size:11px;color:#4A5568">
          Submitted ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} ET
        </div>
      </div>
    `;

    try {
      await resend.emails.send({
        from: 'CMMCReview Leads <onboarding@resend.dev>',
        to:   'santenrobert@gmail.com',
        subject,
        html,
      });
    } catch (e) {
      console.error('[Resend] email error:', e.message);
      errors.push('email');
    }
  } else {
    console.warn('[Resend] not configured — set RESEND_API_KEY');
  }

  return Response.json({ ok: true, warnings: errors.length ? errors : undefined });
}
