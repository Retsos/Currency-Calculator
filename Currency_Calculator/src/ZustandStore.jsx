import { create } from 'zustand';
import api from './api';
import { useSnackbarStore } from './SnackbarStore';

export const useAuthStore = create((set) => ({
  token: localStorage.getItem('Token'),
  username: localStorage.getItem('Username'),
  isLoading: false,
  error: null,
  justLoggedIn: false, // Flag για να ξεχωρίζουμε το "φρέσκο" login

  login: async (username, password) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.post('/api/auth/login', { username, password });
      const { token, username: returnedUsername } = response.data;

      localStorage.setItem('Token', token);
      localStorage.setItem('Username', returnedUsername);

      set({
        token,
        username: returnedUsername,
        isLoading: false,
        error: null,
        justLoggedIn: true,
      });

      useSnackbarStore.getState().showSnackbar('Login successful!', 'success');
    } catch (err) {
      let msg = 'Login failed';
      if (err.response?.data?.message) {
        msg = err.response.data.message;
      }

      localStorage.removeItem('Token');
      localStorage.removeItem('Username');

      set({
        token: null,
        username: null,
        isLoading: false,
        error: msg,
      });
    }
  },

  register: async (username, password) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.post('/api/auth/register', { username, password });
      const { token, username: returnedUsername } = response.data;

      localStorage.setItem('Token', token);
      localStorage.setItem('Username', returnedUsername);

      set({
        token,
        username: returnedUsername,
        isLoading: false,
        error: null,
        justLoggedIn: true,
      });

      useSnackbarStore.getState().showSnackbar('Registration successful! You are now logged in.');
    } catch (err) {
      let msg = 'Registration failed';
      if (err.response?.data?.message) {
        msg = err.response.data.message;
      }

      localStorage.removeItem('Token');
      localStorage.removeItem('Username');

      set({
        token: null,
        username: null,
        isLoading: false,
        error: msg,
      });
    }
  },

  logout: () => {
    localStorage.removeItem('Token');
    localStorage.removeItem('Username');
    set({
      token: null,
      username: null,
      isLoading: false,
      error: null,
      justLoggedIn: false,
    });
      useSnackbarStore.getState().showSnackbar('Logout successful!','error');

  },

  // "Καταναλώνει" το flag ώστε να μην ξανα-ενεργοποιηθεί η λογική
  consumeJustLoggedIn: () => set({ justLoggedIn: false }),

  clearError: () => set({ error: null }),
}));
