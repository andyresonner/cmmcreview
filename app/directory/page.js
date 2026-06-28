'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { C, f } from '../../lib/constants';
import { Badge } from '../../lib/ui';

const ORG_TYPES  = ['C3PAO', 'RPO', 'LTP', 'LPP'];
const PRO_TYPES  = ['RP', 'CCP', 'CCA', 'LCCA', 'RPA', 'PI'];

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

const PAGE_SIZE = 50;

function ProviderCard({ p }) {
  const color = TYPE_COLOR[p.type] || C.primary;
  const location = [p.city, p.state].filter(Boolean).join(', ');
  const services = (p.cmmcServices || []).slice(0, 3);

  return (
    <Link href={`/directory/${p.storeId}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{
        padding: '20px 22px', borderRadius: 12, background: C.bgCard,
        border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center',
        gap: 18, transition: 'all .2s', cursor: 'pointer',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = color + '40'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; }}
      >
        <div style={{
          width: 48, height: 48, borderRadius: 12, flexShrink: 0,
          background: color + '14', border: `1px solid ${color}28`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: f.m, fontSize: 9, fontWeight: 700, color,
        }}>{p.type}</div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: f.h, fontSize: 15, fontWeight: 700, color: C.white, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {p.name}
          </div>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: services.length ? 4 : 0 }}>
            {TYPE_LABEL[p.type]}{location ? ` · ${location}` : ''}
            {p.country && p.country !== 'USA' ? ` · ${p.country}` : ''}
          </div>
          {services.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {services.map((s, i) => (
                <span key={i} style={{
                  fontSize: 10, padding: '2px 7px', borderRadius: 4,
                  background: color + '10', color, fontFamily: f.m,
                }}>{s}</span>
              ))}
            </div>
          )}
        </div>

        <div style={{
          flexShrink: 0, padding: '9px 18px', borderRadius: 8,
          background: color + '14', color, fontSize: 12, fontWeight: 700,
          fontFamily: f.h, whiteSpace: 'nowrap',
        }}>
          View Profile →
        </div>
      </div>
    </Link>
  );
}

function SelectFilter({ value, onChange, options, label }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        padding: '10px 14px', borderRadius: 10, background: C.bgCard,
        border: `1px solid ${C.border}`, color: value === 'all' ? C.muted : C.white,
        fontSize: 13, fontFamily: f.b, cursor: 'pointer', outline: 'none',
      }}
    >
      <option value="all">{label}</option>
      {options.map(o => (
        <option key={o.v} value={o.v}>{o.l}</option>
      ))}
    </select>
  );
}

export default function DirectoryPage() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [section, setSection]     = useState('orgs');
  const [search, setSearch]       = useState('');
  const [typeFilter, setTypeFilter]   = useState('all');
  const [stateFilter, setStateFilter] = useState('all');
  const [page, setPage]           = useState(1);

  useEffect(() => {
    fetch('/providers.json')
      .then(r => r.json())
      .then(data => { setProviders(data); setLoading(false); });
  }, []);

  const sectionTypes = section === 'orgs' ? ORG_TYPES : PRO_TYPES;

  useEffect(() => { setPage(1); },           [section, search, typeFilter, stateFilter]);
  useEffect(() => { setTypeFilter('all'); }, [section]);

  const sectionProviders = useMemo(
    () => providers.filter(p => sectionTypes.includes(p.type)),
    [providers, sectionTypes]
  );

  const states = useMemo(() => {
    const s = new Set(sectionProviders.map(p => p.state).filter(Boolean));
    return Array.from(s).sort();
  }, [sectionProviders]);

  const filtered = useMemo(() => {
    return sectionProviders.filter(p => {
      if (typeFilter  !== 'all' && p.type  !== typeFilter)  return false;
      if (stateFilter !== 'all' && p.state !== stateFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!p.name.toLowerCase().includes(q) &&
            !(p.city  || '').toLowerCase().includes(q) &&
            !(p.state || '').toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [sectionProviders, typeFilter, stateFilter, search]);

  const visible = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < filtered.length;

  const typeOptions = sectionTypes.map(t => ({ v: t, l: `${t} — ${TYPE_LABEL[t]}` }));
  const stateOptions = states.map(s => ({ v: s, l: s }));

  const orgCount = useMemo(() => providers.filter(p => ORG_TYPES.includes(p.type)).length, [providers]);
  const proCount = useMemo(() => providers.filter(p => PRO_TYPES.includes(p.type)).length, [providers]);

  return (
    <div style={{ paddingTop: 56 }}>
      {/* Header */}
      <section style={{ padding: '48px 32px 24px', background: C.bgMid }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <Badge color={C.blue} mono>Partner Directory</Badge>
          <h1 style={{ fontFamily: f.h, fontSize: 42, fontWeight: 900, color: C.white, marginTop: 16, marginBottom: 8, letterSpacing: -1.5 }}>
            CMMC Marketplace
          </h1>
          <p style={{ fontSize: 15, color: C.off, maxWidth: 600, lineHeight: 1.7 }}>
            All {loading ? '…' : providers.length.toLocaleString()} organizations and professionals from the official Cyber AB Marketplace.
          </p>

          {/* Section tabs */}
          {!loading && (
            <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
              {[
                { v: 'orgs', l: 'Organizations', count: orgCount, color: C.primary },
                { v: 'pros', l: 'Professionals',  count: proCount, color: C.blue },
              ].map(tab => (
                <button
                  key={tab.v}
                  onClick={() => setSection(tab.v)}
                  style={{
                    padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
                    background: section === tab.v ? tab.color + '18' : C.bgCard,
                    color:      section === tab.v ? tab.color : C.muted,
                    fontFamily: f.h, fontSize: 13, fontWeight: 700,
                    borderWidth: 1, borderStyle: 'solid',
                    borderColor: section === tab.v ? tab.color + '40' : C.border,
                    transition: 'all .15s',
                  }}
                >
                  {tab.l} <span style={{ opacity: .65 }}>({tab.count.toLocaleString()})</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section style={{ padding: '24px 32px 64px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>

          {/* Filters */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{
              flex: 1, minWidth: 260, display: 'flex', alignItems: 'center', gap: 10,
              padding: '0 16px', borderRadius: 10, background: C.bgCard, border: `1px solid ${C.border}`,
            }}>
              <span style={{ fontSize: 15, color: C.muted }}>🔍</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, city, or state…"
                style={{ flex: 1, padding: '12px 0', background: 'transparent', border: 'none', outline: 'none', color: C.white, fontSize: 13, fontFamily: f.b }}
              />
              {search && (
                <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 16, padding: 0 }}>✕</button>
              )}
            </div>
            <SelectFilter value={typeFilter}  onChange={setTypeFilter}  options={typeOptions}  label="All Types"   />
            <SelectFilter value={stateFilter} onChange={setStateFilter} options={stateOptions} label="All States"  />
          </div>

          {/* Count */}
          {!loading && (
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 14, fontFamily: f.m }}>
              {filtered.length.toLocaleString()} result{filtered.length !== 1 ? 's' : ''}
              {(search || typeFilter !== 'all' || stateFilter !== 'all')
                ? ` (filtered from ${sectionProviders.length.toLocaleString()})` : ''}
            </div>
          )}

          {/* Cards */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: C.muted, fontSize: 14 }}>
              Loading {providers.length > 0 ? providers.length.toLocaleString() : ''} providers…
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {visible.map(p => <ProviderCard key={p.storeId} p={p} />)}
              {visible.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 0', color: C.muted, fontSize: 14 }}>
                  No results match your filters.
                </div>
              )}
            </div>
          )}

          {/* Load more */}
          {hasMore && !loading && (
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <button
                onClick={() => setPage(p => p + 1)}
                style={{
                  padding: '12px 32px', borderRadius: 10, border: `1px solid ${C.border}`,
                  background: C.bgCard, color: C.off, fontSize: 13, fontWeight: 700,
                  fontFamily: f.h, cursor: 'pointer',
                }}
              >
                Load more ({filtered.length - visible.length} remaining)
              </button>
            </div>
          )}

          {/* Partner signup CTA */}
          {!loading && (
            <div style={{
              marginTop: 40, padding: 28, borderRadius: 14, textAlign: 'center',
              background: C.bgCard, border: `1px dashed ${C.blue}30`,
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.white, fontFamily: f.h, marginBottom: 6 }}>
                Are you an MSP, C3PAO, or RPO?
              </div>
              <p style={{ fontSize: 13, color: C.muted, marginBottom: 14 }}>
                Get listed in front of defense contractors actively seeking CMMC compliance help.
              </p>
              <button style={{
                padding: '10px 24px', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: C.blue, color: C.white, fontSize: 13, fontWeight: 700, fontFamily: f.h,
              }}>Apply for a Listing →</button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
