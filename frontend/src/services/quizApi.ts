import { fetchApi } from './api';
import { QuizQuestion } from '../types';

export const quizApi = {
  async getOrGenerateQuiz(sessionId: string): Promise<QuizQuestion[]> {
    try {
      const response = await fetchApi<any>(`/sessions/${sessionId}/quiz`);
      return Array.isArray(response) ? response : response.quiz;
    } catch (e: any) {
      if (e.statusCode === 404) {
        await fetchApi(`/sessions/${sessionId}/quiz`, { method: 'POST' });
        const response = await fetchApi<any>(`/sessions/${sessionId}/quiz`);
        return Array.isArray(response) ? response : response.quiz;
      }
      throw e;
    }
  },
};
