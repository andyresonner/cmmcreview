'use client';

import { useState, useEffect, useRef, useMemo } from "react";

// ============================================================
// CMMC REVIEW — THE PRODUCT
// cmmcreview.org — The independent CMMC compliance hub
// ============================================================

const C = {
  bg: "#060B14", bgMid: "#0B1220", bgCard: "#0F172A",
  bgCardHover: "#131D33", surface: "#1A2540", surfaceLight: "#1E2D4A",
  primary: "#00E5B0", primaryDim: "#00A37D", primaryMuted: "#007A5E",
  primaryGlow: "rgba(0, 229, 176, 0.12)",
  accent: "#FF7043", accentDim: "#E65100",
  warn: "#FFAB00", warnDim: "#FF8F00",
  blue: "#42A5F5", blueDim: "#1565C0",
  purple: "#AB47BC", purpleDim: "#7B1FA2",
  red: "#EF5350", redDim: "#C62828",
  white: "#EDF2F7", off: "#A0AEC0", muted: "#4A5568", dim: "#2D3748",
  border: "rgba(74, 85, 104, 0.18)",
};

const f = {
  h: "'Outfit', system-ui, sans-serif",
  b: "'Plus Jakarta Sans', system-ui, sans-serif",
  m: "'IBM Plex Mono', monospace",
};

const GlobalStyle = () => (
  <style>{`
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:${C.bg};color:${C.white};font-family:${f.b};overflow-x:hidden;-webkit-font-smoothing:antialiased}
    ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:${C.bg}}::-webkit-scrollbar-thumb{background:${C.primaryMuted};border-radius:2px}
    @keyframes fu{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fi{from{opacity:0}to{opacity:1}}
    @keyframes si{from{opacity:0;transform:translateX(-16px)}to{opacity:1;transform:translateX(0)}}
    @keyframes bg{from{width:0}}
    @keyframes gp{0%,100%{box-shadow:0 0 20px ${C.primaryGlow}}50%{box-shadow:0 0 40px rgba(0,229,176,0.22)}}
    @keyframes sp{0%,100%{filter:drop-shadow(0 0 6px ${C.primaryGlow})}50%{filter:drop-shadow(0 0 16px rgba(0,229,176,0.35))}}
    @keyframes sc{0%{transform:translateY(-100%)}100%{transform:translateY(100%)}}
    @keyframes tp{0%{background-position:200% 0}100%{background-position:-200% 0}}
    input::placeholder{color:${C.muted}}
    button{font-family:${f.b}}
  `}</style>
);

// ── Shared Components ──

const Shield = ({ s = 24, c = C.primary }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ animation: "sp 4s ease-in-out infinite", flexShrink: 0 }}>
    <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill={c} opacity=".12" stroke={c} strokeWidth="1.5"/>
    <path d="M9 12l2 2 4-4" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Badge = ({ children, color = C.primary, mono }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "4px 10px", borderRadius: 6,
    background: color + "14", border: `1px solid ${color}25`,
    fontSize: 10, fontWeight: 700, color, letterSpacing: 1.2, textTransform: "uppercase",
    fontFamily: mono ? f.m : f.b,
  }}>{children}</span>
);

const Pill = ({ active, color, children, onClick }) => (
  <button onClick={onClick} style={{
    padding: "8px 18px", borderRadius: 10, cursor: "pointer", border: "none",
    background: active ? color + "18" : C.bgCard,
    outline: active ? `1px solid ${color}40` : `1px solid transparent`,
    color: active ? color : C.off, fontSize: 13, fontWeight: 600,
    transition: "all .25s", fontFamily: f.b,
  }}>{children}</button>
);

// ── CMMC Data ──

const LEVELS = [
  { level: 1, name: "Foundational", controls: 17, standard: "FAR 52.204-21", assessment: "Annual Self-Assessment", info: "FCI", color: C.primary,
    desc: "Basic safeguarding of Federal Contract Information. 17 practices focused on fundamental cyber hygiene like access control, identification, media protection, physical protection, system integrity, and communications protection.",
    who: "Any contractor handling Federal Contract Information (FCI) — even basic logistics, admin, or procurement data from DoD." },
  { level: 2, name: "Advanced", controls: 110, standard: "NIST SP 800-171 Rev 2", assessment: "Self or C3PAO Assessment", info: "CUI", color: C.blue,
    desc: "Comprehensive protection of Controlled Unclassified Information across 14 control families and 320 assessment objectives. This is where most defense contractors need to be.",
    who: "Contractors handling CUI — technical drawings, specifications, engineering data, test results, or any sensitive unclassified DoD information." },
  { level: 3, name: "Expert", controls: 134, standard: "NIST SP 800-172", assessment: "DIBCAC Assessment", info: "CUI+", color: C.purple,
    desc: "Enhanced protections against Advanced Persistent Threats (APTs). Adds 24 controls on top of Level 2 for the most sensitive programs. Government-led assessment by DIBCAC.",
    who: "Contractors on highest-priority programs handling the most sensitive CUI, typically primes and critical subcontractors on major weapons systems." },
];

const TIMELINE = [
  { date: "Nov 10, 2025", phase: "Phase 1", title: "Self-Assessments Begin", desc: "Level 1 and Level 2 self-assessments required in select contracts. DoD may also require C3PAO certifications at its discretion.", status: "active", color: C.primary },
  { date: "Nov 10, 2026", phase: "Phase 2", title: "C3PAO Audits Mandatory", desc: "Third-party C3PAO certifications become mandatory for Level 2 contracts. Level 3 DIBCAC assessments may begin.", status: "upcoming", color: C.accent },
  { date: "Nov 10, 2027", phase: "Phase 3", title: "Level 3 Enforcement", desc: "Level 3 DIBCAC assessments required for applicable contracts. Full enforcement across all three levels.", status: "future", color: C.blue },
  { date: "Nov 10, 2028", phase: "Phase 4", title: "Full Implementation", desc: "CMMC requirements included in all applicable DoD contracts. Complete rollout across the Defense Industrial Base.", status: "future", color: C.purple },
];

const CONTROL_FAMILIES = [
  { id: "AC", name: "Access Control", controls: 22, icon: "🔐", desc: "Limit system access to authorized users and transactions", color: C.primary },
  { id: "AT", name: "Awareness & Training", controls: 3, icon: "🎓", desc: "Ensure personnel are aware of security risks and trained on policies", color: C.blue },
  { id: "AU", name: "Audit & Accountability", controls: 9, icon: "📋", desc: "Create, protect, and retain system audit records", color: C.purple },
  { id: "CM", name: "Configuration Mgmt", controls: 9, icon: "⚙️", desc: "Establish and maintain baseline configurations", color: C.warn },
  { id: "IA", name: "Identification & Auth", controls: 11, icon: "🪪", desc: "Identify and authenticate users, devices, and processes", color: C.accent },
  { id: "IR", name: "Incident Response", controls: 3, icon: "🚨", desc: "Establish incident-handling capability", color: C.red },
  { id: "MA", name: "Maintenance", controls: 6, icon: "🔧", desc: "Perform timely maintenance on organizational systems", color: C.blueDim },
  { id: "MP", name: "Media Protection", controls: 9, icon: "💾", desc: "Protect, sanitize, and destroy media containing CUI", color: C.purpleDim },
  { id: "PE", name: "Physical Protection", controls: 6, icon: "🏢", desc: "Limit physical access to systems and equipment", color: C.primaryDim },
  { id: "PS", name: "Personnel Security", controls: 2, icon: "👤", desc: "Screen individuals prior to authorizing access", color: C.warnDim },
  { id: "RA", name: "Risk Assessment", controls: 3, icon: "📊", desc: "Periodically assess risk to operations and assets", color: C.accentDim },
  { id: "CA", name: "Security Assessment", controls: 4, icon: "✅", desc: "Periodically assess security controls for effectiveness", color: C.primary },
  { id: "SC", name: "System & Comm Protection", controls: 16, icon: "🛡️", desc: "Monitor, control, and protect communications", color: C.blue },
  { id: "SI", name: "System & Info Integrity", controls: 7, icon: "🔍", desc: "Identify, report, and correct system flaws in a timely manner", color: C.accent },
];

const QUIZ_QUESTIONS = [
  { q: "Does your organization handle Controlled Unclassified Information (CUI) for DoD contracts?", family: "Scoping",
    opts: [{ t: "Yes, regularly on active contracts", w: 3 }, { t: "Occasionally, on some contracts", w: 2 }, { t: "Not sure — we handle DoD data but haven't classified it", w: 1 }, { t: "No, only basic Federal Contract Information", w: 0 }] },
  { q: "Do all users accessing CUI systems authenticate with multi-factor authentication (MFA)?", family: "IA — Identification & Auth",
    opts: [{ t: "Yes, MFA enforced everywhere CUI is accessed", w: 3 }, { t: "MFA on most systems, some gaps remain", w: 2 }, { t: "MFA deployed but not consistently enforced", w: 1 }, { t: "No MFA currently implemented", w: 0 }] },
  { q: "Do you maintain a current, documented System Security Plan (SSP)?", family: "CA — Security Assessment",
    opts: [{ t: "Yes, reviewed and updated within the last year", w: 3 }, { t: "We have one but it's outdated", w: 2 }, { t: "We've started drafting one", w: 1 }, { t: "No SSP exists", w: 0 }] },
  { q: "Is CUI encrypted both at rest and in transit across all systems?", family: "SC — System & Comm Protection",
    opts: [{ t: "Yes, FIPS 140-2 validated encryption everywhere", w: 3 }, { t: "Encrypted in transit, partial at rest", w: 2 }, { t: "Some encryption, not comprehensive", w: 1 }, { t: "Encryption not systematically implemented", w: 0 }] },
  { q: "Do you conduct security awareness training for all personnel with system access?", family: "AT — Awareness & Training",
    opts: [{ t: "Quarterly training with documented completion", w: 3 }, { t: "Annual training program in place", w: 2 }, { t: "Ad-hoc or informal training", w: 1 }, { t: "No formal training program", w: 0 }] },
  { q: "Do you have a tested incident response plan specific to CUI incidents?", family: "IR — Incident Response",
    opts: [{ t: "Documented plan, tested annually with tabletops", w: 3 }, { t: "Documented plan, but never tested", w: 2 }, { t: "Informal response process exists", w: 1 }, { t: "No incident response plan", w: 0 }] },
  { q: "Are audit logs enabled, protected, and reviewed on systems processing CUI?", family: "AU — Audit & Accountability",
    opts: [{ t: "Centralized SIEM with regular review and alerting", w: 3 }, { t: "Logging enabled, reviewed periodically", w: 2 }, { t: "Some logging, rarely reviewed", w: 1 }, { t: "Audit logging not systematically implemented", w: 0 }] },
  { q: "Do you maintain a hardware/software inventory and enforce baseline configurations?", family: "CM — Configuration Mgmt",
    opts: [{ t: "Complete inventory with enforced baselines and change control", w: 3 }, { t: "Inventory exists, baselines partially enforced", w: 2 }, { t: "Informal tracking, no baselines", w: 1 }, { t: "No asset inventory or configuration management", w: 0 }] },
];

const PARTNER_DATA = [
  { name: "CyberShield MSP", type: "MSP/MSSP", badge: "RPO", location: "Northern Virginia", rating: 4.9, reviews: 47, levels: "L1 & L2", specialty: "Manufacturing", featured: true },
  { name: "FedSecure Partners", type: "C3PAO", badge: "C3PAO", location: "Maryland", rating: 4.8, reviews: 32, levels: "L2 & L3", specialty: "Aerospace & Defense" },
  { name: "ComplianceForge", type: "Consultant", badge: "RPO", location: "Texas", rating: 4.7, reviews: 28, levels: "L1 & L2", specialty: "Small Business" },
  { name: "DefenseIT Solutions", type: "MSP", badge: "RPO", location: "Colorado", rating: 4.6, reviews: 19, levels: "L2", specialty: "Engineering & IT" },
  { name: "Sentinel Cyber Group", type: "MSSP", badge: "RPO", location: "California", rating: 4.8, reviews: 41, levels: "L1, L2, L3", specialty: "Cleared Contractors" },
  { name: "Patriot Compliance", type: "C3PAO", badge: "C3PAO", location: "Florida", rating: 4.5, reviews: 15, levels: "L2", specialty: "Subcontractors" },
];

// ── Navigation ──

const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "learn", label: "Learn CMMC" },
  { id: "assess", label: "Readiness Check" },
  { id: "directory", label: "Find a Partner" },
  { id: "resources", label: "Resources" },
];

const Nav = ({ active, setActive }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      background: scrolled ? `${C.bg}f0` : `${C.bg}cc`,
      backdropFilter: "blur(16px)", borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
      padding: "0 32px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between",
      transition: "all .3s",
    }}>
      <button onClick={() => setActive("home")} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer" }}>
        <Shield s={22} />
        <span style={{ fontFamily: f.h, fontSize: 18, fontWeight: 800, color: C.white, letterSpacing: -0.3 }}>
          cmmc<span style={{ color: C.primary }}>review</span><span style={{ color: C.muted, fontWeight: 400, fontSize: 14 }}>.org</span>
        </span>
      </button>
      <div style={{ display: "flex", gap: 2 }}>
        {NAV_ITEMS.map(n => (
          <button key={n.id} onClick={() => setActive(n.id)} style={{
            padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer",
            background: active === n.id ? C.primary + "14" : "transparent",
            color: active === n.id ? C.primary : C.off,
            fontSize: 12.5, fontWeight: 600, transition: "all .2s", fontFamily: f.b,
          }}>{n.label}</button>
        ))}
      </div>
      <button style={{
        padding: "8px 18px", borderRadius: 8, border: "none", cursor: "pointer",
        background: C.primary, color: C.bg, fontSize: 12, fontWeight: 700,
        fontFamily: f.h, letterSpacing: 0.2,
      }}>Free Assessment →</button>
    </nav>
  );
};

// ── HOME PAGE ──

const HomePage = ({ setActive }) => (
  <div>
    {/* Hero */}
    <section style={{
      minHeight: "92vh", padding: "80px 32px 48px", position: "relative", overflow: "hidden",
      display: "flex", alignItems: "center",
    }}>
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `linear-gradient(${C.dim}0a 1px, transparent 1px), linear-gradient(90deg, ${C.dim}0a 1px, transparent 1px)`,
        backgroundSize: "48px 48px",
      }} />
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse at 25% 30%, ${C.primaryMuted}15 0%, transparent 55%), radial-gradient(ellipse at 75% 70%, ${C.blueDim}0a 0%, transparent 50%)`,
      }} />

      <div style={{ maxWidth: 1080, margin: "0 auto", width: "100%", position: "relative" }}>
        <div style={{ maxWidth: 680 }}>
          <Badge color={C.primary} mono>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.primary, display: "inline-block", boxShadow: `0 0 6px ${C.primary}` }} />
            Phase 1 Active — Phase 2 Mandatory Nov 2026
          </Badge>

          <h1 style={{
            fontFamily: f.h, fontSize: 60, fontWeight: 900, lineHeight: 1.08,
            color: C.white, marginTop: 24, marginBottom: 20, letterSpacing: -2.5,
            animation: "fu .7s ease-out .1s both",
          }}>
            CMMC compliance,<br/>
            <span style={{ color: C.primary }}>finally clear.</span>
          </h1>

          <p style={{
            fontSize: 17, lineHeight: 1.7, color: C.off, maxWidth: 540, marginBottom: 36,
            animation: "fu .7s ease-out .2s both",
          }}>
            The free, independent resource for defense contractors navigating
            CMMC certification. Learn the requirements, assess your readiness,
            and find verified compliance partners — all in one place.
          </p>

          <div style={{ display: "flex", gap: 10, animation: "fu .7s ease-out .3s both", flexWrap: "wrap" }}>
            <button onClick={() => setActive("assess")} style={{
              padding: "14px 28px", borderRadius: 10, border: "none", cursor: "pointer",
              background: C.primary, color: C.bg, fontSize: 14, fontWeight: 700,
              fontFamily: f.h, letterSpacing: 0.2,
              boxShadow: `0 0 24px ${C.primaryGlow}, 0 4px 12px rgba(0,0,0,.3)`,
            }}>Take the Free Readiness Check</button>
            <button onClick={() => setActive("learn")} style={{
              padding: "14px 28px", borderRadius: 10, cursor: "pointer",
              background: "transparent", border: `1px solid ${C.dim}`,
              color: C.off, fontSize: 14, fontWeight: 600, fontFamily: f.h,
            }}>Learn CMMC Basics →</button>
          </div>
        </div>

        {/* Right side stat cards */}
        <div style={{
          position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)",
          display: "flex", flexDirection: "column", gap: 10, width: 300,
          animation: "fu .7s ease-out .5s both",
        }}>
          {[
            { val: "220,000+", lab: "Defense contractors affected", c: C.primary },
            { val: "~1%", lab: "Fully audit-ready today", c: C.red },
            { val: "Nov 2026", lab: "Mandatory C3PAO assessments begin", c: C.accent },
            { val: "6–12 mo", lab: "Typical time to reach compliance", c: C.blue },
          ].map((s, i) => (
            <div key={i} style={{
              padding: "14px 18px", borderRadius: 10, background: C.bgCard,
              border: `1px solid ${s.c}12`, display: "flex", alignItems: "center", gap: 14,
            }}>
              <div style={{ fontFamily: f.h, fontSize: 22, fontWeight: 800, color: s.c, minWidth: 90 }}>{s.val}</div>
              <div style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.4 }}>{s.lab}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* What is CMMC quick explainer */}
    <section style={{ padding: "64px 32px", background: C.bgMid }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <h2 style={{ fontFamily: f.h, fontSize: 36, fontWeight: 800, color: C.white, marginBottom: 8, letterSpacing: -1 }}>
          What is CMMC?
        </h2>
        <p style={{ fontSize: 15, color: C.off, maxWidth: 700, lineHeight: 1.7, marginBottom: 36 }}>
          The Cybersecurity Maturity Model Certification is a DoD program that requires defense contractors
          to prove their cybersecurity practices meet specific standards before they can win or keep contracts.
          It's now law — and enforcement has begun.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {LEVELS.map((lv, i) => (
            <div key={i} style={{
              padding: 24, borderRadius: 14, background: C.bgCard,
              border: `1px solid ${lv.color}15`, cursor: "default",
              transition: "all .25s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = lv.color + "40"; e.currentTarget.style.transform = "translateY(-3px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = lv.color + "15"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: lv.color + "15", border: `1px solid ${lv.color}30`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: f.h, fontSize: 16, fontWeight: 900, color: lv.color,
                }}>L{lv.level}</div>
                <div>
                  <div style={{ fontFamily: f.h, fontSize: 16, fontWeight: 700, color: C.white }}>{lv.name}</div>
                  <div style={{ fontSize: 10.5, color: C.muted, fontFamily: f.m }}>{lv.controls} controls · {lv.info}</div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: C.off, lineHeight: 1.65, marginBottom: 14 }}>{lv.desc}</p>
              <div style={{ fontSize: 11, color: lv.color, fontFamily: f.m }}>{lv.standard}</div>
            </div>
          ))}
        </div>

        <button onClick={() => setActive("learn")} style={{
          marginTop: 24, padding: "10px 20px", borderRadius: 8, border: `1px solid ${C.dim}`,
          background: "transparent", color: C.off, fontSize: 12, fontWeight: 600, cursor: "pointer",
          fontFamily: f.h,
        }}>Explore all CMMC levels in depth →</button>
      </div>
    </section>

    {/* Timeline */}
    <section style={{ padding: "64px 32px" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <h2 style={{ fontFamily: f.h, fontSize: 36, fontWeight: 800, color: C.white, marginBottom: 8, letterSpacing: -1 }}>
          Implementation Timeline
        </h2>
        <p style={{ fontSize: 15, color: C.off, maxWidth: 600, lineHeight: 1.7, marginBottom: 36 }}>
          CMMC enforcement is phased in over three years. Here's what's happening and when.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 0, position: "relative" }}>
          {/* Vertical line */}
          <div style={{ position: "absolute", left: 19, top: 8, bottom: 8, width: 2, background: C.dim }} />

          {TIMELINE.map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 20, padding: "16px 0", position: "relative" }}>
              <div style={{
                width: 40, flexShrink: 0, display: "flex", justifyContent: "center", paddingTop: 2, zIndex: 1,
              }}>
                <div style={{
                  width: t.status === "active" ? 16 : 12, height: t.status === "active" ? 16 : 12,
                  borderRadius: "50%", background: t.color,
                  boxShadow: t.status === "active" ? `0 0 12px ${t.color}88` : "none",
                  border: t.status === "active" ? `2px solid ${t.color}` : "none",
                }} />
              </div>
              <div style={{
                flex: 1, padding: "18px 22px", borderRadius: 12,
                background: t.status === "active" ? t.color + "0a" : C.bgCard,
                border: `1px solid ${t.status === "active" ? t.color + "30" : C.border}`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{ fontFamily: f.m, fontSize: 11, fontWeight: 600, color: t.color }}>{t.date}</span>
                  <Badge color={t.color}>{t.phase}</Badge>
                  {t.status === "active" && <Badge color={C.primary}>← We are here</Badge>}
                </div>
                <div style={{ fontFamily: f.h, fontSize: 18, fontWeight: 700, color: C.white, marginBottom: 4 }}>{t.title}</div>
                <p style={{ fontSize: 13, color: C.off, lineHeight: 1.6 }}>{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA strip */}
    <section style={{
      padding: "48px 32px", background: `linear-gradient(135deg, ${C.primaryMuted}15, ${C.bgMid})`,
      borderTop: `1px solid ${C.primary}12`, borderBottom: `1px solid ${C.primary}12`,
    }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h3 style={{ fontFamily: f.h, fontSize: 24, fontWeight: 800, color: C.white, marginBottom: 6 }}>
            Not sure where you stand?
          </h3>
          <p style={{ fontSize: 14, color: C.off }}>
            Take the free readiness check — 8 questions, 3 minutes, instant gap analysis.
          </p>
        </div>
        <button onClick={() => setActive("assess")} style={{
          padding: "14px 28px", borderRadius: 10, border: "none", cursor: "pointer",
          background: C.primary, color: C.bg, fontSize: 14, fontWeight: 700, fontFamily: f.h,
          boxShadow: `0 0 20px ${C.primaryGlow}`,
        }}>Start Readiness Check →</button>
      </div>
    </section>

    {/* Quick links to other sections */}
    <section style={{ padding: "64px 32px" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {[
            { icon: "📚", title: "CMMC Academy", desc: "Free courses on every CMMC level and control family. Plain-English explainers with real examples.", btn: "Start Learning", to: "learn", color: C.primary },
            { icon: "🤝", title: "Find a Partner", desc: "Searchable directory of verified MSPs, C3PAOs, and consultants. Filter by state, specialty, and level.", btn: "Browse Directory", to: "directory", color: C.blue },
            { icon: "📋", title: "Resource Library", desc: "Free templates, checklists, and guides — SSPs, POA&Ms, scoping tools, and more.", btn: "Get Resources", to: "resources", color: C.warn },
          ].map((c, i) => (
            <div key={i} onClick={() => setActive(c.to)} style={{
              padding: 28, borderRadius: 14, background: C.bgCard,
              border: `1px solid ${c.color}12`, cursor: "pointer",
              transition: "all .25s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = c.color + "35"; e.currentTarget.style.transform = "translateY(-3px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = c.color + "12"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ fontSize: 28, marginBottom: 14 }}>{c.icon}</div>
              <h3 style={{ fontFamily: f.h, fontSize: 20, fontWeight: 700, color: C.white, marginBottom: 8 }}>{c.title}</h3>
              <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, marginBottom: 18 }}>{c.desc}</p>
              <span style={{ fontSize: 13, fontWeight: 700, color: c.color, fontFamily: f.h }}>{c.btn} →</span>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer style={{ padding: "36px 32px", borderTop: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Shield s={18} />
          <span style={{ fontFamily: f.h, fontSize: 14, fontWeight: 700, color: C.muted }}>
            cmmcreview.org
          </span>
        </div>
        <p style={{ fontSize: 11, color: C.muted }}>
          Independent CMMC education resource. Not affiliated with the DoD or Cyber AB. Not legal or compliance advice.
        </p>
      </div>
    </footer>
  </div>
);


// ── LEARN PAGE ──

const LearnPage = () => {
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
            {CONTROL_FAMILIES.filter(cf => activeLevel === 1 ? ["AC", "IA", "MP", "PE", "SC", "SI"].includes(cf.id) : true).map((cf, i) => (
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
};


// ── READINESS CHECK PAGE ──

const AssessPage = ({ setActive }) => {
  const [step, setStep] = useState(0); // 0=intro, 1-8=questions, 9=results
  const [answers, setAnswers] = useState({});

  const handleAnswer = (qi, oi) => {
    setAnswers(prev => ({ ...prev, [qi]: oi }));
    setTimeout(() => setStep(Math.min(step + 1, QUIZ_QUESTIONS.length + 1)), 250);
  };

  const score = useMemo(() => {
    let total = 0;
    Object.entries(answers).forEach(([qi, oi]) => {
      total += QUIZ_QUESTIONS[parseInt(qi)].opts[oi].w;
    });
    return Math.round((total / (QUIZ_QUESTIONS.length * 3)) * 110);
  }, [answers]);

  const grade = score >= 88 ? { g: "Strong", c: C.primary, m: "Your fundamentals look solid. Focus on documentation gaps and prepare for your C3PAO assessment." }
    : score >= 55 ? { g: "Moderate Gaps", c: C.warn, m: "You have a foundation but significant gaps remain. Plan for 6–9 months of focused remediation with an experienced MSP." }
    : score >= 28 ? { g: "At Risk", c: C.accent, m: "Major compliance gaps across multiple control families. You need professional help — connect with an RPO or MSP immediately." }
    : { g: "Critical", c: C.red, m: "Fundamental gaps exist. Without a comprehensive remediation program, you will not pass a C3PAO assessment. Start now." };

  const reset = () => { setStep(0); setAnswers({}); };

  return (
    <div style={{ paddingTop: 56 }}>
      <section style={{ padding: "48px 32px 32px", background: C.bgMid }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <Badge color={C.accent} mono>Free Tool</Badge>
          <h1 style={{ fontFamily: f.h, fontSize: 42, fontWeight: 900, color: C.white, marginTop: 16, marginBottom: 8, letterSpacing: -1.5 }}>
            CMMC Readiness Check
          </h1>
          <p style={{ fontSize: 15, color: C.off, maxWidth: 600, lineHeight: 1.7 }}>
            Answer 8 questions to get an estimated SPRS score and identify your biggest compliance gaps.
            Takes about 3 minutes.
          </p>
        </div>
      </section>

      <section style={{ padding: "32px 32px 64px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>

          {step === 0 && (
            <div style={{ textAlign: "center", animation: "fu .5s ease-out" }}>
              <div style={{
                width: 80, height: 80, borderRadius: 20, margin: "0 auto 24px",
                background: C.primary + "12", border: `1px solid ${C.primary}25`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Shield s={40} />
              </div>
              <h2 style={{ fontFamily: f.h, fontSize: 28, fontWeight: 800, color: C.white, marginBottom: 10 }}>
                Ready to check your CMMC posture?
              </h2>
              <p style={{ fontSize: 14, color: C.off, lineHeight: 1.7, marginBottom: 8 }}>
                This assessment covers key control areas from NIST SP 800-171 that form the foundation of CMMC Level 2.
                Your estimated SPRS score will help you understand where you stand.
              </p>
              <p style={{ fontSize: 12, color: C.muted, marginBottom: 28 }}>
                8 questions · ~3 minutes · No login required · Instant results
              </p>
              <button onClick={() => setStep(1)} style={{
                padding: "14px 36px", borderRadius: 10, border: "none", cursor: "pointer",
                background: C.primary, color: C.bg, fontSize: 15, fontWeight: 700, fontFamily: f.h,
                boxShadow: `0 0 24px ${C.primaryGlow}`,
              }}>Begin Assessment →</button>
            </div>
          )}

          {step >= 1 && step <= QUIZ_QUESTIONS.length && (() => {
            const qi = step - 1;
            const q = QUIZ_QUESTIONS[qi];
            return (
              <div key={qi} style={{ animation: "fu .4s ease-out" }}>
                {/* Progress */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontFamily: f.m, color: C.muted }}>Question {qi + 1} of {QUIZ_QUESTIONS.length}</span>
                  <span style={{ fontSize: 11, fontFamily: f.m, color: C.primary }}>{q.family}</span>
                </div>
                <div style={{ height: 3, background: C.dim, borderRadius: 2, marginBottom: 32, overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 2, background: `linear-gradient(90deg, ${C.primary}, ${C.blue})`, width: `${(qi / QUIZ_QUESTIONS.length) * 100}%`, transition: "width .4s ease" }} />
                </div>

                <h2 style={{ fontFamily: f.h, fontSize: 22, fontWeight: 700, color: C.white, lineHeight: 1.35, marginBottom: 28 }}>
                  {q.q}
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {q.opts.map((opt, oi) => {
                    const selected = answers[qi] === oi;
                    const scoreColor = opt.w === 3 ? C.primary : opt.w === 2 ? C.blue : opt.w === 1 ? C.warn : C.red;
                    return (
                      <button key={oi} onClick={() => handleAnswer(qi, oi)} style={{
                        padding: "16px 18px", borderRadius: 10, cursor: "pointer", textAlign: "left",
                        background: selected ? scoreColor + "10" : C.bgCard,
                        border: `1px solid ${selected ? scoreColor + "40" : C.border}`,
                        display: "flex", alignItems: "center", gap: 14, transition: "all .2s",
                      }}>
                        <div style={{
                          width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                          border: `2px solid ${selected ? scoreColor : C.muted}`,
                          background: selected ? scoreColor : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "all .2s",
                        }}>
                          {selected && <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.bg }} />}
                        </div>
                        <span style={{ fontSize: 14, color: selected ? C.white : C.off, lineHeight: 1.4 }}>{opt.t}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Question nav */}
                <div style={{ display: "flex", gap: 4, marginTop: 24, justifyContent: "center" }}>
                  {QUIZ_QUESTIONS.map((_, i) => (
                    <div key={i} style={{
                      width: step - 1 === i ? 20 : 8, height: 6, borderRadius: 3,
                      background: answers[i] !== undefined ? C.primary : step - 1 === i ? C.accent : C.dim,
                      transition: "all .3s", cursor: answers[i] !== undefined ? "pointer" : "default",
                    }} onClick={() => { if (answers[i] !== undefined) setStep(i + 1); }} />
                  ))}
                </div>
              </div>
            );
          })()}

          {step > QUIZ_QUESTIONS.length && (
            <div style={{ animation: "fu .5s ease-out" }}>
              {/* Score display */}
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <div style={{ fontSize: 11, fontFamily: f.m, color: C.muted, letterSpacing: 1.5, marginBottom: 16 }}>YOUR ESTIMATED SPRS SCORE</div>
                <div style={{
                  fontFamily: f.h, fontSize: 80, fontWeight: 900, color: grade.c,
                  lineHeight: 1,
                }}>{score}<span style={{ fontSize: 28, fontWeight: 500, color: C.muted }}>/110</span></div>
                <div style={{
                  display: "inline-block", marginTop: 14, padding: "6px 18px",
                  borderRadius: 8, background: grade.c + "15", border: `1px solid ${grade.c}30`,
                  fontFamily: f.h, fontSize: 15, fontWeight: 700, color: grade.c,
                }}>{grade.g}</div>
              </div>

              <p style={{ fontSize: 15, color: C.off, lineHeight: 1.7, textAlign: "center", marginBottom: 32, maxWidth: 520, margin: "0 auto 32px" }}>
                {grade.m}
              </p>

              {/* Gap breakdown */}
              <div style={{ padding: 24, borderRadius: 14, background: C.bgCard, border: `1px solid ${C.border}`, marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.off, fontFamily: f.m, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>Gap Analysis by Control Area</div>
                {QUIZ_QUESTIONS.map((q, i) => {
                  const a = answers[i];
                  const w = a !== undefined ? q.opts[a].w : 0;
                  const pct = (w / 3) * 100;
                  const barColor = w === 3 ? C.primary : w === 2 ? C.blue : w === 1 ? C.warn : C.red;
                  return (
                    <div key={i} style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 12, color: C.off }}>{q.family}</span>
                        <span style={{ fontSize: 11, fontFamily: f.m, color: barColor }}>{w === 3 ? "Met" : w === 2 ? "Partial" : w === 1 ? "Weak" : "Gap"}</span>
                      </div>
                      <div style={{ height: 5, background: C.dim, borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: barColor, borderRadius: 3, animation: "bg .8s ease-out", transition: "width .5s" }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Lead capture CTA */}
              <div style={{
                padding: 28, borderRadius: 14,
                background: `linear-gradient(135deg, ${C.accent}0c, ${C.primary}06)`,
                border: `1px solid ${C.accent}25`, textAlign: "center",
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.accent, fontFamily: f.m, letterSpacing: 1.5, marginBottom: 8 }}>
                  GET YOUR FULL COMPLIANCE REPORT
                </div>
                <p style={{ fontSize: 13, color: C.off, marginBottom: 16, lineHeight: 1.6 }}>
                  Download a detailed gap analysis with specific remediation steps for each control area — and get matched to verified CMMC partners who specialize in your gaps.
                </p>
                <div style={{ display: "flex", gap: 8, maxWidth: 440, margin: "0 auto" }}>
                  <input type="email" placeholder="your.email@company.com" style={{
                    flex: 1, padding: "12px 16px", borderRadius: 8, background: C.bg,
                    border: `1px solid ${C.dim}`, color: C.white, fontSize: 13, fontFamily: f.b, outline: "none",
                  }} />
                  <button style={{
                    padding: "12px 22px", borderRadius: 8, border: "none", cursor: "pointer",
                    background: C.accent, color: C.white, fontSize: 13, fontWeight: 700, fontFamily: f.h,
                    whiteSpace: "nowrap",
                  }}>Get Report →</button>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 20 }}>
                <button onClick={reset} style={{
                  padding: "8px 18px", borderRadius: 8, background: "transparent",
                  border: `1px solid ${C.dim}`, color: C.muted, fontSize: 12, cursor: "pointer", fontFamily: f.m,
                }}>↺ Retake</button>
                <button onClick={() => setActive("directory")} style={{
                  padding: "8px 18px", borderRadius: 8, background: C.blue + "14",
                  border: `1px solid ${C.blue}30`, color: C.blue, fontSize: 12, cursor: "pointer",
                  fontWeight: 600, fontFamily: f.h,
                }}>Find a CMMC Partner →</button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};


// ── DIRECTORY PAGE ──

const DirectoryPage = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const filtered = PARTNER_DATA.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase()) || p.specialty.toLowerCase().includes(search.toLowerCase());
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
              onMouseLeave={e => { e.currentTarget.style.borderColor = (p.featured ? C.primary + "20" : C.border); }}
              >
                {/* Badge */}
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
};


// ── RESOURCES PAGE ──

const ResourcesPage = () => {
  const resources = [
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
          {resources.map((group, gi) => (
            <div key={gi} style={{ marginBottom: 36 }}>
              <h3 style={{ fontFamily: f.h, fontSize: 18, fontWeight: 700, color: C.white, marginBottom: 14, paddingBottom: 8, borderBottom: `1px solid ${C.border}` }}>
                {group.cat}
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
                {group.items.map((r, ri) => (
                  <div key={ri} style={{
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
                    }}>{r.type === "PDF" ? "PDF" : r.type === "Template" ? "TPL" : r.type === "Standard" ? "STD" : "↗"}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: f.h, fontSize: 14, fontWeight: 700, color: C.white, marginBottom: 3 }}>{r.title}</div>
                      <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.5, marginBottom: 6 }}>{r.desc}</p>
                      <span style={{ fontSize: 10, color: r.color, fontFamily: f.m }}>Source: {r.src}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};


// ── APP SHELL ──

export default function CMMCReview() {
  const [active, setActive] = useState("home");

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [active]);

  return (
    <div>
      <GlobalStyle />
      <Nav active={active} setActive={setActive} />
      {active === "home" && <HomePage setActive={setActive} />}
      {active === "learn" && <LearnPage />}
      {active === "assess" && <AssessPage setActive={setActive} />}
      {active === "directory" && <DirectoryPage />}
      {active === "resources" && <ResourcesPage />}
    </div>
  );
}
