'use client';

import { useState } from 'react';
import { C, f, LEVELS, CONTROL_FAMILIES } from '../../lib/constants';
import { Badge, Pill } from '../../lib/ui';

export default function LearnPage() {
  const [activeLevel, setActiveLevel] = useState(1);
  const [expandedFamily, setExpandedFamily] = useState(null);
  const lv = LEVELS[activeLevel - 1];

  return (
    <div style={{ paddingTop: 56 }}>
      {/* Header */}
      <section style={{ padding: "48px 32px 32px", background: C.bgMid }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <Badge color={C.primary} mono>CMMC Academy</Badge>
          <h1 style={{ fontFamily: f.h, fontSize: 42, fontWeight: 900, color: C.white, marginTop: 16, marginBottom: 8, letterSpacing: -1.5 }}>
            Learn CMMC
          </h1>
          <p style={{ fontSize: 15, color: C.off, maxWidth: 600, lineHeight: 1.7 }}>
            Understand each certification level, what it requires, who it applies to, and how to get there.
            Click into any control family for the detailed breakdown.
          </p>
        </div>
      </section>

      {/* Level selector */}
      <section style={{ padding: "24px 32px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
            {LEVELS.map(l => (
              <Pill key={l.level} active={activeLevel === l.level} color={l.color}
                onClick={() => { setActiveLevel(l.level); setExpandedFamily(null); }}>
                Level {l.level} — {l.name}
              </Pill>
            ))}
          </div>

          {/* Level detail */}
          <div style={{
            padding: 28, borderRadius: 16, background: C.bgCard,
            border: `1px solid ${lv.color}18`, marginBottom: 28,
          }}>
            <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
              <div style={{
                width: 64, height: 64, borderRadius: 16, background: lv.color + "12",
                border: `1px solid ${lv.color}30`, display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: f.h, fontSize: 28, fontWeight: 900, color: lv.color, flexShrink: 0,
              }}>L{lv.level}</div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontFamily: f.h, fontSize: 26, fontWeight: 800, color: C.white, marginBottom: 6 }}>
                  Level {lv.level}: {lv.name}
                </h2>
                <p style={{ fontSize: 14, color: C.off, lineHeight: 1.7, marginBottom: 16 }}>{lv.desc}</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                  {[
                    { label: "Controls", value: lv.controls, c: lv.color },
                    { label: "Standard", value: lv.standard.replace("NIST SP ", ""), c: C.off },
                    { label: "Assessment", value: lv.assessment, c: C.off },
                    { label: "Protects", value: lv.info, c: lv.color },
                  ].map((d, i) => (
                    <div key={i} style={{ padding: "10px 14px", borderRadius: 8, background: C.bg + "88" }}>
                      <div style={{ fontSize: 10, color: C.muted, fontFamily: f.m, marginBottom: 4 }}>{d.label}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: d.c, fontFamily: f.h }}>{d.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{
              marginTop: 18, padding: "12px 16px", borderRadius: 8,
              background: lv.color + "08", border: `1px solid ${lv.color}15`,
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: lv.color, fontFamily: f.m, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Who needs this level?</div>
              <p style={{ fontSize: 13, color: C.off, lineHeight: 1.6 }}>{lv.who}</p>
            </div>
          </div>

          {/* Control families */}
          <h3 style={{ fontFamily: f.h, fontSize: 20, fontWeight: 700, color: C.white, marginBottom: 16 }}>
            {activeLevel === 1 ? "6 Control Domains" : "14 Control Families"} in Level {activeLevel}
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
            {CONTROL_FAMILIES.filter(cf => activeLevel === 1 ? ["AC", "IA", "MP", "PE", "SC", "SI"].includes(cf.id) : true).map((cf) => (
              <div key={cf.id}
                onClick={() => setExpandedFamily(expandedFamily === cf.id ? null : cf.id)}
                style={{
                  padding: "16px 18px", borderRadius: 12, cursor: "pointer",
                  background: expandedFamily === cf.id ? cf.color + "0a" : C.bgCard,
                  border: `1px solid ${expandedFamily === cf.id ? cf.color + "30" : C.border}`,
                  transition: "all .2s",
                }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 18 }}>{cf.icon}</span>
                    <div>
                      <div style={{ fontFamily: f.h, fontSize: 14, fontWeight: 700, color: C.white }}>{cf.name}</div>
                      <div style={{ fontSize: 11, color: C.muted, fontFamily: f.m }}>{cf.id} · {cf.controls} controls</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 14, color: C.muted, transition: "transform .2s", transform: expandedFamily === cf.id ? "rotate(180deg)" : "rotate(0)" }}>▾</span>
                </div>
                {expandedFamily === cf.id && (
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
                    <p style={{ fontSize: 13, color: C.off, lineHeight: 1.6, marginBottom: 10 }}>{cf.desc}</p>
                    <div style={{
                      padding: "10px 14px", borderRadius: 8, background: C.bg + "88",
                      fontSize: 12, color: C.muted, lineHeight: 1.5,
                    }}>
                      In the full version, this expands to show each individual control requirement with plain-English
                      explanations, implementation guidance, and evidence examples needed for your assessment.
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
