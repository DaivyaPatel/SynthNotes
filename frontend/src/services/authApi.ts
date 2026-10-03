import { fetchApi } from './api';

export const authApi = {
  async signup(username: string, password: string): Promise<{ user_id: string; username: string }> {
    return fetchApi('/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
  },

  async login(username: string, password: string): Promise<{ user_id: string; username: string }> {
    return fetchApi('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
  }
};
