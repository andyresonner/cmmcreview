'use client';

import { useState } from 'react';
import { C, f, PARTNER_DATA } from '../../lib/constants';
import { Badge, Pill } from '../../lib/ui';

export default function DirectoryPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = PARTNER_DATA.filter(p => {
    const matchSearch = !search
      || p.name.toLowerCase().includes(search.toLowerCase())
      || p.location.toLowerCase().includes(search.toLowerCase())
      || p.specialty.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || p.type.toLowerCase().includes(typeFilter);
    return matchSearch && matchType;
  });

  return (
    <div style={{ paddingTop: 56 }}>
      <section style={{ padding: "48px 32px 24px", background: C.bgMid }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <Badge color={C.blue} mono>Partner Directory</Badge>
          <h1 style={{ fontFamily: f.h, fontSize: 42, fontWeight: 900, color: C.white, marginTop: 16, marginBottom: 8, letterSpacing: -1.5 }}>
            Find a CMMC Partner
          </h1>
          <p style={{ fontSize: 15, color: C.off, maxWidth: 600, lineHeight: 1.7 }}>
            Verified MSPs, C3PAOs, RPOs, and compliance consultants. Filtered by what matters.
          </p>
        </div>
      </section>

      <section style={{ padding: "24px 32px 64px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          {/* Search + filters */}
          <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
            <div style={{
              flex: 1, minWidth: 280, display: "flex", alignItems: "center", gap: 10,
              padding: "0 16px", borderRadius: 10, background: C.bgCard, border: `1px solid ${C.border}`,
            }}>
              <span style={{ fontSize: 16, color: C.muted }}>🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, location, or specialty..."
                style={{ flex: 1, padding: "12px 0", background: "transparent", border: "none", outline: "none", color: C.white, fontSize: 13, fontFamily: f.b }} />
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {[{ v: "all", l: "All" }, { v: "msp", l: "MSP/MSSP" }, { v: "c3pao", l: "C3PAO" }, { v: "consultant", l: "Consultants" }].map(t => (
                <Pill key={t.v} active={typeFilter === t.v} color={C.blue} onClick={() => setTypeFilter(t.v)}>{t.l}</Pill>
              ))}
            </div>
          </div>

          {/* Listings */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filtered.map((p, i) => (
              <div key={i} style={{
                padding: "20px 22px", borderRadius: 12,
                background: p.featured ? C.primary + "06" : C.bgCard,
                border: `1px solid ${p.featured ? C.primary + "20" : C.border}`,
                display: "flex", alignItems: "center", gap: 18,
                transition: "all .2s", cursor: "pointer",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = (p.featured ? C.primary : C.blue) + "40"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = p.featured ? C.primary + "20" : C.border; }}
              >
                {/* Badge icon */}
                <div style={{
                  width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                  background: p.badge === "C3PAO" ? C.purple + "14" : C.primary + "10",
                  border: `1px solid ${p.badge === "C3PAO" ? C.purple + "28" : C.primary + "20"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: f.m, fontSize: 10, fontWeight: 700, color: p.badge === "C3PAO" ? C.purple : C.primary,
                }}>{p.badge}</div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <span style={{ fontFamily: f.h, fontSize: 16, fontWeight: 700, color: C.white }}>{p.name}</span>
                    {p.featured && <Badge color={C.primary}>Featured Partner</Badge>}
                  </div>
                  <div style={{ fontSize: 12, color: C.muted }}>
                    {p.type} · {p.location} · {p.levels} · {p.specialty}
                  </div>
                </div>

                {/* Rating */}
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.warn, fontFamily: f.h }}>★ {p.rating}</div>
                  <div style={{ fontSize: 10, color: C.muted }}>{p.reviews} reviews</div>
                </div>

                {/* CTA */}
                <button style={{
                  padding: "10px 20px", borderRadius: 8, border: "none", cursor: "pointer",
                  background: C.primary + "14", color: C.primary, fontSize: 12, fontWeight: 700,
                  fontFamily: f.h, whiteSpace: "nowrap",
                }}>Request Info</button>
              </div>
            ))}
          </div>

          {/* MSP signup CTA */}
          <div style={{
            marginTop: 32, padding: 28, borderRadius: 14, textAlign: "center",
            background: C.bgCard, border: `1px dashed ${C.blue}30`,
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.white, fontFamily: f.h, marginBottom: 6 }}>
              Are you an MSP, C3PAO, or RPO?
            </div>
            <p style={{ fontSize: 13, color: C.muted, marginBottom: 14 }}>
              Get listed in front of defense contractors actively seeking CMMC compliance help.
            </p>
            <button style={{
              padding: "10px 24px", borderRadius: 8, border: "none", cursor: "pointer",
              background: C.blue, color: C.white, fontSize: 13, fontWeight: 700, fontFamily: f.h,
            }}>Apply for a Listing →</button>
          </div>
        </div>
      </section>
    </div>
  );
}
