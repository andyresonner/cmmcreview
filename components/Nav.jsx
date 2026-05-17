'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { C, f } from '../lib/constants';
import { Shield } from '../lib/ui';

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/learn", label: "Learn CMMC" },
  { href: "/assess", label: "Readiness Check" },
  { href: "/directory", label: "Find a Partner" },
  { href: "/resources", label: "Resources" },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const isActive = (href) => href === "/" ? pathname === "/" : pathname === href;

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      background: scrolled ? `${C.bg}f0` : `${C.bg}cc`,
      backdropFilter: "blur(16px)", borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
      padding: "0 32px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between",
      transition: "all .3s",
    }}>
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
        <Shield s={22} />
        <span style={{ fontFamily: f.h, fontSize: 18, fontWeight: 800, color: C.white, letterSpacing: -0.3 }}>
          cmmc<span style={{ color: C.primary }}>review</span><span style={{ color: C.muted, fontWeight: 400, fontSize: 14 }}>.org</span>
        </span>
      </Link>

      <div style={{ display: "flex", gap: 2 }}>
        {NAV_ITEMS.map(n => (
          <Link key={n.href} href={n.href} style={{
            padding: "6px 14px", borderRadius: 8, textDecoration: "none", display: "inline-block",
            background: isActive(n.href) ? C.primary + "14" : "transparent",
            color: isActive(n.href) ? C.primary : C.off,
            fontSize: 12.5, fontWeight: 600, transition: "all .2s", fontFamily: f.b,
          }}>{n.label}</Link>
        ))}
      </div>

      <Link href="/assess" style={{
        padding: "8px 18px", borderRadius: 8, textDecoration: "none", display: "inline-block",
        background: C.primary, color: C.bg, fontSize: 12, fontWeight: 700,
        fontFamily: f.h, letterSpacing: 0.2,
      }}>Free Assessment →</Link>
    </nav>
  );
}
