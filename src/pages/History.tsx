import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthContext } from '../context/AuthContext';

type WorkoutRow = {
  id: string;
  created_at: string;
  focus: string | null;
  duration: number | null;
  workout_data: any;
};

export default function History() {
  const navigate = useNavigate();
  const { session, loading: authLoading } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [workouts, setWorkouts] = useState<WorkoutRow[]>([]);

  useEffect(() => {
    if (authLoading) return;
    if (!session) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    async function loadHistory() {
      setLoading(true);
      setError('');
      try {
        const { data, error: fetchError } = await supabase
          .from('workouts')
          .select('id, created_at, focus, duration, workout_data')
          .eq('user_id', session?.user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (fetchError) throw fetchError;
        if (!cancelled) setWorkouts(data || []);
      } catch (err: any) {
        if (!cancelled) setError(err.message || 'Failed to load history');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadHistory();
    return () => { cancelled = true; };
  }, [session, authLoading]);

  const openWorkout = (workout: any) => {
    localStorage.setItem('fitforge:lastWorkout', JSON.stringify(workout));
    navigate('/result');
  };

  // Not logged in
  if (!authLoading && !session) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-black mb-3">History</h1>
          <p className="text-gray-400 mb-6">Please log in to view your workout history.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-[#C8F135] text-black font-bold px-6 py-2 rounded-full text-sm uppercase tracking-wider hover:bg-[#d4ff3e] transition"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-gray-500">Loading history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
          {error}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-[#C8F135] hover:underline text-sm"
        >
          Try again
        </button>
      </div>
    );
  }

  if (workouts.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-black mb-3">No workouts yet</h1>
          <p className="text-gray-400 mb-6">Generate your first workout to see it here.</p>
          <button
            onClick={() => navigate('/workout')}
            className="bg-[#C8F135] text-black font-bold px-6 py-2 rounded-full text-sm uppercase tracking-wider hover:bg-[#d4ff3e] transition"
          >
            Generate Workout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="pt-[120px] md:pt-[120px]" />
      <main className="max-w-4xl mx-auto px-5 pb-20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            WORKOUT HISTORY
          </h1>
          <p className="text-gray-400 text-sm mt-1">Your past generated workouts</p>
        </div>
        <div className="space-y-3">
          {workouts.map((workout) => {
            const date = new Date(workout.created_at);
            const formattedDate = date.toLocaleDateString(undefined, {
              year: 'numeric', month: 'short', day: 'numeric',
            });
            const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return (
              <button
                key={workout.id}
                onClick={() => openWorkout(workout.workout_data)}
                className="w-full text-left bg-gray-900/50 border border-gray-800 rounded-xl p-4 hover:border-[#C8F135]/50 transition-all hover:bg-gray-900/70"
              >
                <div className="flex flex-wrap justify-between items-start gap-3">
                  <div>
                    <div className="text-xs font-mono text-gray-500">
                      {formattedDate} at {formattedTime}
                    </div>
                    <div className="text-lg font-bold mt-1">
                      {workout.focus || 'Workout'}
                    </div>
                    {workout.duration && (
                      <div className="text-sm text-gray-400 mt-1">
                        ⏱ {workout.duration} min
                      </div>
                    )}
                  </div>
                  <div className="text-xs font-mono text-[#C8F135] border border-[#C8F135]/30 px-2 py-1 rounded-full">
                    View →
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}