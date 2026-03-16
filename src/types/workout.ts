export interface Exercise {
  id: string;
  name: string;
  muscle_group: string;
  sets: number;
  reps: string;
  rest: string;
  weight?: string;
  tips?: string;
}

export interface Workout {
  day: string;
  focus: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  total_duration: number;
  calories_estimate: number;
  equipment: string[];
  warmup: string;
  cooldown: string;
  exercises: Exercise[];
  notes?: string;
}

export interface GenerateWorkoutBody {
  age: number;
  gender: string;
  height: number;
  weight: number;
  goal: string;
  experience: string;
  workout_duration: number;
  focus: string;
  injuries: string[];
  cardio: string;
  location: string;
  equipment: string[];
  weak_muscles: string[];
  intensity_style: string;
  recovery_level: string;
  days_per_week: number;
  custom_note?: string;
}

