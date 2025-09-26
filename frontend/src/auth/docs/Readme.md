
Axios Setup in Your Project
1. Two Axios instances

authApi

Base URL = VITE_AUTH_API_URL (Auth API, Heroku-hosted)

Used for login, logout, token refresh, and whoami

❌ No interceptor attached (prevents infinite loops on refresh)

Has refreshAccessToken() helper

examApi

Base URL = VITE_API_URL (Lumen backend, Django)

Used for carotid/renal/etc. exam endpoints

✅ Has authInterceptor attached

2. Interceptor (authInterceptor)

Attached only to examApi, it does:

Request phase

DEV (localStorage strategy):

Reads access_token via getToken()

Adds Authorization: Bearer <token> header

PROD (cookie strategy):

Doesn’t add Authorization header — relies on cookies

Always adds withCredentials: true

Response phase

Captures rotated tokens in DEV (if backend returns access/refresh)

Clears tokens on /logout

Error handler (focus: 401 Unauthorized)

Skips refresh for /login, /token-refresh/, /logout, /whoami (avoids loops)

DEV:

If 401, tries refresh by calling Auth API /token-refresh/ with { refresh }

Stores new access/refresh tokens

Retries the original request

PROD:

If 401, attempts refresh with cookies

If refresh fails, clears state + logs out

Uses a single-flight queue: concurrent requests wait while one refresh happens, then replay

3. Carotid + Exam APIs

All exam-related functions (fetchCarotidTemplate, createCarotidExam, etc.) call examApi

This means they automatically get JWT injection + refresh handling

They don’t directly touch authApi

✅ So the overall flow is:
Frontend calls → examApi → Lumen → Auth integration → Auth API /whoami/
And if access token is expired, the interceptor silently refreshes with /token-refresh/.