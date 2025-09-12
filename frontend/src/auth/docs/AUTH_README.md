# 🔐 Lumen Authentication System (Updated)

This document explains the end-to-end authentication flow for the **Lumen** project. It covers both frontend (React/TypeScript) and backend (Django with `auth_integration` delegating to the centralized Auth API).

---

## 🧱 Tech Stack

- **Frontend**: React + TypeScript, Vite, Tailwind  
- **HTTP client**: Axios (`authApi` with `withCredentials: true`)  
- **State**: Context + `useReducer` (`AuthContext`, `AuthProvider`)  
- **Backend**: Django (Lumen app), `auth_integration` package  
- **Auth API**: Centralized microservice (Django/FastAPI) with JWT + 2FA  

---

## 🔁 Flow Overview

### 1. Login
- **Component**: `Login.tsx` calls `useAuth.login()`.
- **Request**: `POST /login/` (to **Auth API**).  
- **Result**:  
  - **Prod**: Auth API sets HttpOnly cookies (`access_token`, `refresh_token`).  
  - **Dev**: Auth API returns tokens in JSON → stored in `localStorage`.

### 2. Bootstrap / Session Restore
- **Component**: `AuthProvider.tsx` (`bootstrap()` effect).  
- **Request**: `GET /whoami/` (to **Lumen server**).  
- **Flow**:  
  1. React calls Lumen `/whoami/`.  
  2. Lumen’s `auth_integration.ExternalJWTAuthentication` extracts the token (cookie in prod, Bearer in dev).  
  3. Lumen forwards token to **Auth API `/api/me/`** for validation.  
  4. Auth API responds with canonical claims (`id`, `role`, `email`, `name`).  
  5. Lumen attaches claims to `request.user_claims` → returned to React.  

### 3. Authenticated Calls
- Frontend calls protected Lumen endpoints (e.g. `/api/exams/`).  
- Lumen again uses `auth_integration` → validates token via Auth API `/api/me/`.  
- If valid → response; if invalid → 401 Unauthorized.

### 4. Logout
- **Hook**: `useAuth.logout()` clears client state.  
- **Dev**: removes tokens from `localStorage`.  
- **Prod**: may also call Auth API `/logout/` to clear cookies.  

---

## 🌐 Environment Behavior

| Environment | Storage         | Boot Strategy                         |
|-------------|-----------------|---------------------------------------|
| **Prod**    | HttpOnly cookies| Call `/whoami/` with cookies attached |
| **Dev**     | localStorage    | Restore Bearer token + validate via `/whoami/` |

---

## 📂 Key Files

| File                          | Purpose                                  |
|-------------------------------|------------------------------------------|
| `authApi.ts`                  | Axios instance (`withCredentials: true`) |
| `authInterceptor.ts`          | Token refresh + 401 handling             |
| `AuthProvider.tsx`            | Boot + global state provider             |
| `authReducer.ts`              | State transitions (`RESTORE_SESSION`, etc.) |
| `useAuth.ts`                  | `login()` and `logout()` hooks           |
| `urls.py` (Django)            | Defines `/whoami/` endpoint              |
| `views.py` (Django)           | `WhoAmIView` returns `request.user_claims` |

---

## 🔌 API Endpoints

### Lumen (Django)
| Endpoint    | Purpose                           |
|-------------|-----------------------------------|
| `/whoami/`  | Validate current session (frontend → Lumen → Auth API) |

### Auth API
| Endpoint       | Purpose                       |
|----------------|-------------------------------|
| `/login/`      | Login, set cookies (prod) or return tokens (dev) |
| `/logout/`     | Clear cookies (prod)          |
| `/api/me/`     | Validate token and return claims (server-to-server) |

---

## ✅ What’s Implemented

- Full login → session bootstrap → authenticated calls → logout  
- Token handling via cookies (prod) or localStorage (dev)  
- Session persistence across reloads/new tabs (boot gate prevents flicker)  
- `auth_integration` ensures Lumen never stores tokens; it delegates to Auth API  

---

Maintained by Anthony Narine + Mitra Singh 🚀
