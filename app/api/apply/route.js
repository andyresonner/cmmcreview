export async function POST(request) {
  const data = await request.json();
  console.log('[Listing Application]', JSON.stringify({ ts: new Date().toISOString(), ...data }));
  // TODO: wire email notification to your inbox
  return Response.json({ ok: true });
}
