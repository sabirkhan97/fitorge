'use client';
import React, { useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface MuscleBodySelectorProps {
  selected: string[];
  onToggle: (weakValue: string) => void;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
export const WEAK_MUSCLES = [
  { value: 'lower_chest',       label: 'Lower Chest'     },
  { value: 'upper_chest',       label: 'Upper Chest'     },
  { value: 'inner_chest',       label: 'Inner Chest'     },
  { value: 'rear_delts',        label: 'Rear Delts'      },
  { value: 'side_delts',        label: 'Side Delts'      },
  { value: 'rounded_shoulders', label: 'Round Shoulders' },
  { value: 'upper_back',        label: 'Upper Back'      },
  { value: 'lats',              label: 'Lats Width'      },
  { value: 'hamstrings',        label: 'Hamstrings'      },
  { value: 'glutes',            label: 'Glutes'          },
  { value: 'calves',            label: 'Calves'          },
  { value: 'bicep_peak',        label: 'Bicep Peak'      },
  { value: 'tricep_mass',       label: 'Tricep Mass'     },
  { value: 'lower_abs',         label: 'Lower Abs'       },
  { value: 'forearms',          label: 'Forearms'        },
] as const;

// Maps body region id → primary weak_muscle value to toggle
export const MUSCLE_REGION_MAP: Record<string, string[]> = {
  chest:       ['lower_chest', 'inner_chest'],
  upper_chest: ['upper_chest'],
  shoulders:   ['rear_delts', 'side_delts', 'rounded_shoulders'],
  biceps:      ['bicep_peak'],
  triceps:     ['tricep_mass'],
  forearms:    ['forearms'],
  core:        ['lower_abs'],
  back:        ['upper_back', 'lats'],
  glutes:      ['glutes'],
  legs:        [],
  hamstrings:  ['hamstrings'],
  calves:      ['calves'],
};

// Maps weak_muscle value → body region id
export const WEAK_TO_REGION: Record<string, string> = {
  lower_chest: 'chest',  upper_chest: 'upper_chest', inner_chest: 'chest',
  rear_delts:  'shoulders', side_delts: 'shoulders', rounded_shoulders: 'shoulders',
  upper_back:  'back',   lats: 'back',
  hamstrings:  'hamstrings', glutes: 'glutes', calves: 'calves',
  bicep_peak:  'biceps', tricep_mass: 'triceps',
  lower_abs:   'core',   forearms: 'forearms',
};

// Active dot positions per region id — [cx, cy][]
const DOT_POS: Record<string, [number, number][]> = {
  chest:       [[100, 94]],
  upper_chest: [[100, 70]],
  shoulders:   [[60, 74], [140, 74]],
  biceps:      [[50, 112], [150, 112]],
  triceps:     [[62, 104], [138, 104]],
  forearms:    [[44, 155], [156, 155]],
  core:        [[100, 130]],
  back:        [[66, 108], [134, 108]],
  glutes:      [[68, 190], [132, 190]],
  legs:        [[63, 254], [137, 254]],
  hamstrings:  [[83, 256], [117, 256]],
  calves:      [[60, 350], [140, 350]],
};

const LIME = '#C8F135';

// ─── MuscleBodySelector ───────────────────────────────────────────────────────
export default function MuscleBodySelector({ selected, onToggle }: MuscleBodySelectorProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  const isActive  = (id: string) => selected.some(v => WEAK_TO_REGION[v] === id);

  const handleClick = (id: string) => {
    const keys = MUSCLE_REGION_MAP[id];
    if (!keys || keys.length === 0) return;
    onToggle(keys[0]);
  };

  const fill   = (id: string) => isActive(id) ? LIME : hovered === id ? 'rgba(200,241,53,0.35)' : 'rgba(255,255,255,0.07)';
  const stroke = (id: string) => isActive(id) ? LIME : hovered === id ? 'rgba(200,241,53,0.55)' : 'rgba(255,255,255,0.13)';
  const sw     = (id: string) => isActive(id) ? 1.5 : 0.6;
  const glow   = (id: string) => isActive(id) ? 'drop-shadow(0 0 5px rgba(200,241,53,0.5))' : 'none';

  const rp = (id: string) => ({
    fill:        fill(id),
    stroke:      stroke(id),
    strokeWidth: sw(id),
    style: {
      cursor: 'pointer',
      transition: 'fill .18s ease, stroke .18s ease, filter .18s ease',
      filter: glow(id),
    } as React.CSSProperties,
    onClick:      () => handleClick(id),
    onMouseEnter: () => setHovered(id),
    onMouseLeave: () => setHovered(null),
  });

  const activeDots = Object.entries(DOT_POS).flatMap(([id, positions]) =>
    isActive(id)
      ? positions.map((p, i) => (
          <circle key={`${id}-${i}`} cx={p[0]} cy={p[1]} r="3.5"
            fill={LIME} stroke="#000" strokeWidth="1"
            style={{ pointerEvents: 'none' }} />
        ))
      : []
  );

  const hoveredLabel = hovered
    ? WEAK_MUSCLES.find(m => WEAK_TO_REGION[m.value] === hovered)?.label
      ?? (hovered.charAt(0).toUpperCase() + hovered.slice(1))
    : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', userSelect: 'none' }}>
      {/* Tooltip */}
      <div style={{ height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4, transition: 'opacity .15s', opacity: hovered ? 1 : 0 }}>
        {hovered && (
          <span style={{
            fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            background: isActive(hovered) ? LIME : '#1E1E1E',
            color: isActive(hovered) ? '#000' : '#fff',
            padding: '4px 10px', borderRadius: 6,
            border: `1px solid ${isActive(hovered) ? LIME : '#2A2A2A'}`,
          }}>
            {isActive(hovered) ? '✓ ' : ''}{hoveredLabel}
          </span>
        )}
      </div>

      {/* SVG Body */}
      <svg viewBox="0 0 200 430" width="100%"
        style={{ maxWidth: 160, overflow: 'visible' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ── Base silhouette ── */}
        <g fill="#1C1C1C" stroke="#2A2A2A" strokeWidth="0.5">
          <ellipse cx="100" cy="28" rx="18" ry="22"/>
          <rect x="93" y="47" width="14" height="12" rx="3"/>
          <path d="M68 59 Q58 62 56 80 L54 162 Q54 169 60 171 L140 171 Q146 169 146 162 L144 80 Q142 62 132 59 Z"/>
          <path d="M60 169 Q54 173 52 186 L52 210 L148 210 L148 186 Q146 173 140 169 Z"/>
          <path d="M68 62 Q52 66 48 80 L46 119 Q46 127 52 129 L62 127 L64 82 Z"/>
          <path d="M132 62 Q148 66 152 80 L154 119 Q154 127 148 129 L138 127 L136 82 Z"/>
          <path d="M46 129 Q42 134 40 145 L38 174 Q38 181 44 183 L54 181 L56 137 L52 131 Z"/>
          <path d="M154 129 Q158 134 160 145 L162 174 Q162 181 156 183 L146 181 L144 137 L148 131 Z"/>
          <ellipse cx="41" cy="187" rx="8" ry="9"/>
          <ellipse cx="159" cy="187" rx="8" ry="9"/>
          <path d="M60 208 Q54 212 52 228 L50 293 Q50 303 56 306 L78 306 L80 214 Z"/>
          <path d="M140 208 Q146 212 148 228 L150 293 Q150 303 144 306 L122 306 L120 214 Z"/>
          <path d="M78 306 L50 309 Q46 315 46 327 L46 383 Q46 394 52 397 L76 397 L80 308 Z"/>
          <path d="M122 306 L150 309 Q154 315 154 327 L154 383 Q154 394 148 397 L124 397 L120 308 Z"/>
          <path d="M44 395 Q38 397 36 407 L36 413 Q36 417 42 417 L76 417 L78 395 Z"/>
          <path d="M156 395 Q162 397 164 407 L164 413 Q164 417 158 417 L124 417 L122 395 Z"/>
        </g>

        {/* ── UPPER CHEST ── */}
        <path d="M72 63 Q80 60 100 60 Q120 60 128 63 L126 78 Q118 73 100 72 Q82 73 74 78 Z" {...rp('upper_chest')}/>

        {/* ── CHEST ── */}
        <g {...rp('chest')}>
          <path d="M70 78 Q82 73 98 74 L96 108 Q86 112 74 110 Q64 106 64 98 Z"/>
          <path d="M130 78 Q118 73 102 74 L104 108 Q114 112 126 110 Q136 106 136 98 Z"/>
        </g>

        {/* ── SHOULDERS ── */}
        <g {...rp('shoulders')}>
          <path d="M68 62 Q55 64 51 77 L56 97 Q60 86 68 82 Z"/>
          <path d="M132 62 Q145 64 149 77 L144 97 Q140 86 132 82 Z"/>
        </g>

        {/* ── BICEPS ── */}
        <g {...rp('biceps')}>
          <path d="M52 99 Q46 105 46 117 L50 126 Q54 120 56 109 Z"/>
          <path d="M148 99 Q154 105 154 117 L150 126 Q146 120 144 109 Z"/>
        </g>

        {/* ── TRICEPS ── */}
        <g {...rp('triceps')}>
          <path d="M64 86 Q58 93 56 110 L62 123 Q66 113 68 97 Z"/>
          <path d="M136 86 Q142 93 144 110 L138 123 Q134 113 132 97 Z"/>
        </g>

        {/* ── FOREARMS ── */}
        <g {...rp('forearms')}>
          <path d="M46 131 Q40 137 38 153 L40 171 Q44 162 48 148 L52 133 Z"/>
          <path d="M154 131 Q160 137 162 153 L160 171 Q156 162 152 148 L148 133 Z"/>
        </g>

        {/* ── CORE (abs) ── */}
        <g {...rp('core')}>
          <rect x="88"  y="108" width="10" height="12" rx="3"/>
          <rect x="102" y="108" width="10" height="12" rx="3"/>
          <rect x="87"  y="124" width="10" height="12" rx="3"/>
          <rect x="103" y="124" width="10" height="12" rx="3"/>
          <rect x="88"  y="140" width="10" height="12" rx="3"/>
          <rect x="102" y="140" width="10" height="12" rx="3"/>
          <path d="M74 112 Q70 122 72 140 L82 138 L80 110 Z" opacity="0.85"/>
          <path d="M126 112 Q130 122 128 140 L118 138 L120 110 Z" opacity="0.85"/>
        </g>

        {/* ── BACK / LATS ── */}
        <g {...rp('back')}>
          <path d="M60 80 Q56 92 56 115 L62 131 Q66 117 68 101 L72 80 Z" opacity="0.8"/>
          <path d="M140 80 Q144 92 144 115 L138 131 Q134 117 132 101 L128 80 Z" opacity="0.8"/>
        </g>

        {/* ── GLUTES ── */}
        <g {...rp('glutes')}>
          <path d="M60 171 Q54 177 54 193 L62 208 Q68 197 72 183 L74 169 Z"/>
          <path d="M140 171 Q146 177 146 193 L138 208 Q132 197 128 183 L126 169 Z"/>
        </g>

        {/* ── LEGS (quads) ── */}
        <g {...rp('legs')}>
          <path d="M60 210 Q54 218 52 237 L54 279 Q58 291 66 294 L78 292 L76 215 Z"/>
          <path d="M140 210 Q146 218 148 237 L146 279 Q142 291 134 294 L122 292 L124 215 Z"/>
        </g>

        {/* ── HAMSTRINGS ── */}
        <g {...rp('hamstrings')}>
          <path d="M78 213 L80 292 L90 294 Q92 266 92 237 Q90 219 84 211 Z"/>
          <path d="M122 213 L120 292 L110 294 Q108 266 108 237 Q110 219 116 211 Z"/>
        </g>

        {/* ── CALVES ── */}
        <g {...rp('calves')}>
          <path d="M50 309 Q46 319 46 339 L48 367 Q52 379 58 383 L72 381 L74 309 Z"/>
          <path d="M150 309 Q154 319 154 339 L152 367 Q148 379 142 383 L128 381 L126 309 Z"/>
        </g>

        {/* ── Active dots ── */}
        {activeDots}
      </svg>

      <div style={{
        fontFamily: "'Space Mono', monospace", fontSize: 9,
        color: '#555', letterSpacing: '0.1em', textAlign: 'center', marginTop: 8,
      }}>
        Tap muscle to select
      </div>
    </div>
  );
}