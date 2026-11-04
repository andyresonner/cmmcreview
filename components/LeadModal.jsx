'use client';

import { useState, useEffect } from 'react';
import { C, f } from '../lib/constants';

const NEEDS = [
  { v: 'gap',        l: 'Gap analysis / readiness assessment' },
  { v: 'assessment', l: 'Formal C3PAO assessment' },
  { v: 'docs',       l: 'SSP / documentation support' },
  { v: 'training',   l: 'Staff training & awareness' },
  { v: 'ongoing',    l: 'Ongoing managed compliance' },
  { v: 'other',      l: 'General inquiry' },
];

export default function LeadModal({ provider, onClose }) {
  const [form, setForm]       = useState({ name: '', company: '', email: '', need: '', message: '' });
  const [status, setStatus]   = useState('idle'); // idle | submitting | success | error
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // mount animation
    requestAnimationFrame(() => setMounted(true));
    // trap scroll
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleClose = () => {
    setMounted(false);
    setTimeout(onClose, 200);
  };

  const handleKeyDown = (e) => { if (e.key === 'Escape') handleClose(); };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const set = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.need) return;
    setStatus('submitting');
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          providerId:   provider?.storeId,
          providerName: provider?.name,
          providerType: provider?.type,
        }),
      });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const color = C.primary;

  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: 8, fontSize: 13,
    background: C.bg, border: `1px solid ${C.dim}`, color: C.white,
    fontFamily: f.b, outline: 'none', boxSizing: 'border-box',
    transition: 'border-color .15s',
  };

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) handleClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        background: 'rgba(6,11,20,.85)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px 16px',
        opacity: mounted ? 1 : 0, transition: 'opacity .2s',
      }}
    >
      <div style={{
        width: '100%', maxWidth: 480, borderRadius: 16,
        background: C.bgCard, border: `1px solid ${C.border}`,
        boxShadow: `0 24px 80px rgba(0,0,0,.6), 0 0 0 1px ${C.dim}`,
        transform: mounted ? 'translateY(0)' : 'translateY(16px)',
        transition: 'transform .2s ease-out',
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px 18px', borderBottom: `1px solid ${C.border}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        }}>
          <div>
            <div style={{ fontSize: 11, color: C.muted, fontFamily: f.m, marginBottom: 4 }}>
              REQUEST INFORMATION
            </div>
            {provider && (
              <div style={{ fontFamily: f.h, fontSize: 17, fontWeight: 700, color: C.white }}>
                {provider.name}
              </div>
            )}
            {provider?.type && (
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{provider.type}</div>
            )}
          </div>
          <button
            onClick={handleClose}
            style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 20, padding: '0 0 0 12px', lineHeight: 1 }}
          >✕</button>
        </div>

        <div style={{ padding: '24px' }}>
          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '16px 0 8px' }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%', margin: '0 auto 16px',
                background: color + '15', border: `1px solid ${color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24,
              }}>✓</div>
              <div style={{ fontFamily: f.h, fontSize: 18, fontWeight: 700, color: C.white, marginBottom: 8 }}>
                Request sent
              </div>
              <p style={{ fontSize: 13, color: C.off, lineHeight: 1.6, marginBottom: 20 }}>
                We've received your request and will connect you with {provider?.name || 'this provider'} within 1 business day.
              </p>
              {provider?.website && (
                <a href={provider.website.startsWith('http') ? provider.website : `https://${provider.website}`}
                   target="_blank" rel="noopener noreferrer"
                   style={{
                     display: 'inline-block', padding: '10px 24px', borderRadius: 8,
                     background: color + '14', color, fontSize: 13, fontWeight: 700,
                     fontFamily: f.h, textDecoration: 'none',
                   }}>
                  Visit {provider.name} ↗
                </a>
              )}
              <button onClick={handleClose} style={{
                display: 'block', width: '100%', marginTop: 12, padding: '10px', borderRadius: 8,
                background: 'none', border: `1px solid ${C.dim}`, color: C.muted,
                fontSize: 12, cursor: 'pointer', fontFamily: f.m,
              }}>Close</button>
            </div>
          ) : (
            <form onSubmit={submit}>
              <p style={{ fontSize: 13, color: C.off, lineHeight: 1.6, marginBottom: 20 }}>
                Tell us what you need — we'll make the introduction. No spam, no sales calls from us.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                <div>
                  <label style={{ fontSize: 11, color: C.muted, fontFamily: f.m, display: 'block', marginBottom: 5 }}>YOUR NAME *</label>
                  <input
                    value={form.name} onChange={set('name')} required
                    placeholder="Jane Smith" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = color + '60'}
                    onBlur={e => e.target.style.borderColor = C.dim}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: C.muted, fontFamily: f.m, display: 'block', marginBottom: 5 }}>COMPANY</label>
                  <input
                    value={form.company} onChange={set('company')}
                    placeholder="Acme Defense LLC" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = color + '60'}
                    onBlur={e => e.target.style.borderColor = C.dim}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 11, color: C.muted, fontFamily: f.m, display: 'block', marginBottom: 5 }}>WORK EMAIL *</label>
                <input
                  type="email" value={form.email} onChange={set('email')} required
                  placeholder="you@company.com" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = color + '60'}
                  onBlur={e => e.target.style.borderColor = C.dim}
                />
              </div>

              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 11, color: C.muted, fontFamily: f.m, display: 'block', marginBottom: 5 }}>WHAT DO YOU NEED? *</label>
                <select
                  value={form.need} onChange={set('need')} required
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  onFocus={e => e.target.style.borderColor = color + '60'}
                  onBlur={e => e.target.style.borderColor = C.dim}
                >
                  <option value="">Select…</option>
                  {NEEDS.map(n => <option key={n.v} value={n.v}>{n.l}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 11, color: C.muted, fontFamily: f.m, display: 'block', marginBottom: 5 }}>MESSAGE (OPTIONAL)</label>
                <textarea
                  value={form.message} onChange={set('message')} rows={3}
                  placeholder="Brief context about your environment, contract type, or timeline…"
                  style={{ ...inputStyle, resize: 'vertical', minHeight: 70 }}
                  onFocus={e => e.target.style.borderColor = color + '60'}
                  onBlur={e => e.target.style.borderColor = C.dim}
                />
              </div>

              {status === 'error' && (
                <div style={{ padding: '10px 14px', borderRadius: 8, background: C.red + '12', border: `1px solid ${C.red}30`, color: C.red, fontSize: 12, marginBottom: 14 }}>
                  Something went wrong — please try again or email us directly.
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                style={{
                  width: '100%', padding: '13px', borderRadius: 10, border: 'none', cursor: 'pointer',
                  background: status === 'submitting' ? C.primaryDim : color,
                  color: C.bg, fontSize: 14, fontWeight: 700, fontFamily: f.h,
                  boxShadow: `0 0 20px ${C.primaryGlow}`,
                  transition: 'background .15s',
                }}
              >
                {status === 'submitting' ? 'Sending…' : 'Send Request →'}
              </button>

              <p style={{ fontSize: 11, color: C.muted, textAlign: 'center', marginTop: 12, lineHeight: 1.5 }}>
                We'll introduce you within 1 business day. We never share your info without permission.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
