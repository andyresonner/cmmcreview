export async function POST(request) {
  const data = await request.json();
  console.log('[Lead]', JSON.stringify({ ts: new Date().toISOString(), ...data }));
  // TODO: add email notification — wire to Resend, SendGrid, or Nodemailer
  // e.g. await resend.emails.send({ from: 'leads@cmmcreview.org', to: 'you@...', subject: `New lead for ${data.providerName}`, html: ... });
  return Response.json({ ok: true });
}
