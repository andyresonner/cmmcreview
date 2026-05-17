'use client';

import Link from 'next/link';
import { C, f, LEVELS, TIMELINE } from '../lib/constants';
import { Shield, Badge } from '../lib/ui';

export default function HomePage() {
  return (
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
              <Link href="/assess" style={{
                padding: "14px 28px", borderRadius: 10, textDecoration: "none", display: "inline-block",
                background: C.primary, color: C.bg, fontSize: 14, fontWeight: 700,
                fontFamily: f.h, letterSpacing: 0.2,
                boxShadow: `0 0 24px ${C.primaryGlow}, 0 4px 12px rgba(0,0,0,.3)`,
              }}>Take the Free Readiness Check</Link>
              <Link href="/learn" style={{
                padding: "14px 28px", borderRadius: 10, textDecoration: "none", display: "inline-block",
                background: "transparent", border: `1px solid ${C.dim}`,
                color: C.off, fontSize: 14, fontWeight: 600, fontFamily: f.h,
              }}>Learn CMMC Basics →</Link>
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

          <Link href="/learn" style={{
            display: "inline-block", marginTop: 24, padding: "10px 20px", borderRadius: 8, border: `1px solid ${C.dim}`,
            background: "transparent", color: C.off, fontSize: 12, fontWeight: 600,
            fontFamily: f.h, textDecoration: "none",
          }}>Explore all CMMC levels in depth →</Link>
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
            <div style={{ position: "absolute", left: 19, top: 8, bottom: 8, width: 2, background: C.dim }} />
            {TIMELINE.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 20, padding: "16px 0", position: "relative" }}>
                <div style={{ width: 40, flexShrink: 0, display: "flex", justifyContent: "center", paddingTop: 2, zIndex: 1 }}>
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
          <Link href="/assess" style={{
            padding: "14px 28px", borderRadius: 10, textDecoration: "none", display: "inline-block",
            background: C.primary, color: C.bg, fontSize: 14, fontWeight: 700, fontFamily: f.h,
            boxShadow: `0 0 20px ${C.primaryGlow}`,
          }}>Start Readiness Check →</Link>
        </div>
      </section>

      {/* Quick links */}
      <section style={{ padding: "64px 32px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {[
              { icon: "📚", title: "CMMC Academy", desc: "Free courses on every CMMC level and control family. Plain-English explainers with real examples.", btn: "Start Learning", href: "/learn", color: C.primary },
              { icon: "🤝", title: "Find a Partner", desc: "Searchable directory of verified MSPs, C3PAOs, and consultants. Filter by state, specialty, and level.", btn: "Browse Directory", href: "/directory", color: C.blue },
              { icon: "📋", title: "Resource Library", desc: "Free templates, checklists, and guides — SSPs, POA&Ms, scoping tools, and more.", btn: "Get Resources", href: "/resources", color: C.warn },
            ].map((c, i) => (
              <Link key={i} href={c.href} style={{ textDecoration: "none", display: "block" }}>
                <div style={{
                  padding: 28, borderRadius: 14, background: C.bgCard,
                  border: `1px solid ${c.color}12`, cursor: "pointer",
                  transition: "all .25s", height: "100%",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = c.color + "35"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = c.color + "12"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <div style={{ fontSize: 28, marginBottom: 14 }}>{c.icon}</div>
                  <h3 style={{ fontFamily: f.h, fontSize: 20, fontWeight: 700, color: C.white, marginBottom: 8 }}>{c.title}</h3>
                  <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, marginBottom: 18 }}>{c.desc}</p>
                  <span style={{ fontSize: 13, fontWeight: 700, color: c.color, fontFamily: f.h }}>{c.btn} →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
