'use client';
import { useState, useEffect, useRef } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────
interface LoadingStep {
  label: string;
  icon?: string;
}

interface LoadingModalProps {
  isOpen: boolean;
  steps?: (string | LoadingStep)[];
  intervalMs?: number;
  title?: string;
  subtitle?: string;
  onCancel?: () => void;
  /** If provided, modal shows a real percentage rather than the illusion bar */
  realProgress?: number;
  /** Accent color — defaults to #C8F135 */
  accentColor?: string;
  /** Shows confetti-like particles when complete */
  showCompletionEffect?: boolean;
  /** 0–1 fraction — when realProgress reaches this, show "almost there" copy */
  almostThereAt?: number;
}

// ── Default steps ─────────────────────────────────────────────────────────────
const DEFAULT_STEPS: LoadingStep[] = [
  { label: 'Analyzing your profile…',            icon: '◈' },
  { label: 'Matching exercises to your goals…',  icon: '◎' },
  { label: 'Balancing volume & intensity…',      icon: '◆' },
  { label: 'Optimizing for recovery…',           icon: '◉' },
  { label: 'Finalizing your personalized plan…', icon: '⚡' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function normalize(steps: (string | LoadingStep)[]): LoadingStep[] {
  return steps.map(s => (typeof s === 'string' ? { label: s } : s));
}

// ── Particle ──────────────────────────────────────────────────────────────────
function Particle({ accent }: { accent: string }) {
  const style = {
    position: 'absolute' as const,
    width: `${Math.random() * 4 + 2}px`,
    height: `${Math.random() * 4 + 2}px`,
    background: Math.random() > 0.5 ? accent : '#fff',
    borderRadius: Math.random() > 0.5 ? '50%' : '2px',
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    opacity: 0,
    animation: `particle-fly ${Math.random() * 1.2 + 0.8}s ease-out ${Math.random() * 0.4}s forwards`,
  };
  return <div style={style} />;
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function LoadingModal({
  isOpen,
  steps = DEFAULT_STEPS,
  intervalMs = 1800,
  title = 'Building your workout',
  subtitle,
  onCancel,
  realProgress,
  accentColor = '#C8F135',
  showCompletionEffect = false,
  almostThereAt = 0.85,
}: LoadingModalProps) {
  const normalized = normalize(steps);
  const [currentStep, setCurrentStep] = useState(0);
  const [illusionBar, setIllusionBar] = useState(4);
  const [fadeKey, setFadeKey] = useState(0);
  const [showParticles, setShowParticles] = useState(false);
  const [mounted, setMounted] = useState(false);
  const stepRef = useRef(0);

  // Mount animation
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setMounted(true));
    } else {
      setMounted(false);
      setCurrentStep(0);
      setIllusionBar(4);
      setFadeKey(0);
      stepRef.current = 0;
      setShowParticles(false);
    }
  }, [isOpen]);

  // Step cycling
  useEffect(() => {
    if (!isOpen) return;
    const iv = setInterval(() => {
      stepRef.current = (stepRef.current + 1) % normalized.length;
      setCurrentStep(stepRef.current);
      setFadeKey(k => k + 1);
    }, intervalMs);
    return () => clearInterval(iv);
  }, [isOpen, normalized.length, intervalMs]);

  // Illusion progress bar (when no realProgress)
  useEffect(() => {
    if (!isOpen || realProgress !== undefined) return;
    const target = Math.min(92, 4 + (normalized.length * 100) / normalized.length);
    const iv = setInterval(() => {
      setIllusionBar(prev => {
        const next = prev + (Math.random() * 3 + 0.5);
        if (next >= 92) { clearInterval(iv); return 92; }
        return next;
      });
    }, intervalMs / 6);
    return () => clearInterval(iv);
  }, [isOpen, intervalMs, normalized.length, realProgress]);

  // Completion effect trigger
  useEffect(() => {
    if (!showCompletionEffect) return;
    const p = realProgress ?? illusionBar;
    const threshold = (realProgress !== undefined ? almostThereAt! * 100 : 90);
    if (p >= threshold && !showParticles) setShowParticles(true);
  }, [realProgress, illusionBar, showCompletionEffect, almostThereAt, showParticles]);

  if (!isOpen) return null;

  const displayProgress = realProgress !== undefined ? realProgress : illusionBar;
  const isAlmostDone = displayProgress >= (almostThereAt! * 100);
  const secsLeft = Math.max(1, Math.round((normalized.length - currentStep) * (intervalMs / 1000)));

  // Accent as rgb for rgba usage
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r},${g},${b}`;
  };
  const accentRgb = hexToRgb(accentColor);

  return (
    <>
      <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.94) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
        @keyframes overlay-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes step-fade {
          0%   { opacity: 0; transform: translateY(6px); }
          20%  { opacity: 1; transform: translateY(0);   }
          80%  { opacity: 1; transform: translateY(0);   }
          100% { opacity: 0; transform: translateY(-4px);}
        }
        @keyframes spin-slow {
          to { transform: rotate(360deg); }
        }
        @keyframes particle-fly {
          0%   { opacity: 1; transform: scale(0) translate(0,0); }
          100% { opacity: 0; transform: scale(1) translate(
                   calc(${Math.random() > 0.5 ? '' : '-'}${Math.round(Math.random() * 80 + 20)}px),
                   calc(-${Math.round(Math.random() * 100 + 40)}px)
                 ); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 12px rgba(${accentRgb}, 0.15); }
          50%       { box-shadow: 0 0 28px rgba(${accentRgb}, 0.35); }
        }
        @keyframes icon-pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50%       { transform: scale(1.2); opacity: 1; }
        }
        .loading-modal-overlay {
          animation: overlay-in 0.25s ease forwards;
        }
        .loading-modal-card {
          animation: modal-in 0.3s cubic-bezier(0.34,1.26,0.64,1) forwards;
        }
        .step-fade {
          animation: step-fade ${intervalMs}ms ease both;
        }
        .spinner-ring {
          animation: spin-slow 1.1s linear infinite;
        }
        .glow-pulse {
          animation: pulse-glow 2.5s ease-in-out infinite;
        }
        .icon-pulse {
          animation: icon-pulse ${intervalMs}ms ease-in-out infinite;
        }
      `}</style>

      {/* Overlay */}
      <div className="loading-modal-overlay fixed inset-0 z-50 flex items-end sm:items-center justify-center"
           style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(6px)' }}>

        {/* Card */}
        <div
          className="loading-modal-card glow-pulse relative w-full sm:w-[92%] sm:max-w-[420px] rounded-t-3xl sm:rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, #1C1C1C 0%, #181818 100%)',
            border: '1px solid #2A2A2A',
            borderBottom: 'none',
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
        >
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-[2px]"
               style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }} />

          {/* Particle container */}
          {showParticles && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 18 }).map((_, i) => (
                <Particle key={i} accent={accentColor} />
              ))}
            </div>
          )}

          {/* Drag indicator (mobile) */}
          <div className="flex justify-center pt-3 pb-1 sm:hidden">
            <div className="w-10 h-1 rounded-full bg-[#333]" />
          </div>

          <div className="px-7 pt-6 pb-7">

            {/* Spinner row */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-[60px] h-[60px]">
                {/* Outer track */}
                <svg viewBox="0 0 60 60" className="absolute inset-0 w-full h-full opacity-10">
                  <circle cx="30" cy="30" r="26" fill="none" stroke={accentColor} strokeWidth="2" />
                </svg>
                {/* Spinning arc */}
                <svg viewBox="0 0 60 60" className="spinner-ring absolute inset-0 w-full h-full">
                  <circle
                    cx="30" cy="30" r="26"
                    fill="none" stroke={accentColor} strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray="40 124"
                    strokeDashoffset="0"
                  />
                </svg>
                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    key={fadeKey}
                    className="icon-pulse text-[20px] leading-none"
                    style={{ color: accentColor }}
                  >
                    {normalized[currentStep]?.icon ?? '⚡'}
                  </span>
                </div>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-[18px] font-black text-white text-center mb-1 leading-tight tracking-[-0.01em]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {isAlmostDone ? 'Almost there…' : title}
            </h3>

            {/* Subtitle */}
            {subtitle && !isAlmostDone && (
              <p className="text-[12px] text-[#555] text-center mb-4 font-sans">
                {subtitle}
              </p>
            )}

            {/* Dynamic step */}
            <div className="relative h-[22px] flex items-center justify-center mb-6 overflow-hidden">
              <p
                key={fadeKey}
                className="step-fade absolute text-[12px] font-mono tracking-[0.04em] text-center px-4"
                style={{ color: accentColor }}
              >
                {normalized[currentStep]?.label}
              </p>
            </div>

            {/* Progress bar */}
            <div className="mb-1.5 h-[3px] rounded-full overflow-hidden" style={{ background: '#252525' }}>
              <div
                className="h-full rounded-full transition-all ease-out"
                style={{
                  width: `${displayProgress}%`,
                  background: `linear-gradient(90deg, ${accentColor}cc, ${accentColor})`,
                  transitionDuration: realProgress !== undefined ? '400ms' : '1200ms',
                  boxShadow: `0 0 8px ${accentColor}66`,
                }}
              />
            </div>

            {/* Progress label row */}
            <div className="flex items-center justify-between mb-5">
              <span className="font-mono text-[10px] text-[#444] tracking-wider">
                {Math.round(displayProgress)}%
              </span>
              <span className="font-mono text-[10px] text-[#444] tracking-wider">
                ~{secsLeft}s remaining
              </span>
            </div>

            {/* Step dots */}
            <div className="flex items-center justify-center gap-1.5 mb-5">
              {normalized.map((_, i) => (
                <div
                  key={i}
                  className="rounded-full transition-all duration-500"
                  style={{
                    width:  i === currentStep ? '16px' : '4px',
                    height: '4px',
                    background: i <= currentStep ? accentColor : '#2A2A2A',
                    opacity: i < currentStep ? 0.4 : 1,
                  }}
                />
              ))}
            </div>

            {/* Trust line */}
            <p className="text-center font-mono text-[10px] text-[#3A3A3A] tracking-widest uppercase">
              ⚡ AI-optimized · takes ~{Math.round((normalized.length * intervalMs) / 1000)}–{Math.round((normalized.length * intervalMs) / 1000) + 5}s
            </p>

            {/* Cancel */}
            {onCancel && (
              <button
                onClick={onCancel}
                className="mt-4 w-full text-center font-mono text-[11px] text-[#3A3A3A] hover:text-[#888] transition-colors tracking-wide"
              >
                × Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}