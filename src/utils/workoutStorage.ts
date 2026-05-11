// utils/workoutStorage.ts
export interface WorkoutPlan {
  // your workout type – you can leave as 'any' or copy your exact type
  title: string;
  // ... other fields
}

export function saveWorkout(workout: any) {
  localStorage.setItem('fitforge:lastWorkout', JSON.stringify(workout));
}

export function getWorkout(): any | null {
  const raw = localStorage.getItem('fitforge:lastWorkout');
  return raw ? JSON.parse(raw) : null;
}

export function clearWorkout() {
  localStorage.removeItem('fitforge:lastWorkout');
}