import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

type WorkoutRow = {
  id: string;
  created_at: string;
  focus: string | null;
  duration: number | null;
  workout_data: any;
};

export default function History() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [workouts, setWorkouts] = useState<WorkoutRow[]>([]);

  const dateFormatter = useMemo(() => {
    try {
      return new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const session = sessionData.session;
        if (!session) {
          // If user is not logged in, keep it simple: show nothing.
          if (!cancelled) setWorkouts([]);
          return;
        }

        const { data: rows, error: qErr } = await supabase
          .from('workouts')
          .select('id, created_at, focus, duration, workout_data')
          .order('created_at', { ascending: false })
          .limit(50);

        if (qErr) throw qErr;

        if (!cancelled) setWorkouts(rows ?? []);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Failed to load history');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const openWorkout = (workout: any) => {
    // Keep behavior compatible with existing /result page usage.
    // `Result.tsx` currently uses local state props passed by navigation.
    // So we persist the selected workout in localStorage.
    window.localStorage.setItem('fitforge:lastWorkout', JSON.stringify(workout));
    navigate('/result');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Workout History</h1>
          <p className="text-gray-600 mt-2">Your past generated workouts</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>
        )}

        {loading ? (
          <div className="text-gray-600">Loading...</div>
        ) : workouts.length === 0 ? (
          <div className="text-gray-600">No workouts yet.</div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <ul className="space-y-4">
              {workouts.map((w) => (
                <li
                  key={w.id}
                  className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => openWorkout(w.workout_data)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm text-gray-500">
                        {dateFormatter ? dateFormatter.format(new Date(w.created_at)) : String(w.created_at)}
                      </div>
                      <div className="text-lg font-semibold text-gray-900 mt-1">{w.focus ?? 'Workout'}</div>
                      <div className="text-sm text-gray-600 mt-1">Duration: {w.duration ?? '-' } min</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

