# 🔐 Lumen Authentication Flow – Full System Walkthrough (2025)

This document explains how **Lumen’s authentication system** works across the **frontend (React)**, **backend (Django + auth_integration)**, and the centralized **Auth API**.  
It covers login, token handling, session persistence, backend verification, and logout.

---

## 📊 High-Level Diagram

```
[ React Frontend ]
   │
   ├── POST /login/ ───────────────▶ [ Auth API ]
   │                                   ├─ Issues JWT tokens
   │                                   ├─ DEV: returns JSON (access + refresh)
   │                                   └─ PROD: sets HttpOnly cookies
   │
   └── GET /whoami/ ───────────────▶ [ Lumen Backend (Django) ]
                                       │
                                       └─ ExternalJWTAuthentication
                                            │
                                            └── GET /api/me ─────────▶ [ Auth API ]
                                                                       └─ Validates JWT + returns claims
```

---

## 🚀 Flow: Login & Initial Authentication

```
USER → Login Page (Login.tsx)
  │
  └─▶ useAuth Hook (useAuth.ts)
          └─▶ authApi.post("/login/", { email, password })
                  │
                  ├─ DEV: { access_token, refresh_token } → stored in localStorage
                  └─ PROD: HttpOnly cookies set by Auth API
          └─▶ Immediately calls Lumen GET /whoami/ to hydrate user state
```

---

## 💾 Token Handling

**authApi.ts**
- Configured with `withCredentials: true` (cookies auto-sent in prod).  
- Interceptor attaches Bearer header in dev, refreshes tokens on 401.

**Dev Mode**
- `access_token` + `refresh_token` stored in `localStorage`.  
- Axios `Authorization: Bearer …` header added automatically.  

**Prod Mode**
- Tokens **never exposed to JS**.  
- Auth API sets HttpOnly cookies (`SameSite=None; Secure`).  
- Axios sends cookies automatically on requests.

---

## 🔁 Session Restoration (Persistence)

```
App.tsx
  └─▶ AuthProvider (AuthProvider.tsx)
          └─▶ bootstrap() on mount
                ├─ PROD:
                │    - Cookies already stored by browser
                │    - Calls GET /whoami/ → validated via auth_integration
                │    - RESTORE_SESSION(user) if valid
                │
                └─ DEV:
                     - Reads access_token from localStorage
                     - Sets Bearer header on authApi
                     - Calls GET /whoami/ to validate
                     - If valid → RESTORE_SESSION(user)
                     - If 401 → clear tokens + LOGOUT
```

**Boot gate** ensures the app doesn’t render until session restore completes → no “logged-out flash.”

---

## 🔒 Authenticated Requests (Frontend → Lumen → Auth API)

```
React → Lumen Backend (/api/*, /whoami/) → Auth API (/api/me)

1. React sends request:
     - DEV: Authorization: Bearer <access_token>
     - PROD: HttpOnly cookies
2. Lumen’s ExternalJWTAuthentication extracts token/cookies
3. It calls Auth API /api/me to validate
4. If valid, Auth API returns claims (id, email, role, name)
5. Lumen attaches claims to request.user_claims
6. DRF views (e.g. WhoAmIView) return claims or enforce permissions
```

Key point:  
👉 **Frontend never calls `/api/me` directly.**  
👉 Always calls **Lumen’s `/whoami/`**, which delegates validation to Auth API.

---

## 🚪 Logout Flow

```
useAuth.logout()
  ├─ DEV: remove tokens + Authorization header from localStorage
  ├─ PROD: (optional) call /auth/logout to clear HttpOnly cookies
  ├─ dispatch({ type: "LOGOUT" })
  └─ navigate("/login")
```

---

## 🔐 Role-Based Protection (Planned)

```
ProtectedRoute.tsx
  ├─ Reads from AuthContext
  ├─ Checks:
      - isAuthenticated
      - user.role === 'admin' | 'physician' | 'technologist'
  └─ Redirects to /unauthorized or /login
```

---

## 📦 Deployment & Configuration

- **Auth API** deployed on Heroku  
- `.env` in frontend:

  ```env
  VITE_AUTH_API_URL=https://ant-django-auth-62cf01255868.herokuapp.com/api
  ```

- Lumen uses **auth_integration** package to delegate token validation → Auth API.  
- SPA reload safety:
  - Dev: Vite proxy (`/auth`, `/api`, `/rag`, `/images`)  
  - Prod: Django `urls.py` catch-all or Nginx `try_files`  

---

## 🔧 Summary of Key Components

| Component              | Responsibility                                       |
| ---------------------- | ---------------------------------------------------- |
| `authApi.ts`           | Axios instance (`withCredentials: true`, interceptor)|
| `authInterceptor.ts`   | Attaches token, handles refresh + retries            |
| `useAuth.ts`           | Login/logout logic; calls `/login/` and `/whoami/`   |
| `AuthProvider.tsx`     | Boot session restore (prod: cookies, dev: Bearer)    |
| `authReducer.ts`       | Global auth state reducer                            |
| `AuthContext.tsx`      | Provides state/dispatch to components                |
| `auth_integration`     | DRF auth class → calls Auth API `/api/me`            |
| `WhoAmIView`           | Simple DRF view returning `request.user_claims`      |
| `Auth API (Heroku)`    | Issues, refreshes, and validates JWTs                |
| `Login.tsx`            | UI login form → uses `useAuth.login()`               |
| `ProtectedRoute.tsx`   | Planned role-based route guard                       |
| `App.tsx`              | Wraps in AuthProvider; manages routing               |

---

## 📜 Sequence Diagrams

### ✅ Happy Path (Valid Token)

```
User → React (useAuth.login)
React → Auth API: POST /login
Auth API → React: { access_token, refresh_token } OR HttpOnly cookie

React → Lumen: GET /whoami/
Lumen → Auth API: GET /api/me (validate token)
Auth API → Lumen: { id, email, role, name }
Lumen → React: user object
React: RESTORE_SESSION(user)
```

### ❌ Expired Token (Dev Mode)

```
User refreshes page
React (AuthProvider) → Lumen: GET /whoami/ (with expired access_token)
Lumen → Auth API: GET /api/me (token expired)
Auth API → Lumen: 401 Unauthorized
Lumen → React: 401 Unauthorized

Axios Interceptor → React: catches 401
Axios Interceptor → Auth API: POST /refresh (with refresh_token)
Auth API → React: { new access_token }
Axios Interceptor: retries original request
→ Success, session restored
```

### ❌ Expired Token (Prod Mode, HttpOnly)

```
React (AuthProvider) → Lumen: GET /whoami/ (with expired cookie)
Lumen → Auth API: GET /api/me
Auth API → Lumen: 401 Unauthorized
Lumen → React: 401 Unauthorized

React: dispatch(LOGOUT)
User redirected to /login
```

---

✅ With this setup:
- **Login** → goes directly to Auth API.  
- **Hydration & persistence** → always via Lumen `/whoami/`.  
- **Validation** → handled by Lumen’s `auth_integration` talking to Auth API.  
- **Logout** → clears tokens (dev) or cookies (prod).  
- **Interceptors** → handle token refresh in dev; prod just relies on cookies expiring.


Maintained by Anthony Narine + Mitra Singh 🚀