// src/auth/context/AuthProvider.tsx
/**
 * AuthProvider
 * ------------
 * Global provider that manages authenticated user state for Lumen.
 *
 * RATIONALE
 * - React state is ephemeral. On hard reload/new tab, we must rehydrate auth.
 * - In PROD, we use HttpOnly cookies. JS cannot read them, so the *only* secure
 *   way to verify the session is to ask the server: GET /whoami/.
 * - In DEV, we use Bearer tokens in localStorage for convenience/visibility.
 *   On boot, we restore the token, prime the Authorization header, and VERIFY
 *   it by calling GET /whoami/ (do not blindly trust the mirrored user).
 *
 * BOOT FLOW
 * - PROD:
 *    1) Browser already has HttpOnly cookies if logged in (set by login response).
 *    2) Call /whoami/ (cookies sent automatically via authApi.withCredentials).
 *    3) If 200 -> RESTORE_SESSION(user). If 401 -> LOGOUT.
 *
 * - DEV:
 *    1) Read access_token from localStorage; set Authorization header if present.
 *    2) Call /whoami/ to validate token and fetch canonical user.
 *    3) If 200 -> mirror user + RESTORE_SESSION. If 401 -> clear tokens + LOGOUT.
 *
 * BOOT GATE
 * - Children are not rendered until the restore attempt completes, preventing
 *   a "logged-out flash" or route guards from firing on empty state.
 *
 * LOCAL STORAGE SYNC
 * - Mirrors the current user in localStorage (useful for fast dev boot).
 * - Safe in prod; server remains the source of truth via /whoami/.
 */

import { useEffect, useReducer, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "../types/auth";
import { AuthContext } from "./AuthContext";
import { authReducer, initialAuthState } from "../reducer/authReducer";
import authApi from "../../api/authApi";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  // Gate to prevent UI rendering until bootstrap finishes
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    /**
     * bootstrap()
     * Attempt to restore an authenticated session at app start.
     * - PROD: trust server-side cookies; ask "who am I?" via /whoami/.
     * - DEV: restore Bearer token, then verify via /whoami/.
     */
    let cancelled = false;

    const bootstrap = async () => {
      try {
        if (import.meta.env.PROD) {
          // ── PROD STRATEGY (HttpOnly cookies) ────────────────────────────────
          // NOTE: authApi was created with withCredentials: true,
          // so cookies are included automatically on every request.
          const { data } = await authApi.get<User>("/whoami/");
          console.log("🙋‍♂️ /whoami/ response:", data);
          if (cancelled) return;
          dispatch({ type: "RESTORE_SESSION", payload: data });
        } else {
          // ── DEV STRATEGY (Bearer token + validation) ───────────────────────
          const token = localStorage.getItem("access_token");

          if (token) {
            // Prime Axios so subsequent calls include the Bearer token
            authApi.defaults.headers.common.Authorization = `Bearer ${token}`;

            try {
              // Validate token and get canonical user from server
              const { data: user } = await authApi.get<User>("/whoami/");
              if (cancelled) return;

              // Prefer server truth; also mirror for convenience
              localStorage.setItem("user", JSON.stringify(user));
              dispatch({ type: "RESTORE_SESSION", payload: user });
            } catch {
              // Token is stale/invalid → full client cleanup
              delete authApi.defaults.headers.common.Authorization;
              localStorage.removeItem("access_token");
              localStorage.removeItem("refresh_token");
              localStorage.removeItem("user");
              if (!cancelled) dispatch({ type: "LOGOUT" });
            }
          } else {
            // No token; ensure logged-out state and clear any stale mirrors
            localStorage.removeItem("user");
            if (!cancelled) dispatch({ type: "LOGOUT" });
          }
        }
      } catch {
        // Any failure (expired/invalid/revoked) -> logged-out state
        if (!cancelled) dispatch({ type: "LOGOUT" });
      } finally {
        if (!cancelled) setBooting(false); // Unblock rendering
      }
    };

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    /**
     * Persist/mirror user in localStorage when authenticated.
     * - In DEV, this accelerates boot. In PROD, harmless mirror.
     */
    if (state.user && state.isAuthenticated) {
      localStorage.setItem("user", JSON.stringify(state.user));
    } else {
      localStorage.removeItem("user");
    }
  }, [state.user, state.isAuthenticated]);

  // ── BOOT GATE: don't render app until session restore attempt completes ──
  if (booting) return null; // or a minimal splash / skeleton

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
