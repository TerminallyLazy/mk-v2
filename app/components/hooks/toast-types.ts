export type ActionType = 
  | { type: 'ADD_TOAST'; toast: any }
  | { type: 'UPDATE_TOAST'; toast: any }
  | { type: 'DISMISS_TOAST'; toastId?: string }
  | { type: 'REMOVE_TOAST'; toastId?: string };

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  type?: 'default' | 'success' | 'error' | 'loading';
  duration?: number;
} 