const API_BASE_URL = "https://fit-forge-backend.vercel.app/api"
import type { Workout, GenerateWorkoutBody } from '../types/workout';

const api = {
  generateWorkout: async (body: GenerateWorkoutBody): Promise<Workout> => {
    const response = await fetch(`${API_BASE_URL}/generate-workout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // body: JSON.stringify(body),
          body: JSON.stringify(body)

    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  },
};

export type { GenerateWorkoutBody };
export default api;

