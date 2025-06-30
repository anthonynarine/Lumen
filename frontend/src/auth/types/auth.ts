// src/auth/types/auth.ts

/**
 * Defines the role assigned to a user.
 */
export type Role = "admin" | "physician" | "technologist";

/**
 * Represents a single authenticated user.
 */
export interface User {
    id: string;
    email: string;
    role: Role;
}

/**
 * The shape of global authentication state.
 */
export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    requires2FA: boolean;
}

/**
 * All possible actions that can be dispatched to update AuthState ( 6 options the reducer can respond to)
 */
export type AuthAction =
    | { type: "LOGIN_SUCCESS"; payload: User }             // Successful login
    | { type: "LOGOUT" }                                   // Clear auth state
    | { type: "SET_LOADING"; payload: boolean }            // Toggle loading spinner
    | { type: "SET_ERROR"; payload: string | null }        // Set or clear error message
    | { type: "REQUIRES_2FA" }                             // Indicates 2FA is required
    | { type: "RESTORE_SESSION"; payload: User };          // Hydrate state from storage
