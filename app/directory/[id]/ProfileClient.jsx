'use client';

import { useState } from 'react';
import { C, f } from '../../../lib/constants';
import LeadModal from '../../../components/LeadModal';

export default function ProfileClient({ provider, color, sidebar }) {
  const [open, setOpen] = useState(false);

  if (sidebar) {
    return (
      <>
        <div style={{ padding: 20, borderRadius: 12, background: C.bgCard, border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 12, color: C.muted, fontFamily: f.m, marginBottom: 12 }}>Contact</div>
          <button
            onClick={() => setOpen(true)}
            style={{
              display: 'block', width: '100%', padding: '11px 0', borderRadius: 8,
              background: color, color: '#000', fontSize: 13, fontWeight: 700,
              fontFamily: f.h, textAlign: 'center', border: 'none', cursor: 'pointer',
              marginBottom: provider?.website ? 8 : 0,
              boxShadow: `0 0 20px ${color}22`,
            }}>
            Request Information
          </button>
          {provider?.website && (
            <a href={provider.website.startsWith('http') ? provider.website : `https://${provider.website}`}
               target="_blank" rel="noopener noreferrer"
               style={{
                 display: 'block', width: '100%', padding: '11px 0', borderRadius: 8,
                 background: color + '14', color, fontSize: 13, fontWeight: 700,
                 fontFamily: f.h, textAlign: 'center', textDecoration: 'none',
               }}>
              Visit Website ↗
            </a>
          )}
        </div>
        {open && <LeadModal provider={provider} onClose={() => setOpen(false)} />}
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          padding: '12px 24px', borderRadius: 10, border: 'none', cursor: 'pointer',
          background: color, color: '#000', fontSize: 13, fontWeight: 700,
          fontFamily: f.h, flexShrink: 0, alignSelf: 'flex-start',
          boxShadow: `0 0 24px ${color}30`,
        }}>
        Request Information
      </button>
      {open && <LeadModal provider={provider} onClose={() => setOpen(false)} />}
    </>
  );
}
