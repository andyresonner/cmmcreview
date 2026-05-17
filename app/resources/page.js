'use client';

import { C, f } from '../../lib/constants';
import { Badge } from '../../lib/ui';

const RESOURCES = [
  { cat: "Official DoD Documents", items: [
    { title: "CMMC 101 Brief", type: "PDF", src: "DoD CIO", desc: "Official overview briefing covering CMMC structure, levels, and implementation timeline.", color: C.primary },
    { title: "CMMC Level 2 Assessment Guide", type: "PDF", src: "DoD CIO", desc: "The complete assessment guide for Level 2 certification — what assessors look for.", color: C.blue },
    { title: "Level 2 Scoping Guidance", type: "PDF", src: "DoD CIO", desc: "How to determine which assets are in scope for your CMMC Level 2 assessment.", color: C.blue },
    { title: "CMMC Model Overview", type: "PDF", src: "DoD CIO", desc: "The complete CMMC 2.0 model structure, levels, and alignment with NIST standards.", color: C.primary },
  ]},
  { cat: "NIST Standards", items: [
    { title: "NIST SP 800-171 Rev 2", type: "Standard", src: "NIST", desc: "Protecting CUI in Nonfederal Systems — the 110 controls that form CMMC Level 2.", color: C.purple },
    { title: "NIST SP 800-171A", type: "Standard", src: "NIST", desc: "Assessment procedures — the 320 objectives assessors use to verify your controls.", color: C.purple },
    { title: "NIST SP 800-172", type: "Standard", src: "NIST", desc: "Enhanced security requirements for CMMC Level 3 — protecting against APTs.", color: C.purpleDim },
  ]},
  { cat: "Templates & Checklists", items: [
    { title: "110-Control Implementation Checklist", type: "Template", src: "CMMCReview", desc: "Track your progress across all 110 NIST 800-171 controls with status, notes, and evidence mapping.", color: C.warn },
    { title: "System Security Plan (SSP) Outline", type: "Template", src: "CMMCReview", desc: "Structured outline for your SSP covering all required sections and documentation.", color: C.warn },
    { title: "POA&M Tracker", type: "Template", src: "CMMCReview", desc: "Plan of Action & Milestones template to document and track remediation of control gaps.", color: C.accent },
    { title: "CUI Identification Flowchart", type: "Guide", src: "CMMCReview", desc: "Decision tree to help you identify whether the data you handle qualifies as CUI.", color: C.primary },
  ]},
  { cat: "External Resources", items: [
    { title: "Cyber AB Marketplace", type: "Directory", src: "Cyber AB", desc: "Official directory of certified CMMC assessors, instructors, and RPOs.", color: C.blue },
    { title: "SPRS (Supplier Risk System)", type: "Tool", src: "DISA", desc: "Where you submit and manage your CMMC assessment scores.", color: C.blue },
    { title: "CMMC Assessment Process (CAP)", type: "PDF", src: "Cyber AB", desc: "How the assessment process works — from pre-assessment through final certification.", color: C.primary },
  ]},
];

function ResourceCard({ r }) {
  const typeLabel = r.type === "PDF" ? "PDF" : r.type === "Template" ? "TPL" : r.type === "Standard" ? "STD" : "↗";
  return (
    <div style={{
      padding: "18px 20px", borderRadius: 12, background: C.bgCard,
      border: `1px solid ${C.border}`, cursor: "pointer", transition: "all .2s",
      display: "flex", gap: 14, alignItems: "flex-start",
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = r.color + "35"; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 8, flexShrink: 0,
        background: r.color + "12", border: `1px solid ${r.color}22`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 10, fontWeight: 700, color: r.color, fontFamily: f.m,
      }}>{typeLabel}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: f.h, fontSize: 14, fontWeight: 700, color: C.white, marginBottom: 3 }}>{r.title}</div>
        <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.5, marginBottom: 6 }}>{r.desc}</p>
        <span style={{ fontSize: 10, color: r.color, fontFamily: f.m }}>Source: {r.src}</span>
      </div>
    </div>
  );
}

export default function ResourcesPage() {
  return (
    <div style={{ paddingTop: 56 }}>
      <section style={{ padding: "48px 32px 24px", background: C.bgMid }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <Badge color={C.warn} mono>Resource Library</Badge>
          <h1 style={{ fontFamily: f.h, fontSize: 42, fontWeight: 900, color: C.white, marginTop: 16, marginBottom: 8, letterSpacing: -1.5 }}>
            CMMC Resources
          </h1>
          <p style={{ fontSize: 15, color: C.off, maxWidth: 620, lineHeight: 1.7 }}>
            Every document, template, and tool you need — organized and linked to official sources.
            No gatekeeping, no sales pitch required.
          </p>
        </div>
      </section>

      <section style={{ padding: "24px 32px 64px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          {RESOURCES.map((group, gi) => (
            <div key={gi} style={{ marginBottom: 36 }}>
              <h3 style={{ fontFamily: f.h, fontSize: 18, fontWeight: 700, color: C.white, marginBottom: 14, paddingBottom: 8, borderBottom: `1px solid ${C.border}` }}>
                {group.cat}
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
                {group.items.map((r, ri) => (
                  <ResourceCard key={ri} r={r} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
