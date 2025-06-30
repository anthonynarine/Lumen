// src/auth/reducer/authReducer.ts

import type { AuthState, AuthAction } from "../types/auth";


export const initialAuthState: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    requires2FA: false,
};

export function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case "LOGIN_SUCCESS":
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                loading: false,
                error: null,
                requires2FA: false,
            };
        case "LOGOUT":
            return {
            ...initialAuthState,
            };
        case "SET_LOADING":
            return {
                ...state,
                loading: action.payload,
            };
        case "SET_ERROR":
            return {
                ...state,
                error: action.payload,
            };
        case "REQUIRES_2FA":
            return {
                ...state,
                requires2FA: true,
                loading: false,
                };
        case "RESTORE_SESSION":
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                loading: false,
            };
        default:
            return state;
    }
}
