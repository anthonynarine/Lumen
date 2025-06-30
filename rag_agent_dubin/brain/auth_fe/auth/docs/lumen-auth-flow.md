# 🔐 Lumen Authentication Flow – Full System Walkthrough

This document provides a complete overview of the authentication system powering **Lumen**. It explains how user login, token handling, session persistence, and backend verification work together across the frontend and backend services.

---

## 🚀 Flow: Login & Initial Authentication

```
USER → Login Page (Login.tsx)
  │
  └─▶ useAuth Hook (useAuth.ts)
          └─▶ authApi.post("/login/", { email, password }) → Auth API (Heroku)
              ├─ Stores access/refresh tokens via storage.ts
              ├─ Fetches user info via authApi.get("/validate-session/")
              └─ dispatch({ type: "LOGIN_SUCCESS", payload: user }) → AuthContext
```

---

## 💾 Token Storage

**storage.ts** handles secure storage:

* Dev: `localStorage`
* Prod: `secure cookies`

**authApi.ts** attaches `access_token` automatically:

* On every request
* Intercepts 401 errors
* Refreshes using `refresh_token`
* Retries original request

---

## 🔁 Session Restoration

```
App.tsx
  └─▶ AuthProvider
          └─▶ useEffect() on mount
                ├─ Check for existing access_token
                ├─ Check for stored user
                └─ dispatch({ type: "RESTORE_SESSION" })
```

This keeps users logged in across page reloads.

---

## 🔒 Authenticated Requests (Frontend → Backend → Auth API)

```
Frontend → Django Backend → Auth API

1. React sends Authorization: Bearer <access_token>
2. Lumen Backend uses auth_integration.ExternalJWTAuthentication
3. Calls GET https://auth-api.herokuapp.com/api/whoami/
4. If valid, returns:
    {
      id, email, role
    }
5. Populates request.user_claims
6. View permissions use @HasRole("technologist") etc.
```

---

## 🚪 Logout Flow

```
useAuth.logout()
  ├─ clearTokens()
  ├─ dispatch({ type: "LOGOUT" })
  └─ navigate("/login")
```

---

## 🔐 Role-Based Protection (Upcoming)

```
ProtectedRoute.tsx
  ├─ Reads from AuthContext
  ├─ Checks:
      - isAuthenticated
      - user.role === 'admin', 'physician', etc.
  └─ Redirects to /unauthorized or /login
```

---

## 📦 Deployment & Configuration

* ✅ Auth API is deployed on Heroku
* ✅ `.env` includes:

  ```env
  VITE_AUTH_API_URL=https://ant-django-auth-62cf01255868.herokuapp.com/api
  ```
* ✅ Token verification via `auth_integration` package

---

## 🔧 Summary of Components

| Component            | Responsibility                      |
| -------------------- | ----------------------------------- |
| `authApi.ts`         | Axios instance with interceptors    |
| `useAuth.ts`         | Login/logout/register logic         |
| `storage.ts`         | Token storage & retrieval           |
| `AuthContext`        | Global auth state                   |
| `auth_integration`   | Backend token validation            |
| `Auth API (Heroku)`  | Issues/refreshes/validates tokens   |
| `Login.tsx`          | Login form UI (upcoming)            |
| `ProtectedRoute.tsx` | Role-based route control (upcoming) |
| `App.tsx`            | Loads session + routing             |

---

> ✅ This system is modular, scalable, and aligned with security best practices for SPA authentication.
