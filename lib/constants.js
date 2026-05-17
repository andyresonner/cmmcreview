export const C = {
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

export const f = {
  h: "'Outfit', system-ui, sans-serif",
  b: "'Plus Jakarta Sans', system-ui, sans-serif",
  m: "'IBM Plex Mono', monospace",
};

export const LEVELS = [
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

export const TIMELINE = [
  { date: "Nov 10, 2025", phase: "Phase 1", title: "Self-Assessments Begin", desc: "Level 1 and Level 2 self-assessments required in select contracts. DoD may also require C3PAO certifications at its discretion.", status: "active", color: C.primary },
  { date: "Nov 10, 2026", phase: "Phase 2", title: "C3PAO Audits Mandatory", desc: "Third-party C3PAO certifications become mandatory for Level 2 contracts. Level 3 DIBCAC assessments may begin.", status: "upcoming", color: C.accent },
  { date: "Nov 10, 2027", phase: "Phase 3", title: "Level 3 Enforcement", desc: "Level 3 DIBCAC assessments required for applicable contracts. Full enforcement across all three levels.", status: "future", color: C.blue },
  { date: "Nov 10, 2028", phase: "Phase 4", title: "Full Implementation", desc: "CMMC requirements included in all applicable DoD contracts. Complete rollout across the Defense Industrial Base.", status: "future", color: C.purple },
];

export const CONTROL_FAMILIES = [
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

export const QUIZ_QUESTIONS = [
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

export const PARTNER_DATA = [
  { name: "CyberShield MSP", type: "MSP/MSSP", badge: "RPO", location: "Northern Virginia", rating: 4.9, reviews: 47, levels: "L1 & L2", specialty: "Manufacturing", featured: true },
  { name: "FedSecure Partners", type: "C3PAO", badge: "C3PAO", location: "Maryland", rating: 4.8, reviews: 32, levels: "L2 & L3", specialty: "Aerospace & Defense" },
  { name: "ComplianceForge", type: "Consultant", badge: "RPO", location: "Texas", rating: 4.7, reviews: 28, levels: "L1 & L2", specialty: "Small Business" },
  { name: "DefenseIT Solutions", type: "MSP", badge: "RPO", location: "Colorado", rating: 4.6, reviews: 19, levels: "L2", specialty: "Engineering & IT" },
  { name: "Sentinel Cyber Group", type: "MSSP", badge: "RPO", location: "California", rating: 4.8, reviews: 41, levels: "L1, L2, L3", specialty: "Cleared Contractors" },
  { name: "Patriot Compliance", type: "C3PAO", badge: "C3PAO", location: "Florida", rating: 4.5, reviews: 15, levels: "L2", specialty: "Subcontractors" },
];
