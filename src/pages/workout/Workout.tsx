'use client';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { type GenerateWorkoutBody } from '../../services/api';

// ── Constants ─────────────────────────────────────────────────────────────────
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
  { value: 'lower_chest',       label: 'Lower Chest'     }, { value: 'upper_chest',    label: 'Upper Chest'     },
  { value: 'inner_chest',       label: 'Inner Chest'     }, { value: 'rear_delts',     label: 'Rear Delts'      },
  { value: 'side_delts',        label: 'Side Delts'      }, { value: 'rounded_shoulders', label: 'Round Shoulders' },
  { value: 'upper_back',        label: 'Upper Back'      }, { value: 'lats',           label: 'Lats Width'      },
  { value: 'hamstrings',        label: 'Hamstrings'      }, { value: 'glutes',         label: 'Glutes'          },
  { value: 'calves',            label: 'Calves'          }, { value: 'bicep_peak',     label: 'Bicep Peak'      },
  { value: 'tricep_mass',       label: 'Tricep Mass'     }, { value: 'lower_abs',      label: 'Lower Abs'       },
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

// ── Reduced to 3 steps (Fix: "Reduce to max 3 steps") ────────────────────────
const STEPS = [
  { id: 'body',    title: 'Your Body',   sub: 'Stats & schedule',   index: '01', time: '30 sec' },
  { id: 'goals',   title: 'Your Goals',  sub: 'What drives you',    index: '02', time: '20 sec' },
  { id: 'session', title: 'Fine-Tune',   sub: 'Location & session', index: '03', time: '20 sec' },
];

// ── Validation rules ──────────────────────────────────────────────────────────
const VALIDATION = {
  age:    { min: 10,  max: 80,  label: 'Age must be between 10 and 80'         },
  height: { min: 100, max: 250, label: 'Height must be between 100 and 250 cm' },
  weight: { min: 30,  max: 200, label: 'Weight must be between 30 and 200 kg'  },
};

// ── localStorage key ──────────────────────────────────────────────────────────
const LS_KEY = 'fitforge_form_v1';

interface FormData {
  age: string; gender: string; height: string; weight: string;
  goal: string; experience: string; duration: string; focus: string;
  injuries: string; cardio: string; location: string;
  equipment: string[]; weak_muscles: string[];
  intensity_style: string; recovery_level: string;
  days_per_week: string; custom_note: string;
}

const DEFAULT_FORM: FormData = {
  age: '', gender: '', height: '', weight: '',
  goal: '', experience: '', duration: '45', focus: '',
  injuries: 'None', cardio: 'none', location: 'gym',
  equipment: [], weak_muscles: [],
  intensity_style: 'balanced', recovery_level: 'normal',
  days_per_week: '4', custom_note: '',
};

// ── Validation helpers ────────────────────────────────────────────────────────
function validateNumber(value: string, key: 'age' | 'height' | 'weight'): string | null {
  if (!value) return null;
  const n = Number(value);
  if (isNaN(n)) return `${key.charAt(0).toUpperCase() + key.slice(1)} must be a number`;
  const { min, max, label } = VALIDATION[key];
  if (n < min || n > max) return label;
  return null;
}

// ── Summary bar data ──────────────────────────────────────────────────────────
function getSummaryParts(form: FormData): string[] {
  const parts: string[] = [];
  if (form.goal)         parts.push(GOALS.find(g => g.value === form.goal)?.label ?? '');
  if (form.days_per_week) parts.push(`${form.days_per_week}×/wk`);
  if (form.location)     parts.push(LOCATIONS.find(l => l.value === form.location)?.label ?? '');
  if (form.focus)        parts.push(FOCUS_OPTS.find(f => f.value === form.focus)?.label ?? '');
  return parts.filter(Boolean);
}

// ── Primitive components ──────────────────────────────────────────────────────

function Label({ text, optional, hint }: { text: string; optional?: boolean; hint?: string }) {
  return (
    <div className="flex items-center gap-2 mb-2.5">
      <span className="font-mono text-[10px] font-bold tracking-[0.16em] uppercase text-[#888]">
        {text}
      </span>
      {optional && (
        <span className="font-mono text-[9px] text-[#555] bg-[#242424] px-1.5 py-0.5 rounded tracking-[0.08em]">
          optional
        </span>
      )}
      {hint && (
        <span className="text-[10px] text-[#888] italic font-sans">{hint}</span>
      )}
    </div>
  );
}

function TextInput({
  placeholder, value, onChange, suffix, type = 'text', inputMode, error, helperText,
}: {
  placeholder: string; value: string; onChange: (v: string) => void;
  suffix?: string; type?: string; inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  error?: string | null; helperText?: string;
}) {
  const [focused, setFocused] = useState(false);
  const borderColor = error ? 'border-[#FF6B6B]' : focused ? 'border-[#C8F135]' : 'border-[#2A2A2A]';
  const shadowClass  = error ? 'shadow-[0_0_0_3px_rgba(255,107,107,0.08)]' : focused ? 'shadow-[0_0_0_3px_rgba(200,241,53,0.07)]' : '';

  return (
    <div className="relative mb-4">
      <div className={`relative flex items-center bg-[#1E1E1E] border-[1.5px] rounded-xl transition-all duration-200 ${borderColor} ${shadowClass}`}>
        <input
          type={type}
          inputMode={inputMode}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full h-[52px] bg-transparent px-4 text-[15px] font-medium text-white placeholder-[#555] font-sans focus:outline-none"
          style={{ paddingRight: suffix ? '52px' : undefined, caretColor: '#C8F135' }}
        />
        {suffix && (
          <span className="absolute right-3.5 font-mono text-[10px] font-bold text-[#888] tracking-[0.08em] uppercase pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      {/* Inline validation error */}
      {error && (
        <p className="mt-1.5 text-[11px] text-[#FF6B6B] font-sans font-medium">{error}</p>
      )}
      {/* Helper text */}
      {!error && helperText && (
        <p className="mt-1.5 text-[11px] text-[#555] font-sans">{helperText}</p>
      )}
    </div>
  );
}

function Pill({ label, sub, selected, onClick, warn = false, disabled = false }: {
  label: string; sub?: string; selected: boolean; onClick: () => void; warn?: boolean; disabled?: boolean;
}) {
  const activeColor = warn ? '#FF6B6B' : '#C8F135';
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex transition-all duration-150 active:scale-95
        ${sub ? 'flex-col items-start gap-0.5 py-2 px-3' : 'flex-row items-center py-2 px-3.5'}
        ${selected
          ? warn ? 'bg-[rgba(255,107,107,0.12)] border-[#FF6B6B] shadow-[0_0_10px_rgba(255,107,107,0.12)]'
                 : 'bg-[rgba(200,241,53,0.1)] border-[#C8F135] shadow-[0_0_10px_rgba(200,241,53,0.1)]'
          : 'bg-[#1E1E1E] border-[#2A2A2A] hover:-translate-y-px'
        }
        border-[1.5px] rounded-[10px] cursor-pointer
        ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
      `}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <span className={`text-[13px] font-bold font-sans leading-tight tracking-[0.02em] ${selected ? '' : 'text-white'}`}
            style={{ color: selected ? activeColor : undefined }}>
        {label}
      </span>
      {sub && (
        <span className="font-mono text-[10px] tracking-[0.04em]"
              style={{ color: selected ? (warn ? 'rgba(255,107,107,0.7)' : 'rgba(200,241,53,0.6)') : '#888' }}>
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
    <div className="flex flex-wrap gap-1.5 md:gap-2 mb-5">
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
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center gap-2.5 py-[18px] px-2
        transition-all duration-150 active:scale-95
        ${selected
          ? 'bg-[rgba(200,241,53,0.08)] border-[#C8F135] shadow-[0_0_18px_rgba(200,241,53,0.1)]'
          : 'bg-[#1E1E1E] border-[#2A2A2A] hover:-translate-y-px'
        }
        border-[1.5px] rounded-2xl cursor-pointer
      `}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <span className="text-[22px]" style={{ color: selected ? '#C8F135' : '#888' }}>{icon}</span>
      <span className={`text-[11px] font-extrabold uppercase tracking-[0.06em] font-sans ${selected ? 'text-[#C8F135]' : 'text-white'}`}>
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
      onClick={onClick}
      className={`
        flex-1 min-w-0 flex flex-col gap-2.5 px-3.5 pt-3.5 pb-4 text-left
        transition-all duration-150 active:scale-[0.97]
        ${selected
          ? 'bg-[rgba(200,241,53,0.07)] border-[#C8F135] shadow-[0_0_14px_rgba(200,241,53,0.09)]'
          : 'bg-[#1E1E1E] border-[#2A2A2A] hover:-translate-y-px'
        }
        border-[1.5px] rounded-2xl cursor-pointer
      `}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <div className="flex gap-1">
        {[1,2,3].map(i => (
          <div key={i} className="flex-1 h-[3px] rounded-sm transition-colors duration-200"
               style={{ background: i <= rank ? (selected ? '#C8F135' : '#3A3A3A') : '#242424' }} />
        ))}
      </div>
      <span className={`text-[13px] font-bold font-sans ${selected ? 'text-[#C8F135]' : 'text-white'}`}>{label}</span>
      <span className="font-mono text-[10px] text-[#888] tracking-[0.06em]">{sub}</span>
    </button>
  );
}

function InfoBanner({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div className="flex gap-3 p-3.5 mb-4 rounded-xl bg-[rgba(200,241,53,0.03)] border border-[rgba(200,241,53,0.12)] border-l-2 border-l-[rgba(200,241,53,0.35)]">
      <span className="text-[17px] shrink-0">{icon}</span>
      <div>
        <div className="text-[11px] font-extrabold text-[#C8F135] mb-1 font-sans tracking-[0.06em] uppercase">{title}</div>
        <div className="text-[12px] text-[#888] leading-[1.65] font-sans">{body}</div>
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
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={`
        w-full px-4 py-3.5 bg-[#1E1E1E] border-[1.5px] rounded-xl text-[13px] text-white
        resize-none font-sans leading-[1.65] mb-5 transition-all duration-200 focus:outline-none placeholder-[#555]
        ${focused ? 'border-[#C8F135] shadow-[0_0_0_3px_rgba(200,241,53,0.06)]' : 'border-[#2A2A2A]'}
      `}
      style={{ caretColor: '#C8F135' }}
    />
  );
}

// ── Error UI component (Fix: "Replace alert with UI error") ───────────────────
function ErrorCard({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-[rgba(255,107,107,0.06)] border border-[rgba(255,107,107,0.2)] rounded-2xl mb-6">
      <span className="text-3xl">⚠️</span>
      <div className="text-center">
        <p className="text-[13px] font-bold text-[#FF6B6B] mb-1 font-sans">Generation Failed</p>
        <p className="text-[12px] text-[#888] font-sans">{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="px-6 py-2.5 bg-[rgba(255,107,107,0.12)] border border-[rgba(255,107,107,0.3)] rounded-xl text-[12px] font-bold text-[#FF6B6B] font-sans tracking-[0.08em] uppercase transition-all hover:-translate-y-px active:scale-95"
      >
        Try Again
      </button>
    </div>
  );
}

// ── Summary sticky bar (Fix: "Add sticky summary") ───────────────────────────
function SummaryBar({ form }: { form: FormData }) {
  const parts = useMemo(() => getSummaryParts(form), [form]);
  if (!parts.length) return null;
  return (
    <div className="sticky top-0 z-30 bg-[rgba(14,14,14,0.92)] backdrop-blur border-b border-[#1E1E1E] px-5 py-2 flex items-center gap-2 overflow-x-auto hide-scrollbar">
      {parts.map((p, i) => (
        <span key={i} className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-bold font-sans text-[#C8F135] tracking-wide">{p}</span>
          {i < parts.length - 1 && <span className="text-[#2A2A2A] text-[10px]">•</span>}
        </span>
      ))}
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function Workout() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Fix: "Save form in localStorage"
  const [form, setForm] = useState<FormData>(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      return saved ? { ...DEFAULT_FORM, ...JSON.parse(saved) } : DEFAULT_FORM;
    } catch { return DEFAULT_FORM; }
  });

  // Persist to localStorage on change
  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(form)); } catch {}
  }, [form]);

  const set = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm(prev => ({ ...prev, [key]: value })), []);

  const toggleArr = useCallback((key: 'equipment' | 'weak_muscles', value: string) =>
    setForm(prev => {
      const arr = prev[key] as string[];
      return { ...prev, [key]: arr.includes(value) ? arr.filter(x => x !== value) : [...arr, value] };
    }), []);

  // Fix: "Add validation rules"
  const ageError    = useMemo(() => form.age    ? validateNumber(form.age,    'age')    : null, [form.age]);
  const heightError = useMemo(() => form.height ? validateNumber(form.height, 'height') : null, [form.height]);
  const weightError = useMemo(() => form.weight ? validateNumber(form.weight, 'weight') : null, [form.weight]);

  // Fix: "Show message: Enter age to continue" (block reason)
  const blockReason = useMemo(() => {
    if (step === 0) {
      if (!form.gender)  return 'Select your gender to continue';
      if (!form.age)     return 'Enter your age to continue';
      if (ageError)      return ageError;
      if (!form.height)  return 'Enter your height to continue';
      if (heightError)   return heightError;
      if (!form.weight)  return 'Enter your weight to continue';
      if (weightError)   return weightError;
    }
    if (step === 1) {
      if (!form.goal)       return 'Select your primary goal to continue';
      if (!form.experience) return 'Select your experience level to continue';
    }
    if (step === 2) {
      if (!form.focus)    return 'Select a focus area to continue';
    }
    return null;
  }, [step, form, ageError, heightError, weightError]);

  const canProceed = !blockReason;

  // Fix: "Add API timeout + sanitization"
  const handleGenerate = useCallback(async () => {
    setApiError(null);
    setLoading(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);
    try {
      // Fix: "No input sanitization" — validate before sending
      const age    = parseInt(form.age,    10);
      const height = parseInt(form.height, 10);
      const weight = parseInt(form.weight, 10);
      if (isNaN(age) || isNaN(height) || isNaN(weight)) {
        throw new Error('Please check your body stats — some values are invalid.');
      }

      const body: GenerateWorkoutBody = {
        age, gender: form.gender.toLowerCase(),
        height, weight,
        goal: form.goal, experience: form.experience,
        workout_duration: Number(form.duration), focus: form.focus,
        injuries: form.injuries && form.injuries !== 'None' ? [form.injuries] : [],
        cardio: form.cardio, location: form.location,
        // Fix: Equipment logic — let user always choose, not forced by location
        equipment: form.location === 'home' ? form.equipment : form.location === 'park' ? [] : ['full_gym'],
        weak_muscles: form.weak_muscles, intensity_style: form.intensity_style,
        recovery_level: form.recovery_level, days_per_week: Number(form.days_per_week),
        custom_note: form.custom_note || undefined,
      };
      const data = await api.generateWorkout(body);
      // Fix: Clear saved form on success
      try { localStorage.removeItem(LS_KEY); } catch {}
      navigate('/result', { state: { workout: data } });
    } catch (err: unknown) {
      const msg = err instanceof Error
        ? (err.name === 'AbortError' ? 'Request timed out. Please try again.' : err.message)
        : 'Something went wrong. Please try again.';
      setApiError(msg);
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  }, [form, navigate]);

  const progress = ((step + 1) / STEPS.length) * 100;

  // ── Step content ────────────────────────────────────────────────────────────
  const renderStep = () => {
    switch (step) {
      case 0: return (
        <div>
          <Label text="Gender" hint="We use this to personalize your plan" />
          <div className="grid grid-cols-3 gap-2.5 mb-5">
            {GENDERS.map(g => (
              <button key={g.value} onClick={() => set('gender', g.value)}
                className={`
                  flex flex-col items-center gap-2 py-[18px] px-2
                  border-[1.5px] rounded-2xl cursor-pointer transition-all duration-150 active:scale-[0.97]
                  ${form.gender === g.value
                    ? 'bg-[rgba(200,241,53,0.08)] border-[#C8F135] shadow-[0_0_14px_rgba(200,241,53,0.1)]'
                    : 'bg-[#1E1E1E] border-[#2A2A2A] hover:-translate-y-px'
                  }
                `}
                style={{ WebkitTapHighlightColor: 'transparent' }}>
                <span className="text-2xl" style={{ color: form.gender === g.value ? '#C8F135' : '#888' }}>{g.icon}</span>
                <span className={`text-[11px] font-extrabold uppercase tracking-[0.07em] font-sans ${form.gender === g.value ? 'text-[#C8F135]' : 'text-white'}`}>
                  {g.label}
                </span>
              </button>
            ))}
          </div>

          <Label text="Age" hint="Helps calibrate volume and recovery" />
          <TextInput
            placeholder="e.g. 25" value={form.age}
            onChange={v => set('age', v.replace(/\D/g, ''))}
            suffix="YRS" type="number" inputMode="numeric"
            error={ageError}
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label text="Height" hint="In centimeters" />
              <TextInput
                placeholder="170" value={form.height}
                onChange={v => set('height', v.replace(/\D/g, ''))}
                suffix="CM" type="number" inputMode="numeric"
                error={heightError}
              />
            </div>
            <div>
              <Label text="Weight" hint="In kilograms" />
              <TextInput
                placeholder="70" value={form.weight}
                onChange={v => set('weight', v.replace(/\D/g, ''))}
                suffix="KG" type="number" inputMode="numeric"
                error={weightError}
              />
            </div>
          </div>

          <Label text="Training days / week" optional />
          <div className="flex flex-wrap gap-1.5 mb-5">
            {DAYS_PER_WEEK.map(d => (
              <Pill key={d} label={`${d}×`} selected={form.days_per_week === d} onClick={() => set('days_per_week', d)} />
            ))}
          </div>
        </div>
      );

      case 1: return (
        <div>
          <Label text="Primary Goal" hint="The AI builds your entire plan around this" />
          <div className="grid grid-cols-3 xl:grid-cols-6 gap-2 md:gap-3 mb-5">
            {GOALS.map(g => (
              <GoalCard key={g.value} {...g} selected={form.goal === g.value} onClick={() => set('goal', g.value)} />
            ))}
          </div>

          <Label text="Experience Level" />
          <div className="flex gap-2.5 md:gap-3.5 mb-5">
            {EXPERIENCE.map(e => (
              <ExperienceCard key={e.value} {...e} selected={form.experience === e.value} onClick={() => set('experience', e.value)} />
            ))}
          </div>

          <Label text="Training Style" optional />
          <PillGroup options={INTENSITY_OPTS} selected={form.intensity_style} onSelect={v => set('intensity_style', v)} />

          <Label text="Focus Area" hint="Primary muscle group for this workout" />
          <PillGroup options={FOCUS_OPTS} selected={form.focus} onSelect={v => set('focus', v)} />

          <Label text="Session Duration" />
          <div className="flex flex-wrap gap-1.5 mb-5">
            {DURATIONS.map(d => (
              <Pill key={d} label={d} sub="min" selected={form.duration === d} onClick={() => set('duration', d)} />
            ))}
          </div>
        </div>
      );

      case 2: return (
        <div>
          <Label text="Training Location" />
          <div className="grid grid-cols-3 gap-2.5 mb-5">
            {LOCATIONS.map(loc => (
              <button key={loc.value} onClick={() => set('location', loc.value)}
                className={`
                  flex flex-col gap-1.5 px-3 py-4 text-left border-[1.5px] rounded-2xl cursor-pointer
                  transition-all duration-150 active:scale-[0.97]
                  ${form.location === loc.value
                    ? 'bg-[rgba(200,241,53,0.07)] border-[#C8F135] shadow-[0_0_14px_rgba(200,241,53,0.09)]'
                    : 'bg-[#1E1E1E] border-[#2A2A2A] hover:-translate-y-px'
                  }
                `}
                style={{ WebkitTapHighlightColor: 'transparent' }}>
                <span className={`text-[12px] font-extrabold uppercase tracking-[0.05em] font-sans ${form.location === loc.value ? 'text-[#C8F135]' : 'text-white'}`}>
                  {loc.label}
                </span>
                <span className="font-mono text-[10px] text-[#888]">{loc.sub}</span>
              </button>
            ))}
          </div>

          {form.location === 'home' && (
            <>
              <Label text="Available Equipment" optional />
              <div className="flex flex-wrap gap-1.5 mb-5">
                {EQUIPMENT_OPTS.map(e => (
                  <Pill key={e} label={e} selected={form.equipment.includes(e)} onClick={() => toggleArr('equipment', e)} />
                ))}
              </div>
            </>
          )}

          <Label text="Cardio" optional />
          <PillGroup options={CARDIO_OPTS} selected={form.cardio} onSelect={v => set('cardio', v)} />

          <InfoBanner icon="◈" title="Lagging Muscles" body="The AI adds targeted extra volume and specific exercises for these areas." />
          <Label text="Select all that apply" optional />
          <PillGroup options={WEAK_MUSCLES} selected={form.weak_muscles} onSelect={v => toggleArr('weak_muscles', v)} multi />

          <InfoBanner icon="◉" title="Energy Today" body="Adjusts total volume, sets, and rest periods to match how you're feeling." />
          <Label text="Current energy level" optional />
          <PillGroup options={RECOVERY_OPTS} selected={form.recovery_level} onSelect={v => set('recovery_level', v)} />

          <Label text="Injuries / Limitations" optional />
          <PillGroup
            options={INJURY_PRESETS.map(i => ({ value: i, label: i }))}
            selected={form.injuries}
            onSelect={v => set('injuries', v)}
            warn
          />

          <InfoBanner icon="◎" title="Custom Instructions" body='Anything specific — "superset everything", "avoid machines", "add a finisher"' />
          <Label text="Tell the AI anything" optional />
          <StyledTextarea
            placeholder='"Focus on mind-muscle connection, no machines today…"'
            value={form.custom_note}
            onChange={v => set('custom_note', v)}
          />
        </div>
      );

      default: return null;
    }
  };

  // ── CTA Buttons ──────────────────────────────────────────────────────────────
  // Fix: "Change CTA copy" — "Next: Set your goal" etc.
  const nextLabels = ['Next: Set your goal →', 'Next: Session details →'];

  const CTAContinue = (
    <div>
      <button
        onClick={() => { setApiError(null); setStep(s => s + 1); }}
        disabled={!canProceed}
        className={`
          w-full h-[54px] border-[1.5px] rounded-2xl text-[13px] font-extrabold tracking-[0.1em] uppercase
          font-sans flex items-center justify-center gap-2.5 transition-all duration-200
          ${canProceed
            ? 'bg-[rgba(200,241,53,0.09)] border-[rgba(200,241,53,0.45)] text-[#C8F135] hover:-translate-y-px active:scale-[0.97]'
            : 'bg-[#1E1E1E] border-[#2A2A2A] text-[#555] cursor-not-allowed'
          }
        `}
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        {nextLabels[step] ?? 'Continue →'}
      </button>
      {/* Fix: "Show message: Enter age to continue" */}
      {!canProceed && blockReason && (
        <p className="mt-2 text-center text-[11px] text-[#555] font-sans">{blockReason}</p>
      )}
    </div>
  );

  const CTAGenerate = (
    <div>
      <button
        onClick={handleGenerate}
        disabled={loading || !canProceed}
        className={`
          w-full h-[58px] rounded-2xl text-[14px] font-black tracking-[0.1em] uppercase
          font-sans flex items-center justify-center gap-2.5 transition-all duration-200
          ${loading || !canProceed
            ? 'bg-[#1E1E1E] text-[#555] cursor-not-allowed border border-[#2A2A2A]'
            : 'bg-[#C8F135] text-black shadow-[0_6px_28px_rgba(200,241,53,0.22)] hover:-translate-y-px active:scale-[0.97]'
          }
        `}
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        {loading ? (
          <>
            <div className="w-[18px] h-[18px] border-2 border-[#242424] border-t-[#C8F135] rounded-full animate-spin" />
            Building your plan…
          </>
        ) : <>⚡ Generate my plan</>}
      </button>
      {!canProceed && blockReason && (
        <p className="mt-2 text-center text-[11px] text-[#555] font-sans">{blockReason}</p>
      )}
    </div>
  );

  const isLastStep = step === STEPS.length - 1;
  const CTA = isLastStep ? CTAGenerate : CTAContinue;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; }
        body { background: #0E0E0E; }
        input { caret-color: #C8F135; }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #161616; }
        ::-webkit-scrollbar-thumb { background: #2A2A2A; border-radius: 2px; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes slideIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
        @keyframes fadeIn  { from { opacity:0; }                            to { opacity:1; }                           }
        .step-anim { animation: slideIn 0.3s cubic-bezier(0.25,0.46,0.45,0.94); }
        .fade-anim { animation: fadeIn  0.3s ease; }
      `}</style>

      <div className="min-h-svh bg-[#0E0E0E] text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="min-h-svh grid grid-cols-1 md:grid-cols-[300px_1fr]">

          {/* ══ DESKTOP SIDEBAR ══ */}
          <aside className="hidden md:flex flex-col justify-between px-8 py-10 border-r border-[#242424] sticky top-0 h-svh overflow-hidden">
            <div>
              <div className="mb-10 tracking-[0.1em] text-[#C8F135]"
                   style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28 }}>
                FORGE
              </div>

              <div className="fade-anim" key={`sidebar-${step}`}>
                <div className="font-mono text-[10px] text-[#888] tracking-[0.18em] uppercase mb-2">
                  {STEPS[step].index} — {STEPS[step].sub}
                </div>
                <h1 className="leading-[0.88] tracking-[0.02em] text-white mb-4 break-words"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3rem,3.5vw,4rem)' }}>
                  {STEPS[step].title}
                </h1>
                <div className="w-9 h-0.5 bg-[#C8F135] rounded-sm mb-7" />

                {/* Vertical step progress */}
                <div className="flex flex-col gap-3">
                  {STEPS.map((s, i) => (
                    <div key={s.id} className="flex items-center gap-3">
                      <div className={`
                        w-7 h-7 rounded-full shrink-0 flex items-center justify-center
                        border-[1.5px] transition-all duration-300
                        ${i < step  ? 'bg-[#C8F135] border-[#C8F135]'
                        : i === step ? 'bg-[rgba(200,241,53,0.12)] border-[#C8F135]'
                        : 'bg-[#1E1E1E] border-[#2A2A2A]'}
                      `}>
                        {i < step
                          ? <span className="text-black text-[12px] font-black">✓</span>
                          : <span className="font-mono text-[9px] font-bold"
                                  style={{ color: i === step ? '#C8F135' : '#555' }}>{s.index}</span>
                        }
                      </div>
                      <div>
                        <div className="text-[12px] font-sans transition-colors duration-200"
                             style={{ fontWeight: i === step ? 700 : 500, color: i === step ? '#fff' : '#888' }}>
                          {s.title}
                        </div>
                        {i === step && (
                          <div className="font-mono text-[10px] text-[#555] tracking-[0.05em] mt-0.5">{s.sub}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Fix: "Takes 30 sec" time hint */}
                <div className="mt-6 flex items-center gap-2">
                  <span className="text-[10px] font-mono text-[#555] tracking-wide">⏱ {STEPS[step].time} to complete this step</span>
                </div>
              </div>
            </div>

            {/* Sidebar CTA */}
            <div className="flex flex-col gap-2.5">
              {CTA}
              {step > 0 && (
                <button
                  onClick={() => setStep(s => s - 1)}
                  className="w-full h-11 bg-transparent border border-[#2A2A2A] rounded-xl text-[#888] text-[12px] font-semibold font-sans flex items-center justify-center gap-1.5 transition-all hover:border-[#444] hover:text-white"
                >
                  ← Back
                </button>
              )}
            </div>
          </aside>

          {/* ══ MAIN COLUMN ══ */}
          <div className="flex flex-col min-h-svh">

            {/* ── Mobile top bar ── */}
            <div className="md:hidden sticky top-0 z-50 bg-[rgba(14,14,14,0.93)] backdrop-blur border-b border-[#242424]">
              {/* Progress rail */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#242424]">
                <div className="h-full bg-[#C8F135] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
                     style={{ width: `${progress}%` }} />
              </div>
              <div className="flex items-center justify-between h-[60px] px-5">
                <button
                  onClick={() => step > 0 ? setStep(s => s - 1) : navigate('/')}
                  className="w-[38px] h-[38px] bg-[#1E1E1E] border border-[#2A2A2A] rounded-[10px] flex items-center justify-center text-white text-xl"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >‹</button>
                <span className="tracking-[0.08em] text-[#C8F135]"
                      style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20 }}>FORGE</span>
                <div className="text-right">
                  <div className="font-mono text-[11px] text-[#888] tracking-[0.1em]">
                    {String(step + 1).padStart(2,'0')}/{STEPS.length}
                  </div>
                  {/* Fix: "Takes 30 sec" */}
                  <div className="font-mono text-[9px] text-[#555]">{STEPS[step].time}</div>
                </div>
              </div>
            </div>

            {/* ── Sticky summary bar (Fix: add summary) ── */}
            <SummaryBar form={form} />

            {/* ── Scrollable form area ── */}
            <div className="flex-1 overflow-y-auto px-5 pt-7 pb-3 sm:px-8 sm:pt-8 md:px-12 md:pt-11 lg:px-[72px] lg:pt-[52px]">

              {/* Mobile step header */}
              <div className="md:hidden mb-7 step-anim" key={`mob-h-${step}`}>
                <div className="flex gap-1.5 mb-4">
                  {STEPS.map((_, i) => (
                    <div key={i} className="h-[3px] rounded-sm transition-all duration-300"
                         style={{ width: i === step ? 18 : 6, background: i <= step ? '#C8F135' : '#242424', opacity: i < step ? 0.4 : 1 }} />
                  ))}
                </div>
                <div className="font-mono text-[10px] text-[#888] tracking-[0.18em] uppercase mb-2">
                  {STEPS[step].index} — {STEPS[step].sub}
                </div>
                <h1 className="leading-[0.9] tracking-[0.02em] text-white"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3rem,9vw,4.5rem)' }}>
                  {STEPS[step].title}
                </h1>
              </div>

              {/* Desktop step hint */}
              <div className="hidden md:block mb-9 step-anim" key={`desk-h-${step}`}>
                <div className="font-mono text-[10px] text-[#555] tracking-[0.18em] uppercase mb-2">
                  // Fill in the details below
                </div>
                <div className="w-8 h-0.5 bg-[#C8F135] rounded-sm" />
              </div>

              {/* Fix: "Replace alert with UI error" */}
              {apiError && (
                <ErrorCard message={apiError} onRetry={handleGenerate} />
              )}

              {/* Step content */}
              <div className="step-anim" key={`content-${step}`}>
                {renderStep()}
              </div>
            </div>

            {/* ── Mobile sticky footer ── */}
            <div className="md:hidden sticky bottom-0 z-40 bg-[rgba(14,14,14,0.96)] backdrop-blur border-t border-[#242424] px-5 pt-4 pb-5">
              {CTA}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}