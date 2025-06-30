// src/auth/context/AuthContext.tsx

import { createContext, useContext } from "react";
import type { AuthState, AuthAction } from "../types/auth";
import type { Dispatch } from "react";

interface AuthContextValue {
  state: AuthState;
  dispatch: Dispatch<AuthAction>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuthContext = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }

  return context;
};
