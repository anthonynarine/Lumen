// src/auth/hooks/useAuth.ts
// 🔐 Provides login, logout, and registration logic for the AuthContext

import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import authApi from "../../api/authApi";
import { useAuthContext } from "../context/AuthContext";
import { clearTokens, setToken } from "../utils/storage";
import { logger } from "../../utils/logger";
import type { Role, User } from "../types/auth";

interface LoginInput {
    email: string;
    password: string;
}

interface RegisterInput {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
}

/**
 * Custom hook for handling authentication logic.
 * @returns Object with login, logout, register functions and auth state
 */
export const useAuth = () => {
    const { state, dispatch } = useAuthContext();
    const navigate = useNavigate();

    const [error, setError] = useState<string | null>(null);

    /**
     * Login handler
     * - Sends credentials to `/token/`
     * - Handles 2FA redirect if required
     * - Stores tokens and fetches user from `/whoami/`
     */
    const login = useCallback(
        async ({ email, password }: LoginInput) => {
        setError(null);
        dispatch({ type: "SET_LOADING", payload: true });

        try {
            const { data: tokenData } = await authApi.post("/token/", {
                email,
                password,
            });

            const { access, refresh, requires_2fa } = tokenData;

            if (requires_2fa) {
                dispatch({ type: "REQUIRES_2FA" });
                return;
            }

            setToken("access_token", access);
            setToken("refresh_token", refresh);

            const { data: user }: { data: User } = await authApi.get("/whoami/");
            dispatch({ type: "LOGIN_SUCCESS", payload: user });

            // Optionally redirect
            // navigate("/dashboard");
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
            const status = error.response.status;

            if (status === 401) {
                setError("Invalid email or password.");
            } else {
                setError("Something went wrong. Please try again.");
            }
            } else {
                logger.error("Unexpected login error:", error);
                setError("Unexpected error. Please try again.");
            }

            dispatch({ type: "SET_ERROR", payload: "Login failed" });
        } finally {
            dispatch({ type: "SET_LOADING", payload: false });
            }
        },[dispatch, navigate]);

    /**
     * Logout handler
     * - Clears tokens
     * - Resets global auth state
     * - Redirects to login
     */
    const logout = useCallback(() => {
        clearTokens();
        dispatch({ type: "LOGOUT" });
        navigate("/login");
    }, [dispatch, navigate]);

    /**
     * Registration handler
     * - Submits new user data to `/users/`
     * - Auto-logs in on success
     */
    const register = useCallback(
        async (input: RegisterInput) => {
        setError(null);
        dispatch({ type: "SET_LOADING", payload: true });

        try {
            const response = await authApi.post("/users/", input);

            if (response.status === 201) {
            await login({ email: input.email, password: input.password });
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
            const status = error.response.status;

            if (status === 400) {
                setError("Check your input. Something was invalid.");
            } else {
                setError("Registration error. Try again.");
                }
            } else {
                    
                logger.error("Unexpected registration error:", error);
                setError("Unexpected error. Please try again.");
            }

            dispatch({ type: "SET_ERROR", payload: "Registration failed" });
        } finally {
            dispatch({ type: "SET_LOADING", payload: false });
            }
        },[dispatch, login]);

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
