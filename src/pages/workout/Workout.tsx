import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

// ---------- Types ----------
interface WorkoutExercise {
  id: string;
  name: string;
  muscle_group: string;
  category: string;
  priority: number;
  sets: number;
  reps: string;
  rest: string;
  tempo: string;
  weight: string;
  intensity_hint: string;
  form_cues: string[];
  common_mistakes: string[];
}

interface WorkoutData {
  day: string;
  focus: string;
  difficulty: string;
  total_duration: number;
  calories_estimate: number;
  warmup: { duration: number; steps: string[] };
  cooldown: { duration: number; steps: string[] };
  notes: string;
  exercises: WorkoutExercise[];
  summary: {
    total_sets: number;
    primary_muscles: string[];
    fatigue_score: number;
  };
  user_feedback_hook?: {
    difficulty_feedback_request: string;
  };
}

// ---------- Main Component ----------
const Workout: React.FC = () => {
  // Form state
  const [goal, setGoal] = useState('general');
  const [duration, setDuration] = useState(45);
  const [focus, setFocus] = useState('full body');
  const [location, setLocation] = useState('home');

  // logged-in state (prefill)
  const [prefilling, setPrefilling] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function maybePrefill() {
      try {
        setPrefilling(true);
        const { data: sessionData } = await supabase.auth.getSession();
        const session = sessionData.session;
        if (!session) return;

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('height,weight,experience,injuries,weak_muscles,equipment')
          .single();

        if (error) return;
        if (cancelled) return;

        if (profile?.experience) setExperience(profile.experience);
        if (Array.isArray(profile?.injuries)) setInjuries(profile.injuries.length ? profile.injuries : ['none']);
        if (Array.isArray(profile?.equipment) && profile.equipment.length) setEquipment(profile.equipment);
        // weak_muscles not collected in UI yet; keep internal-only for now
      } finally {
        if (!cancelled) setPrefilling(false);
      }
    }

    maybePrefill();
    return () => {
      cancelled = true;
    };
  }, []);


  // Advanced options (collapsible)
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [experience, setExperience] = useState('intermediate');
  const [equipment, setEquipment] = useState<string[]>(['bodyweight']);
  const [injuries, setInjuries] = useState<string[]>(['none']);
  const [intensityStyle, setIntensityStyle] = useState('balanced');
  const [recoveryLevel, setRecoveryLevel] = useState('normal');
  const [cardioPref, setCardioPref] = useState('none');
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState('male');

  // UI state
  const [loading, setLoading] = useState(false);
  const [workout, setWorkout] = useState<WorkoutData | null>(null);
  const [error, setError] = useState('');

  // Handle equipment multi-select
  const toggleEquipment = (item: string) => {
    setEquipment(prev =>
      prev.includes(item) ? prev.filter(e => e !== item) : [...prev, item]
    );
  };

  // Handle injuries multi-select
  const toggleInjury = (injury: string) => {
    if (injury === 'none') {
      setInjuries(['none']);
      return;
    }
    setInjuries(prev => {
      const newInjuries = prev.includes(injury)
        ? prev.filter(i => i !== injury)
        : [...prev.filter(i => i !== 'none'), injury];
      return newInjuries.length === 0 ? ['none'] : newInjuries;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setWorkout(null);

    const payload = {
      age,
      gender,
      goal,
      workout_duration: duration,
      focus,
      location,
      experience,
      equipment: equipment.length === 0 ? ['bodyweight'] : equipment,
      injuries: injuries.includes('none') ? [] : injuries,
      intensity_style: intensityStyle,
      recovery_level: recoveryLevel,
      cardio: cardioPref === 'none' ? undefined : cardioPref,
      // optional but good to have
      days_per_week: 1, // not used for single workout
      height: null,
      weight: null,
      weak_muscles: [],
      custom_note: '',
    };

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      const userId = sessionData.session?.user?.id;

      const API_URL = 'https://fit-forge-backend.vercel.app/api/generate-workout';
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({
          ...payload,
          ...(userId ? { user_id: userId } : {}),
          ...(accessToken ? { access_token: accessToken } : {}),
        }),
      });
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      setWorkout(data);
      // Optional: scroll to workout section
      document.getElementById('workout-result')?.scrollIntoView({ behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || 'Failed to generate workout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to render exercise card
  const renderExercise = (ex: WorkoutExercise, idx: number) => (
    <div key={ex.id || idx} className="bg-white rounded-xl shadow-md p-4 mb-4 border border-gray-200">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold text-gray-800">{ex.name}</h3>
        <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
          {ex.muscle_group}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
        <div>Sets: {ex.sets}</div>
        <div>Reps: {ex.reps}</div>
        <div>Rest: {ex.rest}</div>
        <div>Tempo: {ex.tempo}</div>
        <div className="col-span-2">Weight: {ex.weight}</div>
      </div>
      {ex.intensity_hint && (
        <p className="text-sm text-gray-500 mt-2 italic">{ex.intensity_hint}</p>
      )}
      {ex.form_cues && ex.form_cues.length > 0 && (
        <div className="mt-2">
          <p className="text-xs font-semibold text-gray-700">Form cues:</p>
          <ul className="list-disc list-inside text-xs text-gray-600">
            {ex.form_cues.map((cue, i) => <li key={i}>{cue}</li>)}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">FitForge ⚡</h1>
          <p className="text-gray-600 mt-2">Generate your personalised workout – no sign‑up required</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSubmit}>
            {/* Required fields row (goal, duration, focus, location) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Goal *</label>
                <select
                  value={goal}
                  onChange={e => setGoal(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="muscle_gain">💪 Muscle gain</option>
                  <option value="fat_loss">🔥 Fat loss</option>
                  <option value="endurance">🏃 Endurance</option>
                  <option value="strength">🏋️ Strength</option>
                  <option value="general">🧘 General fitness</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes) *</label>
                <input
                  type="number"
                  min={15}
                  max={120}
                  step={5}
                  value={duration}
                  onChange={e => setDuration(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Focus *</label>
                <select
                  value={focus}
                  onChange={e => setFocus(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="full body">Full body</option>
                  <option value="chest">Chest</option>
                  <option value="back">Back</option>
                  <option value="legs">Legs</option>
                  <option value="shoulders">Shoulders</option>
                  <option value="arms">Arms</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                <select
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="home">🏠 Home</option>
                  <option value="gym">🏋️ Gym</option>
                  <option value="outdoor">🌳 Outdoor</option>
                </select>
              </div>
            </div>

            {/* Advanced options toggle */}
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-indigo-600 text-sm font-medium flex items-center gap-1 mb-4 hover:text-indigo-800"
            >
              {showAdvanced ? '▼' : '▶'} Advanced options (optional)
            </button>

            {showAdvanced && (
              <div className="bg-gray-50 rounded-xl p-5 mb-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Experience</label>
                    <select value={experience} onChange={e => setExperience(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2">
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Intensity style</label>
                    <select value={intensityStyle} onChange={e => setIntensityStyle(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2">
                      <option value="balanced">Balanced</option>
                      <option value="pump">Pump (hypertrophy)</option>
                      <option value="strength">Strength (heavy)</option>
                      <option value="circuit">Circuit (cardio)</option>
                      <option value="explosive">Explosive (power)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Recovery level</label>
                    <select value={recoveryLevel} onChange={e => setRecoveryLevel(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2">
                      <option value="fresh">Fresh – push hard</option>
                      <option value="normal">Normal</option>
                      <option value="tired">Tired – reduce volume</option>
                      <option value="very_tired">Very tired – light only</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cardio preference</label>
                    <select value={cardioPref} onChange={e => setCardioPref(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2">
                      <option value="none">None</option>
                      <option value="light">Light (5 min finisher)</option>
                      <option value="moderate">Moderate (10 min)</option>
                      <option value="heavy">Heavy (15+ min)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Age</label>
                    <input type="number" value={age} onChange={e => setAge(Number(e.target.value))} className="mt-1 w-full border rounded-lg px-3 py-2" min={12} max={100} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <select value={gender} onChange={e => setGender(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2">
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Equipment checkboxes */}
                <div>
                  <span className="text-sm font-medium text-gray-700">Available equipment</span>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {['bodyweight', 'dumbbells', 'resistance bands', 'barbell', 'machine'].map(eq => (
                      <label key={eq} className="flex items-center gap-1 text-sm">
                        <input type="checkbox" checked={equipment.includes(eq)} onChange={() => toggleEquipment(eq)} />
                        {eq.charAt(0).toUpperCase() + eq.slice(1)}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Injuries */}
                <div>
                  <span className="text-sm font-medium text-gray-700">Injuries / limitations</span>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {['lower back', 'knee', 'shoulder', 'wrist', 'none'].map(inj => (
                      <label key={inj} className="flex items-center gap-1 text-sm">
                        <input type="checkbox" checked={injuries.includes(inj)} onChange={() => toggleInjury(inj)} />
                        {inj.charAt(0).toUpperCase() + inj.slice(1)}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition disabled:bg-indigo-400 disabled:cursor-wait"
            >
              {loading ? 'Generating your workout...' : 'Generate Workout 🔥'}
            </button>
          </form>
        </div>

        {/* Error display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Workout Result */}
        {workout && (
          <div id="workout-result" className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Your {workout.focus} workout
            </h2>
            <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4 border-b pb-3">
              <span>⏱️ {workout.total_duration} min</span>
              <span>🔥 ~{workout.calories_estimate} kcal</span>
              <span>📊 {workout.difficulty}</span>
              <span>💪 {workout.summary.total_sets} total sets</span>
            </div>

            {/* Warmup */}
            <div className="bg-green-50 rounded-xl p-4 mb-4">
              <h3 className="font-bold text-green-800">🧘 Warmup ({workout.warmup.duration} min)</h3>
              <ul className="list-disc list-inside text-sm text-green-700 mt-1">
                {workout.warmup.steps.map((step, i) => <li key={i}>{step}</li>)}
              </ul>
            </div>

            {/* Exercises */}
            <h3 className="font-bold text-xl mb-3">🏋️ Exercises</h3>
            {workout.exercises.map((ex, idx) => renderExercise(ex, idx))}

            {/* Cooldown */}
            <div className="bg-blue-50 rounded-xl p-4 mt-4">
              <h3 className="font-bold text-blue-800">🧘 Cool down ({workout.cooldown.duration} min)</h3>
              <ul className="list-disc list-inside text-sm text-blue-700 mt-1">
                {workout.cooldown.steps.map((step, i) => <li key={i}>{step}</li>)}
              </ul>
            </div>

            {/* Notes & feedback */}
            {workout.notes && (
              <div className="mt-4 text-sm text-gray-600 bg-gray-100 p-3 rounded-lg">
                <span className="font-semibold">💡 Note:</span> {workout.notes}
              </div>
            )}
            {workout.user_feedback_hook?.difficulty_feedback_request && (
              <div className="mt-4 text-center text-sm text-gray-500 italic">
                {workout.user_feedback_hook.difficulty_feedback_request}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Workout;