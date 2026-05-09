import type { Workout, GenerateWorkoutBody } from '../types/workout';
const API_BASE_URL = "https://fit-forge-backend.vercel.app/api"
// const API_BASE_URL = "http://localhost:3001";
const api = {
  generateWorkout: async (body: GenerateWorkoutBody, opts?: { accessToken?: string; userId?: string }): Promise<Workout> => {
    const response = await fetch(`${API_BASE_URL}/generate-workout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(opts?.accessToken ? { Authorization: `Bearer ${opts.accessToken}` } : {}),
      },
      body: JSON.stringify({ ...body, ...(opts?.accessToken ? { access_token: opts.accessToken } : {}), ...(opts?.userId ? { user_id: opts.userId } : {}) })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  },
};

export type { GenerateWorkoutBody };
export default api;

