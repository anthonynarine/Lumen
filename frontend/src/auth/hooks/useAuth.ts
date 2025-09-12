// src/auth/hooks/useAuth.ts
// 🔐 React hook for handling all authentication logic (login, logout, register)

import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import authApi from "../../api/authApi";
import { useAuthContext } from "../context/AuthContext";
import { clearTokens, setToken } from "../utils/storage";
import { logger } from "../../utils/logger";
import type { Role, User } from "../types/auth";

/**
 * Login form input
 */
interface LoginInput {
  email: string;
  password: string;
}

/**
 * Registration form input
 */
interface RegisterInput {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
}

/**
 * 🔐 useAuth
 * Custom hook for accessing auth state and performing auth actions.
 * Connects to AuthContext and wraps login/logout/register API logic.
 *
 * @returns Auth functions and state (login, logout, register, error, loading, requires2FA)
 */
export const useAuth = () => {
  const { state, dispatch } = useAuthContext();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  /**
   * Logs in a user
   * - Sends credentials to /login/
   * - Saves access and refresh tokens
   * - Fetches user data from /validate-session/
   * - Updates global auth state
   */
  const login = useCallback(
    async ({ email, password }: LoginInput) => {
      setError(null);
      dispatch({ type: "SET_LOADING", payload: true });

      logger.info("🔐 Attempting login for:", email);

      try {
        const { data: tokenData } = await authApi.post("/login/", {
          email,
          password,
        });

        logger.info("✅ Token response received:", tokenData);

        const { access_token, refresh_token, requires_2fa } = tokenData;

        if (requires_2fa) {
          logger.info("⚠️ 2FA required for:", email);
          dispatch({ type: "REQUIRES_2FA" });
          return;
        }

        logger.info("💾 Storing tokens...");
        setToken("access_token", access_token);
        setToken("refresh_token", refresh_token);

        logger.info("📡 Fetching user from /validate-session/...");
        const { data: user } = await authApi.get("/whoami/");
        logger.info("🙋‍♂️ User profile fetched:", user);

        dispatch({ type: "LOGIN_SUCCESS", payload: user });
        // navigate("/dashboard"); // optional redirect
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
          logger.error("❌ Axios login error:", error.response.status, error.response.data);
          setError(error.response.status === 401 ? "Invalid email or password." : "Something went wrong.");
        } else {
          logger.error("❌ Unexpected login error:", error);
          setError("Unexpected error. Please try again.");
        }

        dispatch({ type: "SET_ERROR", payload: "Login failed" });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
        logger.info("🧹 Login process complete");
      }
    },
    [dispatch, navigate]
  );

  /**
   * Logs out the current user
   * - Clears local tokens
   * - Resets global auth state
   * - Redirects to login page
   */
  const logout = useCallback(() => {
    clearTokens();
    dispatch({ type: "LOGOUT" });
    navigate("/login");
    logger.info("Logged out");
  }, [dispatch, navigate]);

  /**
   * Registers a new user
   * - Sends user data to /register/
   * - On success, auto-logins using the new credentials
   */
  const register = useCallback(
    async (input: RegisterInput) => {
      setError(null);
      dispatch({ type: "SET_LOADING", payload: true });

      try {
        const response = await authApi.post("/register/", input);

        if (response.status === 201) {
          await login({ email: input.email, password: input.password });
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
          const status = error.response.status;
          setError(status === 400 ? "Check your input. Something was invalid." : "Registration error. Try again.");
        } else {
          logger.error("Unexpected registration error:", error);
          setError("Unexpected error. Please try again.");
        }

        dispatch({ type: "SET_ERROR", payload: "Registration failed" });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [dispatch, login]
  );

  return {
    state,
    error,
    login,
    logout,
    register,
    isLoading: state.loading,
    requires2FA: state.requires2FA,
  };
};
