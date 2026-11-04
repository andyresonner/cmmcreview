'use client';

import { useState } from 'react';
import { C, f } from '../../lib/constants';
import { Badge } from '../../lib/ui';

const TIERS = [
  {
    name: 'Basic',
    price: 'Free',
    sub: 'Forever',
    color: C.muted,
    desc: 'Your organization is already listed from the official Cyber AB marketplace. No action required.',
    features: [
      'Public profile auto-populated from Cyber AB',
      'Searchable in directory by 10,000+ monthly visitors',
      'Profile page with contact info and services',
      'No lead access',
    ],
    cta: 'Already listed',
    disabled: true,
  },
  {
    name: 'Enhanced',
    price: '$299',
    sub: 'per month',
    color: C.blue,
    badge: 'Most Popular',
    desc: 'Get verified, receive leads, and appear above unverified providers in search results.',
    features: [
      'Verified badge on your profile',
      'Priority placement in directory search',
      'Email notification for every new lead',
      'Full lead details: name, company, email, need',
      'Custom bio and service tags',
      'Logo and brand colors on profile',
      'Monthly analytics report',
    ],
    cta: 'Apply for Enhanced →',
    tier: 'enhanced',
  },
  {
    name: 'Featured',
    price: '$999',
    sub: 'per month',
    color: C.primary,
    badge: 'Maximum Visibility',
    desc: 'Top placement everywhere on the platform, homepage feature, and dedicated account support.',
    features: [
      'Everything in Enhanced',
      'Homepage "Featured Partner" card',
      'Top of all relevant search results',
      'Real-time Slack/email lead alerts',
      'Post-assessment matching (shown to users by gap profile)',
      'Dedicated account manager',
      'Quarterly performance review',
      'Co-marketing opportunities',
    ],
    cta: 'Apply for Featured →',
    tier: 'featured',
  },
];

const FAQS = [
  { q: 'Who gets listed automatically?', a: 'All 6,836 organizations and practitioners currently on the Cyber AB Marketplace are automatically included at no cost. You have a live public profile right now — search your organization name to see it.' },
  { q: 'How are leads routed?', a: 'When a defense contractor submits a "Request Info" form for your organization, we receive it, qualify the lead, and forward full contact details to your designated email. Enhanced and Featured partners receive leads in real time.' },
  { q: 'What counts as a "qualified lead"?', a: 'Any contractor who submits their name, company email, and stated need through CMMCReview. We filter out spam and incomplete submissions before routing.' },
  { q: 'Can I cancel anytime?', a: 'Yes. Month-to-month billing, cancel any time with no penalty. Your basic free listing remains active after cancellation.' },
  { q: 'Is this affiliated with Cyber AB?', a: 'No. CMMCReview is an independent platform. We use publicly available Cyber AB marketplace data to populate provider listings, but we have no formal relationship with Cyber AB or the DoD.' },
];

function TierCard({ tier }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: '28px 26px', borderRadius: 16, flex: 1,
        background: tier.disabled ? C.bgCard : hover ? tier.color + '0a' : C.bgCard,
        border: `1px solid ${hover && !tier.disabled ? tier.color + '40' : tier.disabled ? C.border : tier.color + '25'}`,
        transition: 'all .2s', position: 'relative', overflow: 'hidden',
      }}
    >
      {tier.badge && (
        <div style={{
          position: 'absolute', top: 14, right: 14,
          padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700,
          background: tier.color + '18', color: tier.color, fontFamily: f.m,
        }}>{tier.badge}</div>
      )}
      <div style={{ fontSize: 13, color: tier.color, fontFamily: f.m, fontWeight: 700, marginBottom: 8 }}>{tier.name}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
        <span style={{ fontFamily: f.h, fontSize: 36, fontWeight: 900, color: tier.disabled ? C.muted : C.white }}>{tier.price}</span>
        <span style={{ fontSize: 13, color: C.muted }}>{tier.sub}</span>
      </div>
      <p style={{ fontSize: 13, color: C.off, lineHeight: 1.6, marginBottom: 20, minHeight: 48 }}>{tier.desc}</p>
      <ul style={{ listStyle: 'none', margin: '0 0 24px', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {tier.features.map((feat, i) => (
          <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13, color: C.off, lineHeight: 1.4 }}>
            <span style={{ color: tier.disabled ? C.muted : tier.color, flexShrink: 0, marginTop: 1 }}>✓</span>
            {feat}
          </li>
        ))}
      </ul>
      <button
        disabled={tier.disabled}
        onClick={() => { if (!tier.disabled) document.getElementById('apply-form').scrollIntoView({ behavior: 'smooth' }); }}
        style={{
          width: '100%', padding: '12px', borderRadius: 10, border: 'none',
          background: tier.disabled ? C.dim : tier.color,
          color: tier.disabled ? C.muted : tier.name === 'Featured' ? C.bg : C.white,
          fontSize: 13, fontWeight: 700, fontFamily: f.h,
          cursor: tier.disabled ? 'default' : 'pointer',
          transition: 'opacity .15s',
        }}
      >{tier.cta}</button>
    </div>
  );
}

export default function GetListedPage() {
  const [form, setForm]     = useState({ org: '', contact: '', email: '', phone: '', tier: 'enhanced', url: '', message: '' });
  const [status, setStatus] = useState('idle');

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setStatus('submitting');
    try {
      await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: 8, fontSize: 13, boxSizing: 'border-box',
    background: C.bg, border: `1px solid ${C.dim}`, color: C.white,
    fontFamily: f.b, outline: 'none', transition: 'border-color .15s',
  };
  const label = txt => (
    <label style={{ fontSize: 11, color: C.muted, fontFamily: f.m, display: 'block', marginBottom: 5 }}>{txt}</label>
  );

  return (
    <div style={{ paddingTop: 56 }}>
      {/* Hero */}
      <section style={{ padding: '64px 32px 48px', background: C.bgMid }}>
        <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center' }}>
          <Badge color={C.primary} mono>Partner Program</Badge>
          <h1 style={{ fontFamily: f.h, fontSize: 48, fontWeight: 900, color: C.white, marginTop: 16, marginBottom: 16, letterSpacing: -2 }}>
            Reach defense contractors<br/>
            <span style={{ color: C.primary }}>when they need you most.</span>
          </h1>
          <p style={{ fontSize: 16, color: C.off, maxWidth: 580, margin: '0 auto', lineHeight: 1.7 }}>
            CMMCReview is where 10,000+ defense contractors come to find CMMC help.
            Phase 2 enforcement started this month. These are qualified buyers with active contracts and urgent compliance deadlines.
          </p>

          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 36, flexWrap: 'wrap' }}>
            {[
              { val: '10,000+', lab: 'Monthly contractor visits' },
              { val: '6,836', lab: 'Providers already listed' },
              { val: 'Nov 2026', lab: 'Phase 2 enforcement live' },
              { val: '1 day', lab: 'Avg. lead response SLA' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: f.h, fontSize: 28, fontWeight: 800, color: C.primary }}>{s.val}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{s.lab}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing tiers */}
      <section style={{ padding: '48px 32px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <h2 style={{ fontFamily: f.h, fontSize: 28, fontWeight: 800, color: C.white, marginBottom: 6, letterSpacing: -0.5 }}>
            Choose your plan
          </h2>
          <p style={{ fontSize: 14, color: C.muted, marginBottom: 32 }}>All providers are free to list. Paid plans unlock leads and visibility.</p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {TIERS.map(t => <TierCard key={t.name} tier={t} />)}
          </div>
        </div>
      </section>

      {/* Application form */}
      <section id="apply-form" style={{ padding: '48px 32px 80px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontFamily: f.h, fontSize: 28, fontWeight: 800, color: C.white, marginBottom: 6, letterSpacing: -0.5 }}>
            Apply for a Premium Listing
          </h2>
          <p style={{ fontSize: 14, color: C.muted, marginBottom: 32 }}>
            We review every application and respond within 1 business day.
          </p>

          {status === 'success' ? (
            <div style={{
              padding: 32, borderRadius: 14, textAlign: 'center',
              background: C.primary + '08', border: `1px solid ${C.primary}25`,
            }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>✓</div>
              <div style={{ fontFamily: f.h, fontSize: 20, fontWeight: 700, color: C.white, marginBottom: 8 }}>Application received</div>
              <p style={{ fontSize: 14, color: C.off, lineHeight: 1.6 }}>
                We'll review your application and reach out to <strong style={{ color: C.white }}>{form.email}</strong> within 1 business day.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                {label('ORGANIZATION NAME *')}
                <input value={form.org} onChange={set('org')} required placeholder="Your company name" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = C.primary + '60'} onBlur={e => e.target.style.borderColor = C.dim} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  {label('CONTACT NAME *')}
                  <input value={form.contact} onChange={set('contact')} required placeholder="Jane Smith" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = C.primary + '60'} onBlur={e => e.target.style.borderColor = C.dim} />
                </div>
                <div>
                  {label('WORK EMAIL *')}
                  <input type="email" value={form.email} onChange={set('email')} required placeholder="you@company.com" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = C.primary + '60'} onBlur={e => e.target.style.borderColor = C.dim} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  {label('PHONE')}
                  <input value={form.phone} onChange={set('phone')} placeholder="+1 (555) 000-0000" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = C.primary + '60'} onBlur={e => e.target.style.borderColor = C.dim} />
                </div>
                <div>
                  {label('WEBSITE')}
                  <input value={form.url} onChange={set('url')} placeholder="https://…" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = C.primary + '60'} onBlur={e => e.target.style.borderColor = C.dim} />
                </div>
              </div>

              <div>
                {label('PREFERRED TIER *')}
                <select value={form.tier} onChange={set('tier')} required style={{ ...inputStyle, cursor: 'pointer' }}
                  onFocus={e => e.target.style.borderColor = C.primary + '60'} onBlur={e => e.target.style.borderColor = C.dim}>
                  <option value="enhanced">Enhanced — $299/mo</option>
                  <option value="featured">Featured — $999/mo</option>
                </select>
              </div>

              <div>
                {label('ANYTHING ELSE?')}
                <textarea value={form.message} onChange={set('message')} rows={3}
                  placeholder="Types of contractors you serve, geographic focus, questions about the program…"
                  style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }}
                  onFocus={e => e.target.style.borderColor = C.primary + '60'} onBlur={e => e.target.style.borderColor = C.dim} />
              </div>

              {status === 'error' && (
                <div style={{ padding: '10px 14px', borderRadius: 8, background: C.red + '12', border: `1px solid ${C.red}30`, color: C.red, fontSize: 12 }}>
                  Something went wrong. Please try again.
                </div>
              )}

              <button type="submit" disabled={status === 'submitting'} style={{
                padding: '14px', borderRadius: 10, border: 'none',
                background: status === 'submitting' ? C.primaryDim : C.primary,
                color: C.bg, fontSize: 14, fontWeight: 700, fontFamily: f.h, cursor: 'pointer',
                boxShadow: `0 0 24px ${C.primaryGlow}`,
              }}>
                {status === 'submitting' ? 'Sending…' : 'Submit Application →'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* FAQs */}
      <section style={{ padding: '0 32px 80px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <h2 style={{ fontFamily: f.h, fontSize: 22, fontWeight: 800, color: C.white, marginBottom: 24, letterSpacing: -0.3 }}>
            Common questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {FAQS.map((faq, i) => (
              <details key={i} style={{ borderRadius: 10, background: C.bgCard, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
                <summary style={{
                  padding: '14px 18px', cursor: 'pointer', fontSize: 14,
                  fontWeight: 600, color: C.white, fontFamily: f.h, listStyle: 'none',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  {faq.q}
                  <span style={{ color: C.muted, fontWeight: 400, fontSize: 16, flexShrink: 0 }}>+</span>
                </summary>
                <div style={{ padding: '0 18px 16px', fontSize: 13, color: C.off, lineHeight: 1.7 }}>
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
