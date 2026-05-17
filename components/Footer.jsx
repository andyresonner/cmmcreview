import Link from 'next/link';
import { C, f } from '../lib/constants';
import { Shield } from '../lib/ui';

export default function Footer() {
  return (
    <footer style={{ padding: "36px 32px", borderTop: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <Shield s={18} />
          <span style={{ fontFamily: f.h, fontSize: 14, fontWeight: 700, color: C.muted }}>
            cmmcreview.org
          </span>
        </Link>
        <p style={{ fontSize: 11, color: C.muted }}>
          Independent CMMC education resource. Not affiliated with the DoD or Cyber AB. Not legal or compliance advice.
        </p>
      </div>
    </footer>
  );
}
