import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

type WorkoutExercise = {
  id: string;
  name: string;
  muscle_group:
    | 'Chest'
    | 'Upper Chest'
    | 'Shoulders'
    | 'Triceps'
    | 'Back'
    | 'Biceps'
    | 'Legs'
    | 'Core'
    | 'Glutes'
    | 'Hamstrings'
    | 'Calves'
    | 'Forearms';
  category: 'compound' | 'isolation';
  priority: number;
  sets: number;
  reps: string;
  rest: string;
  tempo: string;
  weight: 'bodyweight' | 'light' | 'moderate' | 'heavy';
  intensity_hint: string;
  form_cues: string[];
  common_mistakes: string[];
};

type SingleWorkout = {
  day: string;
  focus: string;
  difficulty: Difficulty;
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
  user_feedback_hook?: { difficulty_feedback_request: string };
};

type WeeklyPlan = {
  plan_type: 'weekly';
  days_per_week: number;
  weekly_notes: string;
  workouts: Array<{
    day_number: number;
  } & Omit<SingleWorkout, 'user_feedback_hook'>>;
};

type MonthlyPlan = {
  plan_type: 'monthly_progressive';
  progression_logic: string;
  adaptation_rules: string;
  weeks: Array<{
    week: number;
    focus: string;
    workouts: Array<{
      day_number: number;
    } & Omit<SingleWorkout, 'user_feedback_hook'>>;
    diet: {
      daily_calories: number;
      protein_g: number;
      carbs_g: number;
      fats_g: number;
      sample_meals: string[];
      hydration_ml: number;
      restrictions_note: string;
    };
  }>;
};

type PlanData = SingleWorkout | WeeklyPlan | MonthlyPlan;

function isWeeklyPlan(data: any): data is WeeklyPlan {
  return data?.plan_type === 'weekly' && Array.isArray(data?.workouts);
}

function isMonthlyPlan(data: any): data is MonthlyPlan {
  return data?.plan_type === 'monthly_progressive' && Array.isArray(data?.weeks);
}

function formatWeightBadge(weight: string) {
  const map: Record<string, string> = {
    bodyweight: 'bodyweight',
    light: 'light',
    moderate: 'moderate',
    heavy: 'heavy',
  };
  return map[weight] ?? weight;
}

function SingleWorkoutCard({ workout }: { workout: SingleWorkout }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{workout.day ? `Day: ${workout.day}` : 'Workout'}</h2>
      <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4 border-b pb-3">
        <span>⏱️ {workout.total_duration} min</span>
        <span>🔥 ~{workout.calories_estimate} kcal</span>
        <span>🏋️ {workout.difficulty}</span>
        <span>📌 {workout.summary.total_sets} total sets</span>
      </div>

      <div className="bg-green-50 rounded-xl p-4 mb-4">
        <h3 className="font-bold text-green-800">🤸 Warmup ({workout.warmup.duration} min)</h3>
        <ul className="list-disc list-inside text-sm text-green-700 mt-1">
          {workout.warmup.steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>

      <h3 className="font-bold text-xl mb-3">🏋️ Exercises</h3>
      <div className="space-y-3">
        {workout.exercises.map((ex, idx) => (
          <div key={ex.id ?? idx} className="bg-gray-50 rounded-xl border border-gray-200 p-4">
            <div className="flex justify-between items-start gap-3">
              <div>
                <h4 className="text-lg font-bold text-gray-900">{ex.name}</h4>
                <div className="text-xs text-indigo-700 bg-indigo-50 px-2 py-1 rounded-full inline-block mt-1">
                  {ex.muscle_group}
                </div>
              </div>
              <div className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full whitespace-nowrap">
                {formatWeightBadge(ex.weight)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3 text-sm text-gray-700">
              <div>Sets: {ex.sets}</div>
              <div>Reps: {ex.reps}</div>
              <div>Rest: {ex.rest}</div>
              <div>Tempo: {ex.tempo}</div>
            </div>

            {ex.intensity_hint && <p className="text-sm text-gray-600 mt-2">💡 {ex.intensity_hint}</p>}

            {ex.form_cues?.length ? (
              <div className="mt-3">
                <p className="text-xs font-semibold text-gray-700">Form cues</p>
                <ul className="list-disc list-inside text-xs text-gray-600">
                  {ex.form_cues.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {ex.common_mistakes?.length ? (
              <div className="mt-2">
                <p className="text-xs font-semibold text-gray-700">Common mistakes</p>
                <ul className="list-disc list-inside text-xs text-gray-600">
                  {ex.common_mistakes.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <div className="bg-blue-50 rounded-xl p-4 mt-4">
        <h3 className="font-bold text-blue-800">🧊 Cooldown ({workout.cooldown.duration} min)</h3>
        <ul className="list-disc list-inside text-sm text-blue-700 mt-1">
          {workout.cooldown.steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>

      {workout.notes ? (
        <div className="mt-4 text-sm text-gray-700 bg-gray-100 p-3 rounded-lg">
          <span className="font-semibold">📝 Note:</span> {workout.notes}
        </div>
      ) : null}

      {workout.user_feedback_hook?.difficulty_feedback_request ? (
        <div className="mt-3 text-center text-sm text-gray-500 italic">
          {workout.user_feedback_hook.difficulty_feedback_request}
        </div>
      ) : null}
    </div>
  );
}

function CollapsibleDay({
  title,
  defaultOpen,
  children,
}: {
  title: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-gray-50"
      >
        <div className="text-left font-bold text-gray-900">{title}</div>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open ? <div className="px-4 pb-4">{children}</div> : null}
    </div>
  );
}

export default function PlanRenderer({ plan }: { plan: PlanData }) {
  const isW = useMemo(() => isWeeklyPlan(plan), [plan]);
  const isM = useMemo(() => isMonthlyPlan(plan), [plan]);

  if (isW) {
    const weekly = plan as WeeklyPlan;
    return (
      <div className="space-y-4">
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4">
          <div className="text-sm text-indigo-800 font-semibold">Weekly plan</div>
          <div className="text-gray-700 mt-1">Days per week: {weekly.days_per_week}</div>
          {weekly.weekly_notes ? <div className="text-gray-600 mt-2">{weekly.weekly_notes}</div> : null}
        </div>

        <div className="space-y-3">
          {weekly.workouts.map((w) => (
            <CollapsibleDay
              key={w.day_number}
              defaultOpen={w.day_number === 1}
              title={
                <span>
                  Day {w.day_number}: {w.focus}
                </span>
              }
            >
              <SingleWorkoutCard
                workout={w as any}
              />
            </CollapsibleDay>
          ))}
        </div>
      </div>
    );
  }

  if (isM) {
    const monthly = plan as MonthlyPlan;
    return (
      <div className="space-y-4">
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4">
          <div className="text-sm text-indigo-800 font-semibold">Monthly progressive plan</div>
          <div className="text-gray-700 mt-1">{monthly.progression_logic}</div>
          {monthly.adaptation_rules ? <div className="text-gray-600 mt-2">{monthly.adaptation_rules}</div> : null}
        </div>

        {monthly.weeks.map((week) => (
          <div key={week.week} className="space-y-3">
            <CollapsibleDay
              defaultOpen={week.week === 1}
              title={
                <span>
                  Week {week.week}: {week.focus}
                </span>
              }
            >
              <div className="space-y-3">
                <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                  <div className="text-sm font-bold text-gray-900 mb-2">Diet (Week {week.week})</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-700">
                    <div>Calories: {week.diet.daily_calories} kcal</div>
                    <div>Protein: {week.diet.protein_g} g</div>
                    <div>Carbs: {week.diet.carbs_g} g</div>
                    <div>Fats: {week.diet.fats_g} g</div>
                    <div>Hydration: {week.diet.hydration_ml} ml</div>
                  </div>
                  {week.diet.restrictions_note ? (
                    <div className="text-gray-600 mt-2">{week.diet.restrictions_note}</div>
                  ) : null}
                  <div className="mt-3">
                    <div className="text-xs font-semibold text-gray-700">Sample meals</div>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {week.diet.sample_meals.map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-3">
                  {week.workouts.map((w) => (
                    <SingleWorkoutCard key={w.day_number} workout={w as any} />
                  ))}
                </div>
              </div>
            </CollapsibleDay>
          </div>
        ))}
      </div>
    );
  }

  return <SingleWorkoutCard workout={plan as any} />;
}

