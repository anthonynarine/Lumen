# 🔐 Lumen Frontend Authentication System

This document explains the end-to-end frontend authentication flow for the Lumen project using React, TypeScript, and JWT-based login via the centralized Auth API.

---

## 🧱 Tech Stack

- React + TypeScript
- Axios (custom instance `authApi`)
- Context + useReducer (`AuthContext`)
- Token storage (cookie or localStorage)
- Vite + `.env` for environment configs
- Auth API (Django + JWT + 2FA)

---

## 🔁 Flow Overview

1. User submits login form via `useAuth.ts`
2. Request sent to `/api/login/` on Auth API
3. If 2FA required, UI is redirected to `/2fa`
4. Otherwise:
   - Tokens are saved (`access`, `refresh`)
   - Profile is fetched via `/api/validate-session/` (or `/api/whoami/`)
   - `LOGIN_SUCCESS` is dispatched to `AuthContext`
5. Protected routes and role-aware components update

---

## 🌐 Environment Setup

Set the following in your `.env`:

```
REACT_APP_AUTH_API_URL=https://ant-django-auth-62cf01255868.herokuapp.com/api
```

Used by `authApi.ts` as the Axios `baseURL`.

---

## 🔌 API Endpoints (from Django `user.urls`)

| Endpoint                 | Purpose                    |
|--------------------------|----------------------------|
| `/api/register/`         | Create new user            |
| `/api/login/`            | Standard login             |
| `/api/two-factor-login/` | Login requiring 2FA        |
| `/api/token-refresh/`    | Refresh access token       |
| `/api/logout/`           | Invalidate session         |
| `/api/validate-session/` | Get current user info      |
| `/api/whoami/`           | Simple identity test       |
| `/api/generate-qr/`      | Setup 2FA QR code          |
| `/api/verify-otp/`       | Verify 2FA setup           |
| `/api/user/toggle-2fa/`  | Enable/disable 2FA         |
| `/api/forgot-password/`  | Send reset link via email  |
| `/api/reset-password/`   | Reset password with token  |

---

## 🔐 Token Storage

| Token         | Location         | Notes                            |
|---------------|------------------|----------------------------------|
| `access_token`| cookie or storage| Short-lived, for auth headers    |
| `refresh_token`| cookie or storage| Longer-lived, used to refresh    |

> In production, cookies are used. In development, localStorage is used.

---

## 🧠 Key Files

| File                          | Purpose                            |
|-------------------------------|------------------------------------|
| `authApi.ts`                  | Axios instance with interceptors   |
| `AuthContext.tsx`             | Global auth state provider         |
| `authReducer.ts`              | Handles state transitions          |
| `storage.ts`                  | Token handling helpers             |
| `useAuth.ts`                  | Login, register, logout logic      |

---

## ✅ What’s Implemented

- JWT login with access + refresh token flow
- Auto-refresh on 401 errors
- Full reducer + global context state
- Logout, register, and optional 2FA redirection
- Session restoration on page reload

---

## 🔜 Coming Soon (Planned)

- 2FA verification UI via `/verify-otp/`
- Forgot/reset password flows
- ProtectedRoute component for auth + role checks

---

Maintained by Anthony Narine 🚀