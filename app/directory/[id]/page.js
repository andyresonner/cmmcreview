import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { C, f } from '../../../lib/constants';
import { Badge } from '../../../lib/ui';

export const dynamic = 'force-dynamic';

const TYPE_LABEL = {
  C3PAO: 'Certified 3rd Party Assessor Org',
  RPO:   'Registered Provider Org',
  LTP:   'Licensed Training Provider',
  LPP:   'Licensed Partner Publisher',
  RP:    'Registered Practitioner',
  CCP:   'Certified CMMC Professional',
  CCA:   'Certified CMMC Assessor',
  LCCA:  'Lead CCA',
  RPA:   'Registered Practitioner Advanced',
  PI:    'Provisional Instructor',
};

const TYPE_COLOR = {
  C3PAO: C.purple, RPO: C.primary, LTP: C.blue, LPP: C.blue,
  RP: C.warn, CCP: C.accent, CCA: C.accent, LCCA: C.accent, RPA: C.warn, PI: C.primary,
};

function getProvider(id) {
  const filePath = path.join(process.cwd(), 'public', 'providers.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  return data.find(p => String(p.storeId) === String(id)) || null;
}

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', gap: 16, padding: '12px 0', borderBottom: `1px solid ${C.border}` }}>
      <span style={{ width: 160, flexShrink: 0, fontSize: 12, color: C.muted, fontFamily: f.m, paddingTop: 1 }}>{label}</span>
      <span style={{ fontSize: 13, color: C.off, lineHeight: 1.5, wordBreak: 'break-word' }}>{value}</span>
    </div>
  );
}

export default function ProviderPage({ params }) {
  const p = getProvider(params.id);
  if (!p) notFound();

  const color    = TYPE_COLOR[p.type] || C.primary;
  const location = [p.city, p.state, p.country !== 'USA' ? p.country : null].filter(Boolean).join(', ');
  const services = p.cmmcServices || [];
  const certs    = p.certifications || [];

  return (
    <div style={{ paddingTop: 56, minHeight: '100vh', background: C.bg }}>
      {/* Header */}
      <section style={{ padding: '48px 32px 32px', background: C.bgMid, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <Link href="/directory" style={{ fontSize: 12, color: C.muted, textDecoration: 'none', fontFamily: f.m, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
            ← Back to Directory
          </Link>

          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
            <div style={{
              width: 64, height: 64, borderRadius: 14, flexShrink: 0,
              background: color + '14', border: `1px solid ${color}28`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: f.m, fontSize: 11, fontWeight: 700, color,
            }}>{p.type}</div>

            <div style={{ flex: 1 }}>
              <h1 style={{ fontFamily: f.h, fontSize: 30, fontWeight: 900, color: C.white, margin: '0 0 8px', letterSpacing: -0.5 }}>
                {p.name}
              </h1>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <Badge color={color} mono>{p.type}</Badge>
                <span style={{ fontSize: 13, color: C.off }}>{TYPE_LABEL[p.type]}</span>
                {location && <span style={{ fontSize: 13, color: C.muted }}>· {location}</span>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section style={{ padding: '32px 32px 80px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 300px', gap: 28 }}>

          {/* Left: details */}
          <div>
            {p.description && (
              <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontFamily: f.h, fontSize: 15, fontWeight: 700, color: C.white, marginBottom: 10 }}>About</h2>
                <p style={{ fontSize: 13, color: C.off, lineHeight: 1.8 }}>{p.description}</p>
              </div>
            )}

            {services.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontFamily: f.h, fontSize: 15, fontWeight: 700, color: C.white, marginBottom: 12 }}>CMMC Services</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {services.map((s, i) => (
                    <span key={i} style={{
                      fontSize: 12, padding: '5px 12px', borderRadius: 6,
                      background: color + '10', color, fontFamily: f.m,
                      border: `1px solid ${color}22`,
                    }}>{s}</span>
                  ))}
                </div>
              </div>
            )}

            {certs.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontFamily: f.h, fontSize: 15, fontWeight: 700, color: C.white, marginBottom: 12 }}>Certifications</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {certs.map((c, i) => (
                    <span key={i} style={{
                      fontSize: 12, padding: '5px 12px', borderRadius: 6,
                      background: C.purple + '10', color: C.purple, fontFamily: f.m,
                      border: `1px solid ${C.purple}22`,
                    }}>{c}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Info table */}
            <div style={{ borderTop: `1px solid ${C.border}` }}>
              <InfoRow label="Website"     value={p.website} />
              <InfoRow label="Phone"       value={p.phone} />
              <InfoRow label="Email"       value={p.email} />
              <InfoRow label="Location"    value={location} />
              <InfoRow label="Year Founded" value={p.yearFounded} />
              <InfoRow label="Ownership"   value={p.ownership} />
              <InfoRow label="NAICS Code"  value={p.naicsCode} />
              <InfoRow label="States Served" value={p.usStatesSupported} />
              <InfoRow label="Remote / Global" value={p.remoteGlobally} />
            </div>
          </div>

          {/* Right: sidebar */}
          <div>
            <div style={{ padding: 20, borderRadius: 12, background: C.bgCard, border: `1px solid ${C.border}`, marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: C.muted, fontFamily: f.m, marginBottom: 12 }}>Contact</div>
              {p.website && (
                <a href={p.website.startsWith('http') ? p.website : `https://${p.website}`}
                   target="_blank" rel="noopener noreferrer"
                   style={{
                     display: 'block', width: '100%', padding: '11px 0', borderRadius: 8,
                     background: color, color: '#000', fontSize: 13, fontWeight: 700,
                     fontFamily: f.h, textAlign: 'center', textDecoration: 'none', marginBottom: 8,
                   }}>
                  Visit Website ↗
                </a>
              )}
              {p.email && (
                <a href={`mailto:${p.email}`}
                   style={{
                     display: 'block', width: '100%', padding: '11px 0', borderRadius: 8,
                     background: color + '14', color, fontSize: 13, fontWeight: 700,
                     fontFamily: f.h, textAlign: 'center', textDecoration: 'none',
                   }}>
                  Send Email
                </a>
              )}
            </div>

            {p.profileUrl && (
              <a href={p.profileUrl} target="_blank" rel="noopener noreferrer"
                 style={{
                   display: 'block', padding: '12px 16px', borderRadius: 10,
                   background: C.bgCard, border: `1px solid ${C.border}`,
                   fontSize: 12, color: C.muted, textDecoration: 'none',
                   fontFamily: f.m, textAlign: 'center',
                 }}>
                View on Cyber AB Marketplace ↗
              </a>
            )}

            <div style={{ marginTop: 14, padding: 16, borderRadius: 10, background: C.bgCard, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 11, color: C.muted, fontFamily: f.m, marginBottom: 6 }}>Provider ID</div>
              <div style={{ fontSize: 13, color: C.off, fontFamily: f.m }}>{p.storeId}</div>
              <div style={{ fontSize: 11, color: C.muted, fontFamily: f.m, marginTop: 10, marginBottom: 6 }}>Tier 3 Eligible</div>
              <div style={{ fontSize: 13, color: p.hasTier3 ? C.primary : C.muted, fontFamily: f.m }}>
                {p.hasTier3 ? '✓ Yes' : 'No'}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
