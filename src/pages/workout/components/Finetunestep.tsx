'use client';
import  { useState } from 'react';
import MuscleBodySelector, { WEAK_MUSCLES, WEAK_TO_REGION } from './Musclebodyselector';

// ─── Design tokens (same as your app) ────────────────────────────────────────
const T = {
  card: '#161616', card2: '#1E1E1E', card3: '#242424',
  ink: '#FFFFFF', muted: '#555', muted2: '#888',
  border: '#2A2A2A', lime: '#C8F135', warn: '#FF6B6B',
} as const;

// ─── Data ─────────────────────────────────────────────────────────────────────
export const RECOVERY_OPTS = [
  { value: 'fresh',      label: 'Fresh',      sub: 'Ready to crush it' },
  { value: 'normal',     label: 'Normal',     sub: 'Feeling good'      },
  { value: 'tired',      label: 'Tired',      sub: 'Low energy'        },
  { value: 'very_tired', label: 'Very Tired', sub: 'Light session'     },
] as const;

export const INTENSITY_OPTS = [
  { value: 'pump',      label: 'Pump',      sub: 'High reps, short rest' },
  { value: 'strength',  label: 'Strength',  sub: 'Heavy, low reps'       },
  { value: 'circuit',   label: 'Circuit',   sub: 'Minimal rest'          },
  { value: 'balanced',  label: 'Balanced',  sub: 'Mix of both'           },
  { value: 'explosive', label: 'Explosive', sub: 'Power & speed'         },
] as const;

// ─── Props ────────────────────────────────────────────────────────────────────
export interface FineTuneStepProps {
  // Values
  weak_muscles:    string[];
  recovery_level:  string;
  intensity_style: string;
  custom_note:     string;
  // Handlers
  onToggleMuscle: (value: string) => void;
  onSetRecovery:  (value: string) => void;
  onSetIntensity: (value: string) => void;
  onSetNote:      (value: string) => void;
}

// ─── Internal sub-components ──────────────────────────────────────────────────
function Label({ text, optional }: { text: string; optional?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
      <span style={{
        fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700,
        letterSpacing: '0.16em', textTransform: 'uppercase', color: T.muted2,
      }}>
        {text}
      </span>
      {optional && (
        <span style={{
          fontFamily: "'Space Mono', monospace", fontSize: 9, color: T.muted,
          background: T.card3, padding: '2px 6px', borderRadius: 4, letterSpacing: '0.08em',
        }}>
          optional
        </span>
      )}
    </div>
  );
}

function Pill({ label, sub, selected, onClick, warn = false }: {
  label: string; sub?: string; selected: boolean; onClick: () => void; warn?: boolean;
}) {
  const ac = warn ? T.warn : T.lime;
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex', flexDirection: sub ? 'column' : 'row',
        alignItems: sub ? 'flex-start' : 'center',
        padding: sub ? '9px 13px' : '9px 14px',
        background: selected ? (warn ? 'rgba(255,107,107,0.12)' : 'rgba(200,241,53,0.1)') : T.card2,
        border: `1.5px solid ${selected ? ac : T.border}`,
        borderRadius: 10, cursor: 'pointer', gap: sub ? 2 : 0,
        boxShadow: selected ? `0 0 10px ${warn ? 'rgba(255,107,107,0.12)' : 'rgba(200,241,53,0.1)'}` : 'none',
        transition: 'all 0.15s ease', WebkitTapHighlightColor: 'transparent' as any,
      }}
    >
      <span style={{
        fontSize: 13, fontWeight: 700, color: selected ? ac : T.ink,
        fontFamily: "'DM Sans', sans-serif", lineHeight: 1.2, letterSpacing: '0.02em',
      }}>
        {label}
      </span>
      {sub && (
        <span style={{
          fontSize: 10,
          color: selected ? (warn ? 'rgba(255,107,107,0.7)' : 'rgba(200,241,53,0.6)') : T.muted2,
          fontFamily: "'Space Mono', monospace", letterSpacing: '0.04em',
        }}>
          {sub}
        </span>
      )}
    </button>
  );
}

function PillGroup({ options, selected, onSelect }: {
  options: readonly { value: string; label: string; sub?: string }[];
  selected: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 22 }}>
      {options.map(o => (
        <Pill key={o.value} label={o.label} sub={o.sub} selected={selected === o.value} onClick={() => onSelect(o.value)} />
      ))}
    </div>
  );
}

function InfoBanner({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div style={{
      display: 'flex', gap: 12, padding: '14px 16px',
      background: 'rgba(200,241,53,0.03)',
      border: '1px solid rgba(200,241,53,0.12)',
      borderLeft: '2px solid rgba(200,241,53,0.35)',
      borderRadius: 12, marginBottom: 16,
    }}>
      <span style={{ fontSize: 17, flexShrink: 0 }}>{icon}</span>
      <div>
        <div style={{
          fontSize: 11, fontWeight: 800, color: T.lime, marginBottom: 4,
          fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          {title}
        </div>
        <div style={{ fontSize: 12, color: T.muted2, lineHeight: 1.65, fontFamily: "'DM Sans', sans-serif" }}>
          {body}
        </div>
      </div>
    </div>
  );
}

// ─── FineTuneStep (exported default) ─────────────────────────────────────────
export default function FineTuneStep({
  weak_muscles, recovery_level, intensity_style, custom_note,
  onToggleMuscle, onSetRecovery, onSetIntensity, onSetNote,
}: FineTuneStepProps) {
  const [viewMode, setViewMode] = useState<'body' | 'list'>('body');
  const [noteFocused, setNoteFocused] = useState(false);
  const count = weak_muscles.length;

  return (
    <div>

      {/* ── Lagging muscles banner ── */}
      <InfoBanner
        icon="◈"
        title="Lagging Muscles"
        body="Tap a muscle on the body or use the list — AI adds targeted extra volume for selected areas."
      />

      {/* ── Header row with count + mode toggle ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700,
            letterSpacing: '0.16em', textTransform: 'uppercase', color: T.muted2,
          }}>
            Weak Muscles
          </span>
          <span style={{
            fontFamily: "'Space Mono', monospace", fontSize: 9, color: T.muted,
            background: T.card3, padding: '2px 6px', borderRadius: 4,
          }}>
            optional
          </span>
          {count > 0 && (
            <span style={{
              fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700,
              background: T.lime, color: '#000', padding: '2px 8px',
              borderRadius: 100, letterSpacing: '0.08em',
            }}>
              {count}
            </span>
          )}
        </div>

        {/* Mode toggle */}
        <div style={{
          display: 'flex', gap: 2, background: T.card2,
          border: `1px solid ${T.border}`, borderRadius: 10, padding: 3,
        }}>
          {(['body', 'list'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                padding: '5px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                background: viewMode === mode ? T.lime : 'transparent',
                color:      viewMode === mode ? '#000'  : T.muted2,
                transition: 'all 0.15s',
                WebkitTapHighlightColor: 'transparent' as any,
              }}
            >
              {mode === 'body' ? '⬡ Body' : '≡ List'}
            </button>
          ))}
        </div>
      </div>

      {/* ══ BODY MODE ══ */}
      {viewMode === 'body' && (
        <div style={{
          background: T.card, border: `1px solid ${T.border}`, borderRadius: 16,
          padding: '18px 16px', marginBottom: 22,
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start',
        }}>
          {/* SVG body */}
          <MuscleBodySelector selected={weak_muscles} onToggle={onToggleMuscle} />

          {/* Selected panel */}
          <div>
            <div style={{
              fontFamily: "'Space Mono', monospace", fontSize: 9, color: T.muted2,
              letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12,
            }}>
              Selected
            </div>

            {count === 0 ? (
              <div style={{
                padding: '18px 10px', textAlign: 'center',
                border: `1px dashed ${T.border}`, borderRadius: 10,
              }}>
                <div style={{ fontSize: 22, marginBottom: 8, opacity: 0.25 }}>◈</div>
                <div style={{
                  fontFamily: "'Space Mono', monospace", fontSize: 9,
                  color: T.muted, letterSpacing: '0.1em',
                }}>
                  None selected
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {weak_muscles.map(v => {
                  const meta = WEAK_MUSCLES.find(m => m.value === v);
                  return (
                    <div key={v} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '7px 10px', background: 'rgba(200,241,53,0.07)',
                      border: '1px solid rgba(200,241,53,0.25)', borderRadius: 8,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: T.lime, flexShrink: 0 }} />
                        <span style={{
                          fontFamily: "'DM Sans', sans-serif", fontSize: 12,
                          fontWeight: 600, color: T.lime,
                        }}>
                          {meta?.label ?? v}
                        </span>
                      </div>
                      <button
                        onClick={() => onToggleMuscle(v)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: T.muted, fontSize: 15, lineHeight: 1, padding: '0 2px',
                          transition: 'color 0.15s',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = T.warn; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = T.muted; }}
                      >
                        ×
                      </button>
                    </div>
                  );
                })}

                {/* Clear all */}
                <button
                  onClick={() => [...weak_muscles].forEach(v => onToggleMuscle(v))}
                  style={{
                    marginTop: 2, background: 'none', border: `1px solid ${T.border}`,
                    borderRadius: 8, padding: '6px 10px', cursor: 'pointer',
                    fontFamily: "'Space Mono', monospace", fontSize: 9, color: T.muted,
                    letterSpacing: '0.1em', textTransform: 'uppercase', transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = T.warn;
                    (e.currentTarget as HTMLButtonElement).style.color = T.warn;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = T.border;
                    (e.currentTarget as HTMLButtonElement).style.color = T.muted;
                  }}
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══ LIST MODE ══ */}
      {viewMode === 'list' && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 22 }}>
          {WEAK_MUSCLES.map(o => (
            <Pill
              key={o.value}
              label={o.label}
              selected={weak_muscles.includes(o.value)}
              onClick={() => onToggleMuscle(o.value)}
            />
          ))}
        </div>
      )}

      {/* ── Energy today ── */}
      <InfoBanner icon="◉" title="Energy Today" body="Adjusts total volume, sets, and rest periods to match how you're feeling." />
      <Label text="Current energy level" optional />
      <PillGroup options={RECOVERY_OPTS} selected={recovery_level} onSelect={onSetRecovery} />

      {/* ── Training style ── */}
      <Label text="Training Style" optional />
      <PillGroup options={INTENSITY_OPTS} selected={intensity_style} onSelect={onSetIntensity} />

      {/* ── Custom note ── */}
      <InfoBanner icon="◎" title="Custom Instructions" body='Anything specific — "superset everything", "avoid machines", "add a finisher"' />
      <Label text="Tell the AI anything" optional />
      <textarea
        rows={3}
        value={custom_note}
        onChange={e => onSetNote(e.target.value)}
        placeholder='"Focus on mind-muscle connection, no machines today…"'
        onFocus={() => setNoteFocused(true)}
        onBlur={() => setNoteFocused(false)}
        style={{
          width: '100%', padding: '14px 16px',
          background: T.card2,
          border: `1.5px solid ${noteFocused ? T.lime : T.border}`,
          borderRadius: 12, fontSize: 13, color: T.ink, resize: 'none',
          fontFamily: "'DM Sans', sans-serif", lineHeight: 1.65, marginBottom: 20,
          transition: 'border-color 0.18s', outline: 'none',
          boxShadow: noteFocused ? '0 0 0 3px rgba(200,241,53,0.06)' : 'none',
          caretColor: T.lime,
        }}
      />
    </div>
  );
}