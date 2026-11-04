import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import { C, f } from '../../../lib/constants';
import { Badge } from '../../../lib/ui';
import ProfileClient from './ProfileClient';

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
  const data = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public', 'providers.json'), 'utf-8'));
  return data.find(p => String(p.storeId) === String(id)) || null;
}

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', gap: 16, padding: '12px 0', borderBottom: `1px solid ${C.border}` }}>
      <span style={{ width: 160, flexShrink: 0, fontSize: 12, color: C.muted, fontFamily: f.m, paddingTop: 1 }}>{label}</span>
      <span style={{ fontSize: 13, color: C.off, lineHeight: 1.5, wordBreak: 'break-word' }}>
        {label === 'Website'
          ? <a href={value.startsWith('http') ? value : `https://${value}`} target="_blank" rel="noopener noreferrer" style={{ color: C.blue, textDecoration: 'none' }}>{value} ↗</a>
          : label === 'Email'
          ? <a href={`mailto:${value}`} style={{ color: C.blue, textDecoration: 'none' }}>{value}</a>
          : value}
      </span>
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
        <div style={{ maxWidth: 920, margin: '0 auto' }}>
          <a href="/directory" style={{ fontSize: 12, color: C.muted, textDecoration: 'none', fontFamily: f.m, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
            ← Back to Directory
          </a>

          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{
              width: 72, height: 72, borderRadius: 16, flexShrink: 0,
              background: color + '14', border: `1px solid ${color}28`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: f.m, fontSize: 11, fontWeight: 700, color,
            }}>{p.type}</div>

            <div style={{ flex: 1, minWidth: 220 }}>
              <h1 style={{ fontFamily: f.h, fontSize: 28, fontWeight: 900, color: C.white, margin: '0 0 10px', letterSpacing: -0.5 }}>
                {p.name}
              </h1>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <Badge color={color} mono>{p.type}</Badge>
                <span style={{ fontSize: 13, color: C.off }}>{TYPE_LABEL[p.type]}</span>
                {location && <span style={{ fontSize: 13, color: C.muted }}>· {location}</span>}
              </div>
            </div>

            {/* CTA — client component handles modal */}
            <ProfileClient provider={p} color={color} />
          </div>
        </div>
      </section>

      {/* Body */}
      <section style={{ padding: '32px 32px 80px' }}>
        <div style={{ maxWidth: 920, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 300px', gap: 32 }}>

          {/* Left */}
          <div>
            {p.description && (
              <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontFamily: f.h, fontSize: 15, fontWeight: 700, color: C.white, marginBottom: 10 }}>About</h2>
                <p style={{ fontSize: 13, color: C.off, lineHeight: 1.85 }}>{p.description}</p>
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
                <h2 style={{ fontFamily: f.h, fontSize: 15, fontWeight: 700, color: C.white, marginBottom: 12 }}>Certifications & Memberships</h2>
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

            <div style={{ borderTop: `1px solid ${C.border}` }}>
              <InfoRow label="Website"       value={p.website} />
              <InfoRow label="Phone"         value={p.phone} />
              <InfoRow label="Email"         value={p.email} />
              <InfoRow label="Location"      value={location} />
              <InfoRow label="Year Founded"  value={p.yearFounded} />
              <InfoRow label="Ownership"     value={p.ownership} />
              <InfoRow label="NAICS Code"    value={p.naicsCode} />
              <InfoRow label="States Served" value={p.usStatesSupported} />
              <InfoRow label="Remote / Global" value={p.remoteGlobally} />
            </div>
          </div>

          {/* Right sidebar */}
          <div>
            {/* Sidebar contact — client component handles modal */}
            <ProfileClient provider={p} color={color} sidebar />

            {p.profileUrl && (
              <a href={p.profileUrl} target="_blank" rel="noopener noreferrer"
                 style={{
                   display: 'block', marginTop: 10, padding: '12px 16px', borderRadius: 10,
                   background: C.bgCard, border: `1px solid ${C.border}`,
                   fontSize: 12, color: C.muted, textDecoration: 'none',
                   fontFamily: f.m, textAlign: 'center',
                 }}>
                View on Cyber AB Marketplace ↗
              </a>
            )}

            <div style={{ marginTop: 10, padding: 16, borderRadius: 10, background: C.bgCard, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 11, color: C.muted, fontFamily: f.m, marginBottom: 6 }}>Provider ID</div>
              <div style={{ fontSize: 13, color: C.off, fontFamily: f.m }}>{p.storeId}</div>
              <div style={{ fontSize: 11, color: C.muted, fontFamily: f.m, marginTop: 10, marginBottom: 6 }}>Tier 3 Eligible</div>
              <div style={{ fontSize: 13, color: p.hasTier3 ? C.primary : C.muted, fontFamily: f.m }}>
                {p.hasTier3 ? '✓ Yes' : 'No'}
              </div>
            </div>

            <div style={{ marginTop: 10, padding: 16, borderRadius: 10, background: C.primary + '06', border: `1px solid ${C.primary}18` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.white, fontFamily: f.h, marginBottom: 4 }}>Are you this provider?</div>
              <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.5, marginBottom: 12 }}>
                Claim this profile to receive leads, add your logo, and get featured placement.
              </p>
              <a href="/get-listed" style={{
                display: 'block', padding: '9px', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: C.primary + '14', color: C.primary, fontSize: 12, fontWeight: 700,
                fontFamily: f.h, textAlign: 'center', textDecoration: 'none',
              }}>Get Listed →</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
