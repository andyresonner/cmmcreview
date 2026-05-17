import { C, f } from './constants';

export const Shield = ({ s = 24, c = C.primary }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ animation: "sp 4s ease-in-out infinite", flexShrink: 0 }}>
    <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill={c} opacity=".12" stroke={c} strokeWidth="1.5"/>
    <path d="M9 12l2 2 4-4" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const Badge = ({ children, color = C.primary, mono }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "4px 10px", borderRadius: 6,
    background: color + "14", border: `1px solid ${color}25`,
    fontSize: 10, fontWeight: 700, color, letterSpacing: 1.2, textTransform: "uppercase",
    fontFamily: mono ? f.m : f.b,
  }}>{children}</span>
);

export const Pill = ({ active, color, children, onClick }) => (
  <button onClick={onClick} style={{
    padding: "8px 18px", borderRadius: 10, cursor: "pointer", border: "none",
    background: active ? color + "18" : C.bgCard,
    outline: active ? `1px solid ${color}40` : `1px solid transparent`,
    color: active ? color : C.off, fontSize: 13, fontWeight: 600,
    transition: "all .25s", fontFamily: f.b,
  }}>{children}</button>
);
