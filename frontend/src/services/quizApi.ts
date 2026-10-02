import { fetchApi } from './api';
import { QuizQuestion } from '../types';

export const quizApi = {
  async getOrGenerateQuiz(sessionId: string): Promise<QuizQuestion[]> {
    try {
      // Try to retrieve the existing quiz first
      const quiz = await fetchApi<QuizQuestion[]>(`/sessions/${sessionId}/quiz`);
      return quiz;
    } catch (e: any) {
      // If the quiz hasn't been generated yet (404), trigger the generation
      if (e.statusCode === 404) {
        await fetchApi(`/sessions/${sessionId}/quiz`, { method: 'POST' });
        // After successful generation, fetch it
        return await fetchApi<QuizQuestion[]>(`/sessions/${sessionId}/quiz`);
      }
      throw e;
    }
  },
};
