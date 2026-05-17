'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { C, f, QUIZ_QUESTIONS } from '../../lib/constants';
import { Shield, Badge } from '../../lib/ui';

export default function AssessPage() {
  const [step, setStep] = useState(0); // 0=intro, 1-8=questions, 9+=results
  const [answers, setAnswers] = useState({});

  const handleAnswer = (qi, oi) => {
    setAnswers(prev => ({ ...prev, [qi]: oi }));
    setTimeout(() => setStep(s => Math.min(s + 1, QUIZ_QUESTIONS.length + 1)), 250);
  };

  const score = useMemo(() => {
    let total = 0;
    Object.entries(answers).forEach(([qi, oi]) => {
      total += QUIZ_QUESTIONS[parseInt(qi)].opts[oi].w;
    });
    return Math.round((total / (QUIZ_QUESTIONS.length * 3)) * 110);
  }, [answers]);

  const grade = score >= 88
    ? { g: "Strong", c: C.primary, m: "Your fundamentals look solid. Focus on documentation gaps and prepare for your C3PAO assessment." }
    : score >= 55
    ? { g: "Moderate Gaps", c: C.warn, m: "You have a foundation but significant gaps remain. Plan for 6–9 months of focused remediation with an experienced MSP." }
    : score >= 28
    ? { g: "At Risk", c: C.accent, m: "Major compliance gaps across multiple control families. You need professional help — connect with an RPO or MSP immediately." }
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

                {/* Question nav dots */}
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
                <div style={{ fontFamily: f.h, fontSize: 80, fontWeight: 900, color: grade.c, lineHeight: 1 }}>
                  {score}<span style={{ fontSize: 28, fontWeight: 500, color: C.muted }}>/110</span>
                </div>
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
                <Link href="/directory" style={{
                  padding: "8px 18px", borderRadius: 8, background: C.blue + "14",
                  border: `1px solid ${C.blue}30`, color: C.blue, fontSize: 12,
                  fontWeight: 600, fontFamily: f.h, textDecoration: "none", display: "inline-block",
                }}>Find a CMMC Partner →</Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
