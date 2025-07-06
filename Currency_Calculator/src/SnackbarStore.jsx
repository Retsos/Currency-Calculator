import { create } from 'zustand';

export const useSnackbarStore = create((set) => ({
  open: false,
  message: '',
  severity: 'info',

  showSnackbar: (message, severity = 'info') => {
    set({ open: true, message, severity });
  },
  closeSnackbar: () => {
    set({ open: false, message: '', severity: 'info' });
  },
}));
