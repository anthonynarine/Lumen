// src/auth/context/AuthProvider.tsx

import { useEffect, useReducer } from "react";
import Cookies from "js-cookie";
import { authReducer, initialAuthState } from "../reducer/authReducer";
import type { ReactNode } from "react";
import type { User } from "../types/auth";
import { logger } from "../../utils/logger";
import { AuthContext } from "./AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  useEffect(() => {
    const token = import.meta.env.PROD
      ? Cookies.get("access_token")
      : localStorage.getItem("access_token");

    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      try {
        const parsed = JSON.parse(storedUser) as User;
        dispatch({ type: "RESTORE_SESSION", payload: parsed });
        logger.info("✅ Session restored");
      } catch (e) {
        logger.error("❌ Failed to parse session", e);
      }
    }
  }, []);

  useEffect(() => {
    if (state.user && state.isAuthenticated) {
      localStorage.setItem("user", JSON.stringify(state.user));
    } else {
      localStorage.removeItem("user");
    }
  }, [state.user, state.isAuthenticated]);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
