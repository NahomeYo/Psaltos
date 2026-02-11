import { createContext } from 'react';

export const AuthContext = createContext({
  authenticated: false,
  user: null,
  refresh: async () => {},
  setAuthState: () => {},
});
