import { Resend } from 'resend';
import { getSupabase } from '../../../lib/db';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request) {
  const data = await request.json();
  const { name, company, email, need, message, providerName, providerId, providerType, score, grade, source } = data;

  const errors = [];

  // 1. Save to Supabase
  const sb = getSupabase();
  if (sb) {
    const { error } = await sb.from('leads').insert({
      name, company, email, need, message,
      provider_id: providerId || null,
      provider_name: providerName || null,
      provider_type: providerType || null,
      score: score || null,
      grade: grade || null,
      source: source || 'directory',
    });
    if (error) {
      console.error('[Supabase] insert error:', error.message);
      errors.push('db');
    }
  } else {
    console.warn('[Supabase] not configured — set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  }

  // 2. Send email notification
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
          ${name    ? `<tr><td style="padding:8px 0;color:#4A5568;font-size:12px;width:140px">Name</td><td style="padding:8px 0;font-size:14px">${name}</td></tr>` : ''}
          ${company ? `<tr><td style="padding:8px 0;color:#4A5568;font-size:12px">Company</td><td style="padding:8px 0;font-size:14px">${company}</td></tr>` : ''}
          ${email   ? `<tr><td style="padding:8px 0;color:#4A5568;font-size:12px">Email</td><td style="padding:8px 0;font-size:14px"><a href="mailto:${email}" style="color:#42A5F5">${email}</a></td></tr>` : ''}
          ${need    ? `<tr><td style="padding:8px 0;color:#4A5568;font-size:12px">Need</td><td style="padding:8px 0;font-size:14px">${need}</td></tr>` : ''}
          ${message ? `<tr><td style="padding:8px 0;color:#4A5568;font-size:12px;vertical-align:top">Message</td><td style="padding:8px 0;font-size:14px">${message}</td></tr>` : ''}
          ${providerName ? `<tr><td style="padding:8px 0;color:#4A5568;font-size:12px">Provider</td><td style="padding:8px 0;font-size:14px">${providerName} (${providerType}) — <a href="https://cmmcreview.org/directory/${providerId}" style="color:#42A5F5">view profile</a></td></tr>` : ''}
          ${score   ? `<tr><td style="padding:8px 0;color:#4A5568;font-size:12px">SPRS Score</td><td style="padding:8px 0;font-size:14px;color:#00E5B0;font-weight:700">${score}/110 — ${grade}</td></tr>` : ''}
        </table>
        <div style="margin-top:24px;padding-top:16px;border-top:1px solid #1E2D4A;font-size:11px;color:#4A5568">
          Submitted ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} ET
        </div>
      </div>
    `;

    const { error: emailError } = await resend.emails.send({
      from: 'CMMCReview Leads <onboarding@resend.dev>',
      to:   'santenrobert@gmail.com',
      subject,
      html,
    });
    if (emailError) {
      console.error('[Resend] email error:', emailError.message);
      errors.push('email');
    }
  } else {
    console.warn('[Resend] not configured — set RESEND_API_KEY');
  }

  // Always return success to the user even if notifications failed
  return Response.json({ ok: true, warnings: errors.length ? errors : undefined });
}
