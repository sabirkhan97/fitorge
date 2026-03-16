'use client';
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import type { GenerateWorkoutBody } from '../types/workout';

const T = {
  bg: '#0E0E0E', card: '#161616', card2: '#1E1E1E', card3: '#242424',
  ink: '#FFFFFF', muted: '#555', muted2: '#888', border: '#2A2A2A',
  lime: '#C8F135', warn: '#FF6B6B',
} as const;

const GENDERS = [
  { value: 'Male',   label: 'Male',   icon: '♂' },
  { value: 'Female', label: 'Female', icon: '♀' },
  { value: 'Other',  label: 'Other',  icon: '⊕' },
];
const DURATIONS     = ['20','30','45','60','75','90'];
const DAYS_PER_WEEK = ['2','3','4','5','6','7'];
const EQUIPMENT_OPTS = ['Dumbbells','Barbell','Resistance Bands','Pull-up Bar','Kettlebell','Jump Rope','Bench','Bodyweight Only'];
const INJURY_PRESETS = ['None','Lower Back','Knee','Shoulder','Wrist','Hip','Ankle'];
const GOALS = [
  { value: 'muscle_gain', label: 'Muscle Gain', icon: '◈' },
  { value: 'fat_loss',    label: 'Fat Loss',    icon: '◎' },
  { value: 'strength',    label: 'Strength',    icon: '◆' },
  { value: 'endurance',   label: 'Endurance',   icon: '◉' },
  { value: 'recomp',      label: 'Recomp',      icon: '◐' },
  { value: 'flexibility', label: 'Flexibility', icon: '◑' },
];
const EXPERIENCE = [
  { value: 'beginner',     label: 'Beginner',     sub: '< 6 months'  },
  { value: 'intermediate', label: 'Intermediate', sub: '6 mo – 2 yr' },
  { value: 'advanced',     label: 'Advanced',     sub: '2+ years'    },
];
const FOCUS_OPTS = [
  { value: 'full_body',  label: 'Full Body'  }, { value: 'upper_body', label: 'Upper Body' },
  { value: 'lower_body', label: 'Lower Body' }, { value: 'push',       label: 'Push'       },
  { value: 'pull',       label: 'Pull'       }, { value: 'legs',       label: 'Legs'       },
  { value: 'chest',      label: 'Chest'      }, { value: 'back',       label: 'Back'       },
  { value: 'shoulders',  label: 'Shoulders'  }, { value: 'arms',       label: 'Arms'       },
  { value: 'core',       label: 'Core'       }, { value: 'glutes',     label: 'Glutes'     },
];
const CARDIO_OPTS = [
  { value: 'none',   label: 'None',    sub: 'Skip it'   },
  { value: 'light',  label: 'Light',   sub: 'Easy pace' },
  { value: 'medium', label: 'Medium',  sub: 'Moderate'  },
  { value: 'heavy',  label: 'Intense', sub: 'All out'   },
];
const LOCATIONS = [
  { value: 'gym',  label: 'Gym',      sub: 'Full equipment' },
  { value: 'home', label: 'Home',     sub: 'Limited gear'   },
  { value: 'park', label: 'Outdoors', sub: 'Bodyweight'     },
];
const WEAK_MUSCLES = [
  { value: 'lower_chest',       label: 'Lower Chest'     }, { value: 'upper_chest',  label: 'Upper Chest'  },
  { value: 'inner_chest',       label: 'Inner Chest'     }, { value: 'rear_delts',   label: 'Rear Delts'   },
  { value: 'side_delts',        label: 'Side Delts'      }, { value: 'rounded_shoulders', label: 'Round Shoulders' },
  { value: 'upper_back',        label: 'Upper Back'      }, { value: 'lats',         label: 'Lats Width'   },
  { value: 'hamstrings',        label: 'Hamstrings'      }, { value: 'glutes',       label: 'Glutes'       },
  { value: 'calves',            label: 'Calves'          }, { value: 'bicep_peak',   label: 'Bicep Peak'   },
  { value: 'tricep_mass',       label: 'Tricep Mass'     }, { value: 'lower_abs',    label: 'Lower Abs'    },
  { value: 'forearms',          label: 'Forearms'        },
];
const INTENSITY_OPTS = [
  { value: 'pump',      label: 'Pump',      sub: 'High reps, short rest' },
  { value: 'strength',  label: 'Strength',  sub: 'Heavy, low reps'       },
  { value: 'circuit',   label: 'Circuit',   sub: 'Minimal rest'          },
  { value: 'balanced',  label: 'Balanced',  sub: 'Mix of both'           },
  { value: 'explosive', label: 'Explosive', sub: 'Power & speed'         },
];
const RECOVERY_OPTS = [
  { value: 'fresh',      label: 'Fresh',      sub: 'Ready to crush it' },
  { value: 'normal',     label: 'Normal',     sub: 'Feeling good'      },
  { value: 'tired',      label: 'Tired',      sub: 'Low energy'        },
  { value: 'very_tired', label: 'Very Tired', sub: 'Light session'     },
];
const STEPS = [
  { id: 'body',     title: 'Your Body',       sub: 'Physical stats & schedule',   index: '01' },
  { id: 'goals',    title: 'Your Goals',      sub: "What you're working towards",  index: '02' },
  { id: 'session',  title: "Today's Session", sub: 'Shape this workout',           index: '03' },
  { id: 'finetune', title: 'Fine-Tune',        sub: 'Weak points & energy',         index: '04' },
  { id: 'prefs',    title: 'Preferences',      sub: 'Location & limitations',       index: '05' },
];

interface FormData {
  age: string; gender: string; height: string; weight: string;
  goal: string; experience: string; duration: string; focus: string;
  injuries: string; cardio: string; location: string;
  equipment: string[]; weak_muscles: string[];
  intensity_style: string; recovery_level: string;
  days_per_week: string; custom_note: string;
}

// ── Shared CSS ────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&family=Space+Mono:wght@400;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0E0E0E; }
  input, textarea { caret-color: #C8F135; }
  input::placeholder, textarea::placeholder { color: #555; }
  input:focus, textarea:focus { outline: none; }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: #161616; }
  ::-webkit-scrollbar-thumb { background: #2A2A2A; border-radius: 2px; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(20px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .step-anim { animation: slideIn 0.3s cubic-bezier(0.25,0.46,0.45,0.94); }
  .pill-btn  { transition: all 0.15s ease; }
  .pill-btn:hover  { transform: translateY(-1px); }
  .pill-btn:active { transform: scale(0.97); }

  /* ── Shell ── */
  .wo-shell {
    min-height: 100svh;
    display: grid;
    grid-template-columns: 1fr;
  }
  @media (min-width: 900px) {
    .wo-shell { grid-template-columns: 300px 1fr; }
  }

  /* ── Sidebar ── */
  .wo-sidebar {
    display: none;
  }
  @media (min-width: 900px) {
    .wo-sidebar {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 40px 32px;
      border-right: 1px solid #242424;
      position: sticky;
      top: 0;
      height: 100svh;
      overflow: hidden;
    }
  }

  /* ── Mobile top bar ── */
  .wo-topbar {
    position: sticky; top: 0; z-index: 50;
    background: rgba(14,14,14,0.93);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid #242424;
    padding: 0 20px;
  }
  @media (min-width: 900px) { .wo-topbar { display: none; } }

  /* ── Main scroll area ── */
  .wo-main {
    display: flex;
    flex-direction: column;
    min-height: 100svh;
    overflow: hidden;
  }
  @media (min-width: 900px) {
    .wo-main { min-height: 100svh; }
  }

  .wo-scroll {
    flex: 1;
    overflow-y: auto;
    padding: 28px 20px 12px;
  }
  @media (min-width: 640px)  { .wo-scroll { padding: 32px 32px 12px; } }
  @media (min-width: 900px)  { .wo-scroll { padding: 44px 48px 12px; } }
  @media (min-width: 1200px) { .wo-scroll { padding: 52px 72px 12px; } }

  /* ── Desktop step header (shown on desktop, hidden on mobile) ── */
  .wo-desk-header { display: none; }
  @media (min-width: 900px) { .wo-desk-header { display: block; margin-bottom: 36px; } }

  /* ── Mobile step header (hidden on desktop) ── */
  .wo-mob-header { display: block; margin-bottom: 28px; }
  @media (min-width: 900px) { .wo-mob-header { display: none; } }

  /* ── CTA footer ── */
  .wo-footer {
    position: sticky; bottom: 0; z-index: 40;
    background: rgba(14,14,14,0.96);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-top: 1px solid #242424;
    padding: 16px 20px 20px;
  }
  @media (min-width: 640px)  { .wo-footer { padding: 16px 32px 20px; } }
  @media (min-width: 900px)  { .wo-footer { padding: 16px 48px 24px; display: none; } }

  /* Desktop CTA in sidebar */
  .wo-sidebar-cta { display: none; }
  @media (min-width: 900px) { .wo-sidebar-cta { display: flex; flex-direction: column; gap: 10px; } }

  /* ── Goal grid ── */
  .goal-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-bottom: 22px;
  }
  @media (min-width: 900px) {
    .goal-grid { grid-template-columns: repeat(3, 1fr); gap: 12px; }
  }
  @media (min-width: 1100px) {
    .goal-grid { grid-template-columns: repeat(6, 1fr); }
  }

  /* ── Focus pills: bigger gap on desktop ── */
  .pill-group { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 22px; }
  @media (min-width: 900px) { .pill-group { gap: 9px; } }

  /* ── Two-col form grids on desktop ── */
  .form-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  @media (min-width: 900px) { .form-2col { gap: 16px; } }

  /* ── 3-col grids (gender, location) ── */
  .form-3col { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin-bottom: 20px; }

  /* experience row */
  .exp-row { display: flex; gap: 10px; margin-bottom: 22px; }
  @media (min-width: 900px) { .exp-row { gap: 14px; } }

  /* Touch feedback */
  @media (hover: none) {
    .pill-btn:active { transform: scale(0.97) !important; }
  }
`;

// ── Primitive components ───────────────────────────────────────────────────────
function Label({ text, optional }: { text: string; optional?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.muted2 }}>
        {text}
      </span>
      {optional && (
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: T.muted, background: T.card3, padding: '2px 6px', borderRadius: 4, letterSpacing: '0.08em' }}>
          optional
        </span>
      )}
    </div>
  );
}

function TextInput({ placeholder, value, onChange, suffix }: {
  placeholder: string; value: string; onChange: (v: string) => void; suffix?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: 'relative', marginBottom: 16 }}>
      <input
        value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: '100%', height: 52, padding: suffix ? '0 52px 0 16px' : '0 16px',
          background: T.card2, border: `1.5px solid ${focused ? T.lime : T.border}`,
          borderRadius: 12, fontSize: 15, fontWeight: 500, color: T.ink,
          fontFamily: "'DM Sans', sans-serif", transition: 'border-color 0.18s',
          boxShadow: focused ? '0 0 0 3px rgba(200,241,53,0.07)' : 'none',
        }}
      />
      {suffix && (
        <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 11, fontWeight: 700, color: T.muted2, fontFamily: "'Space Mono', monospace", letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {suffix}
        </span>
      )}
    </div>
  );
}

function Pill({ label, sub, selected, onClick, warn = false }: {
  label: string; sub?: string; selected: boolean; onClick: () => void; warn?: boolean;
}) {
  const activeColor = warn ? T.warn : T.lime;
  return (
    <button
      className="pill-btn"
      onClick={onClick}
      style={{
        display: 'inline-flex', flexDirection: sub ? 'column' : 'row',
        alignItems: sub ? 'flex-start' : 'center',
        padding: sub ? '9px 13px' : '9px 14px',
        background: selected ? (warn ? 'rgba(255,107,107,0.12)' : 'rgba(200,241,53,0.1)') : T.card2,
        border: `1.5px solid ${selected ? activeColor : T.border}`,
        borderRadius: 10, cursor: 'pointer', gap: sub ? 2 : 0,
        boxShadow: selected ? `0 0 10px ${warn ? 'rgba(255,107,107,0.12)' : 'rgba(200,241,53,0.1)'}` : 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 700, color: selected ? activeColor : T.ink, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.2, letterSpacing: '0.02em' }}>
        {label}
      </span>
      {sub && (
        <span style={{ fontSize: 10, color: selected ? (warn ? 'rgba(255,107,107,0.7)' : 'rgba(200,241,53,0.6)') : T.muted2, fontFamily: "'Space Mono', monospace", letterSpacing: '0.04em' }}>
          {sub}
        </span>
      )}
    </button>
  );
}

function PillGroup({ options, selected, onSelect, multi = false, warn = false }: {
  options: { value: string; label: string; sub?: string }[];
  selected: string | string[]; onSelect: (v: string) => void;
  multi?: boolean; warn?: boolean;
}) {
  const isSel = (v: string) => multi ? (selected as string[]).includes(v) : selected === v;
  return (
    <div className="pill-group">
      {options.map(o => (
        <Pill key={o.value} label={o.label} sub={o.sub} selected={isSel(o.value)} onClick={() => onSelect(o.value)} warn={warn} />
      ))}
    </div>
  );
}

function GoalCard({ label, icon, selected, onClick }: {
  value: string; label: string; icon: string; selected: boolean; onClick: () => void;
}) {
  return (
    <button
      className="pill-btn"
      onClick={onClick}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 10, padding: '18px 8px',
        background: selected ? 'rgba(200,241,53,0.08)' : T.card2,
        border: `1.5px solid ${selected ? T.lime : T.border}`, borderRadius: 14, cursor: 'pointer',
        boxShadow: selected ? '0 0 18px rgba(200,241,53,0.1)' : 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <span style={{ fontSize: 22, color: selected ? T.lime : T.muted2 }}>{icon}</span>
      <span style={{ fontSize: 11, fontWeight: 800, color: selected ? T.lime : T.ink, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif" }}>
        {label}
      </span>
    </button>
  );
}

function ExperienceCard({ value, label, sub, selected, onClick }: {
  value: string; label: string; sub: string; selected: boolean; onClick: () => void;
}) {
  const rank = ({ beginner: 1, intermediate: 2, advanced: 3 } as Record<string, number>)[value] ?? 0;
  return (
    <button
      className="pill-btn"
      onClick={onClick}
      style={{
        flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 10,
        padding: '14px 14px 16px', textAlign: 'left',
        background: selected ? 'rgba(200,241,53,0.07)' : T.card2,
        border: `1.5px solid ${selected ? T.lime : T.border}`, borderRadius: 14, cursor: 'pointer',
        boxShadow: selected ? '0 0 14px rgba(200,241,53,0.09)' : 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <div style={{ display: 'flex', gap: 4 }}>
        {[1,2,3].map(i => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= rank ? (selected ? T.lime : '#3A3A3A') : T.card3, transition: 'background 0.2s' }} />
        ))}
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color: selected ? T.lime : T.ink, fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
      <span style={{ fontSize: 10, color: T.muted2, fontFamily: "'Space Mono', monospace", letterSpacing: '0.06em' }}>{sub}</span>
    </button>
  );
}

function InfoBanner({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '14px 16px', background: 'rgba(200,241,53,0.03)', border: '1px solid rgba(200,241,53,0.12)', borderLeft: '2px solid rgba(200,241,53,0.35)', borderRadius: 12, marginBottom: 16 }}>
      <span style={{ fontSize: 17, flexShrink: 0 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 11, fontWeight: 800, color: T.lime, marginBottom: 4, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.06em', textTransform: 'uppercase' }}>{title}</div>
        <div style={{ fontSize: 12, color: T.muted2, lineHeight: 1.65, fontFamily: "'DM Sans', sans-serif" }}>{body}</div>
      </div>
    </div>
  );
}

function StyledTextarea({ placeholder, value, onChange }: {
  placeholder: string; value: string; onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      rows={3} value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{
        width: '100%', padding: '14px 16px',
        background: T.card2, border: `1.5px solid ${focused ? T.lime : T.border}`,
        borderRadius: 12, fontSize: 13, color: T.ink, resize: 'none',
        fontFamily: "'DM Sans', sans-serif", lineHeight: 1.65, marginBottom: 20,
        transition: 'border-color 0.18s',
        boxShadow: focused ? '0 0 0 3px rgba(200,241,53,0.06)' : 'none',
      }}
    />
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function Workout() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormData>({
    age: '', gender: '', height: '', weight: '',
    goal: '', experience: '', duration: '45', focus: '',
    injuries: '', cardio: 'none', location: 'gym',
    equipment: [], weak_muscles: [],
    intensity_style: 'balanced', recovery_level: 'normal',
    days_per_week: '4', custom_note: '',
  });

  const set = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm(prev => ({ ...prev, [key]: value })), []);

  const toggleArr = useCallback((key: 'equipment' | 'weak_muscles', value: string) =>
    setForm(prev => {
      const arr = prev[key] as string[];
      return { ...prev, [key]: arr.includes(value) ? arr.filter(x => x !== value) : [...arr, value] };
    }), []);

  const canProceed = useCallback(() => {
    if (step === 0) return !!(form.age && form.gender && form.height && form.weight);
    if (step === 1) return !!(form.goal && form.experience);
    if (step === 2) return !!(form.focus && form.duration);
    return true;
  }, [step, form]);

  const handleGenerate = useCallback(async () => {
    setLoading(true);
    try {
      const body: GenerateWorkoutBody = {
        age: Number(form.age), gender: form.gender.toLowerCase(),
        height: Number(form.height), weight: Number(form.weight),
        goal: form.goal, experience: form.experience,
        workout_duration: Number(form.duration), focus: form.focus,
        injuries: form.injuries && form.injuries !== 'None' ? [form.injuries] : [],
        cardio: form.cardio, location: form.location,
        equipment: form.location === 'home' ? form.equipment : ['full_gym'],
        weak_muscles: form.weak_muscles, intensity_style: form.intensity_style,
        recovery_level: form.recovery_level, days_per_week: Number(form.days_per_week),
        custom_note: form.custom_note || undefined,
      };
      const data = await api.generateWorkout(body);
      navigate('/result', { state: { workout: data } });
    } catch (err) {
      console.error(err);
      alert('Failed to generate workout. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  }, [form, navigate]);

  const renderStep = () => {
    switch (step) {
      case 0: return (
        <div>
          <Label text="Gender" />
          <div className="form-3col">
            {GENDERS.map(g => (
              <button key={g.value} className="pill-btn" onClick={() => set('gender', g.value)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '18px 8px',
                  background: form.gender === g.value ? 'rgba(200,241,53,0.08)' : T.card2,
                  border: `1.5px solid ${form.gender === g.value ? T.lime : T.border}`, borderRadius: 14, cursor: 'pointer',
                  boxShadow: form.gender === g.value ? '0 0 14px rgba(200,241,53,0.1)' : 'none',
                  WebkitTapHighlightColor: 'transparent',
                }}>
                <span style={{ fontSize: 24, color: form.gender === g.value ? T.lime : T.muted2 }}>{g.icon}</span>
                <span style={{ fontSize: 11, fontWeight: 800, color: form.gender === g.value ? T.lime : T.ink, letterSpacing: '0.07em', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif" }}>{g.label}</span>
              </button>
            ))}
          </div>
          <Label text="Age" />
          <TextInput placeholder="e.g. 25" value={form.age} onChange={v => set('age', v)} suffix="YRS" />
          <div className="form-2col">
            <div><Label text="Height" /><TextInput placeholder="170" value={form.height} onChange={v => set('height', v)} suffix="CM" /></div>
            <div><Label text="Weight" /><TextInput placeholder="70" value={form.weight} onChange={v => set('weight', v)} suffix="KG" /></div>
          </div>
          <Label text="Training days / week" optional />
          <div className="pill-group">
            {DAYS_PER_WEEK.map(d => (
              <Pill key={d} label={`${d}×`} selected={form.days_per_week === d} onClick={() => set('days_per_week', d)} />
            ))}
          </div>
        </div>
      );

      case 1: return (
        <div>
          <Label text="Primary Goal" />
          <div className="goal-grid">
            {GOALS.map(g => <GoalCard key={g.value} {...g} selected={form.goal === g.value} onClick={() => set('goal', g.value)} />)}
          </div>
          <Label text="Experience Level" />
          <div className="exp-row">
            {EXPERIENCE.map(e => <ExperienceCard key={e.value} {...e} selected={form.experience === e.value} onClick={() => set('experience', e.value)} />)}
          </div>
          <Label text="Training Style" optional />
          <PillGroup options={INTENSITY_OPTS} selected={form.intensity_style} onSelect={v => set('intensity_style', v)} />
        </div>
      );

      case 2: return (
        <div>
          <Label text="Focus Area" />
          <PillGroup options={FOCUS_OPTS} selected={form.focus} onSelect={v => set('focus', v)} />
          <Label text="Session Duration" />
          <div className="pill-group">
            {DURATIONS.map(d => <Pill key={d} label={d} sub="min" selected={form.duration === d} onClick={() => set('duration', d)} />)}
          </div>
          <Label text="Cardio" optional />
          <PillGroup options={CARDIO_OPTS} selected={form.cardio} onSelect={v => set('cardio', v)} />
        </div>
      );

      case 3: return (
        <div>
          <InfoBanner icon="◈" title="Lagging Muscles" body="The AI adds targeted extra volume and specific exercises for these areas." />
          <Label text="Select all that apply" optional />
          <PillGroup options={WEAK_MUSCLES} selected={form.weak_muscles} onSelect={v => toggleArr('weak_muscles', v)} multi />
          <InfoBanner icon="◉" title="Energy Today" body="Adjusts total volume, sets, and rest periods to match how you're feeling." />
          <Label text="Current energy level" optional />
          <PillGroup options={RECOVERY_OPTS} selected={form.recovery_level} onSelect={v => set('recovery_level', v)} />
          <InfoBanner icon="◎" title="Custom Instructions" body='Anything specific — "superset everything", "avoid machines", "add a finisher"' />
          <Label text="Tell the AI anything" optional />
          <StyledTextarea placeholder='"Focus on mind-muscle connection, no machines today…"' value={form.custom_note} onChange={v => set('custom_note', v)} />
        </div>
      );

      case 4: return (
        <div>
          <Label text="Training Location" />
          <div className="form-3col">
            {LOCATIONS.map(loc => (
              <button key={loc.value} className="pill-btn" onClick={() => set('location', loc.value)}
                style={{
                  display: 'flex', flexDirection: 'column', gap: 6, padding: '16px 12px', textAlign: 'left',
                  background: form.location === loc.value ? 'rgba(200,241,53,0.07)' : T.card2,
                  border: `1.5px solid ${form.location === loc.value ? T.lime : T.border}`, borderRadius: 14, cursor: 'pointer',
                  boxShadow: form.location === loc.value ? '0 0 14px rgba(200,241,53,0.09)' : 'none',
                  WebkitTapHighlightColor: 'transparent',
                }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: form.location === loc.value ? T.lime : T.ink, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.05em', textTransform: 'uppercase' }}>{loc.label}</span>
                <span style={{ fontSize: 10, color: T.muted2, fontFamily: "'Space Mono', monospace" }}>{loc.sub}</span>
              </button>
            ))}
          </div>
          {form.location === 'home' && (
            <>
              <Label text="Available Equipment" optional />
              <div className="pill-group">
                {EQUIPMENT_OPTS.map(e => <Pill key={e} label={e} selected={form.equipment.includes(e)} onClick={() => toggleArr('equipment', e)} />)}
              </div>
            </>
          )}
          <Label text="Injuries / Limitations" optional />
          <PillGroup options={INJURY_PRESETS.map(i => ({ value: i, label: i }))} selected={form.injuries} onSelect={v => set('injuries', v)} warn />
        </div>
      );

      default: return null;
    }
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  // ── Shared CTA buttons ────────────────────────────────────────────────────
  const CTAContinue = (
    <button
      className="pill-btn"
      onClick={() => setStep(s => s + 1)}
      disabled={!canProceed()}
      style={{
        width: '100%', height: 54,
        background: canProceed() ? 'rgba(200,241,53,0.09)' : T.card2,
        border: `1.5px solid ${canProceed() ? 'rgba(200,241,53,0.45)' : T.border}`,
        borderRadius: 14, color: canProceed() ? T.lime : T.muted,
        fontSize: 13, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase',
        cursor: canProceed() ? 'pointer' : 'not-allowed',
        fontFamily: "'DM Sans', sans-serif",
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        transition: 'all 0.2s ease', WebkitTapHighlightColor: 'transparent',
      }}
    >
      Continue <span style={{ fontSize: 16 }}>→</span>
    </button>
  );

  const CTAGenerate = (
    <button
      className="pill-btn"
      onClick={handleGenerate}
      disabled={loading}
      style={{
        width: '100%', height: 58,
        background: loading ? T.card2 : T.lime,
        border: 'none', borderRadius: 14,
        color: loading ? T.muted : '#000',
        fontSize: 14, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase',
        cursor: loading ? 'not-allowed' : 'pointer',
        fontFamily: "'DM Sans', sans-serif",
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        transition: 'all 0.2s ease',
        boxShadow: loading ? 'none' : '0 6px 28px rgba(200,241,53,0.22)',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {loading ? (
        <>
          <div style={{ width: 18, height: 18, border: `2px solid ${T.card3}`, borderTopColor: T.lime, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
          Building your plan…
        </>
      ) : <>⚡ Generate Workout</>}
    </button>
  );

  return (
    <div style={{ minHeight: '100svh', background: T.bg, color: T.ink, fontFamily: "'DM Sans', sans-serif" }}>
      <style>{CSS}</style>

      <div className="wo-shell">

        {/* ══ DESKTOP SIDEBAR ══ */}
        <aside className="wo-sidebar">
          <div>
            {/* Brand */}
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: '0.1em', color: T.lime, marginBottom: 40 }}>
              FORGE
            </div>

            {/* Step index + title */}
            <div key={`sidebar-${step}`} style={{ animation: 'fadeIn 0.3s ease' }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: T.muted2, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 8 }}>
                {STEPS[step].index} — {STEPS[step].sub}
              </div>
              <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3rem,3.5vw,4rem)', lineHeight: 0.88, letterSpacing: '0.02em', color: T.ink, marginBottom: 16, wordBreak: 'break-word' }}>
                {STEPS[step].title}
              </h1>

              {/* Lime rule */}
              <div style={{ width: 36, height: 2, background: T.lime, borderRadius: 1, marginBottom: 28 }} />

              {/* Step progress — vertical */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {STEPS.map((s, i) => (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: i < step ? T.lime : i === step ? 'rgba(200,241,53,0.12)' : T.card2,
                      border: `1.5px solid ${i <= step ? T.lime : T.border}`,
                      transition: 'all 0.3s',
                    }}>
                      {i < step ? (
                        <span style={{ color: '#000', fontSize: 12, fontWeight: 900 }}>✓</span>
                      ) : (
                        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: i === step ? T.lime : T.muted, fontWeight: 700 }}>{s.index}</span>
                      )}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: i === step ? 700 : 500, color: i === step ? T.ink : T.muted2, fontFamily: "'DM Sans', sans-serif", transition: 'color 0.2s' }}>
                        {s.title}
                      </div>
                      {i === step && (
                        <div style={{ fontSize: 10, color: T.muted2, fontFamily: "'Space Mono', monospace", letterSpacing: '0.05em', marginTop: 1 }}>
                          {s.sub}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar CTA (desktop only) */}
          <div className="wo-sidebar-cta">
            {step < STEPS.length - 1 ? CTAContinue : CTAGenerate}
            {step > 0 && (
              <button
                onClick={() => setStep(s => s - 1)}
                style={{
                  width: '100%', height: 44, background: 'transparent',
                  border: `1px solid ${T.border}`, borderRadius: 12,
                  color: T.muted2, fontSize: 12, fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif", cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  transition: 'border-color 0.15s, color 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#444'; (e.currentTarget as HTMLButtonElement).style.color = T.ink; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = T.border; (e.currentTarget as HTMLButtonElement).style.color = T.muted2; }}
              >
                ← Back
              </button>
            )}
          </div>
        </aside>

        {/* ══ MAIN COLUMN ══ */}
        <div className="wo-main">

          {/* ── Mobile top bar ── */}
          <div className="wo-topbar">
            {/* Progress rail */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: T.card3 }}>
              <div style={{ height: '100%', width: `${progress}%`, background: T.lime, transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
              <button
                onClick={() => step > 0 ? setStep(s => s - 1) : navigate('/')}
                style={{ width: 38, height: 38, background: T.card2, border: `1px solid ${T.border}`, borderRadius: 10, cursor: 'pointer', color: T.ink, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', WebkitTapHighlightColor: 'transparent' }}
              >‹</button>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: '0.08em', color: T.lime }}>FORGE</span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: T.muted2, letterSpacing: '0.1em' }}>
                {String(step + 1).padStart(2, '0')}/{STEPS.length}
              </span>
            </div>
          </div>

          {/* ── Scrollable form area ── */}
          <div className="wo-scroll">

            {/* Mobile step header */}
            <div className="wo-mob-header step-anim" key={`mob-h-${step}`}>
              <div style={{ display: 'flex', gap: 5, marginBottom: 16 }}>
                {STEPS.map((_, i) => (
                  <div key={i} style={{ height: 3, borderRadius: 2, width: i === step ? 18 : 6, background: i <= step ? T.lime : T.card3, opacity: i < step ? 0.4 : 1, transition: 'all 0.35s ease' }} />
                ))}
              </div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: T.muted2, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 8 }}>
                {STEPS[step].index} — {STEPS[step].sub}
              </div>
              <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3rem, 9vw, 4.5rem)', lineHeight: 0.9, letterSpacing: '0.02em', color: T.ink }}>
                {STEPS[step].title}
              </h1>
            </div>

            {/* Desktop step header */}
            <div className="wo-desk-header step-anim" key={`desk-h-${step}`}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: T.muted2, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 8 }}>
                // Fill in the details below
              </div>
              <div style={{ width: 32, height: 2, background: T.lime, borderRadius: 1 }} />
            </div>

            {/* Step content */}
            <div className="step-anim" key={`content-${step}`}>
              {renderStep()}
            </div>
          </div>

          {/* ── Mobile sticky footer ── */}
          <div className="wo-footer">
            {step < STEPS.length - 1 ? CTAContinue : CTAGenerate}
          </div>

        </div>
      </div>
    </div>
  );
}