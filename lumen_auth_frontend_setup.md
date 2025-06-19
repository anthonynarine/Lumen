
# 🔐 LUMEN AUTH FRONTEND SETUP (React + Django)

Frontend authentication flow using React, Axios, and Django (Simple JWT). Includes token refresh, role-based access control, and auto session restore.

---

## 📁 Folder Structure

```plaintext
src/
├── auth/
│   ├── axios.js
│   ├── useAuth.jsx
│   └── RoleGate.jsx
├── hooks/useSessionRestore.js
├── routes/PrivateRoute.jsx
├── context/userContext.js
```

---

## 🌍 .env Configuration

```env
REACT_APP_USE_PRODUCTION_API=true
REACT_APP_PRODUCTION_URL=https://ant-django-auth-62cf01255868.herokuapp.com
REACT_APP_DEV_URL=http://localhost:8000
```

---

## 📦 Axios Setup (`src/auth/axios.js`)

```javascript
import axios from "axios";
import Cookies from "js-cookie";

const baseURL =
  process.env.REACT_APP_USE_PRODUCTION_API === "true"
    ? process.env.REACT_APP_PRODUCTION_URL
    : process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_DEV_URL
    : process.env.REACT_APP_PRODUCTION_URL;

const publicAxios = axios.create({ baseURL, withCredentials: true });
const authAxios = axios.create({ baseURL, withCredentials: true });

authAxios.interceptors.request.use((config) => {
  const token = Cookies.get("access_token");
  const csrf = Cookies.get("csrftoken");
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  if (csrf) config.headers["X-CSRFToken"] = csrf;
  config.metadata = { startTime: new Date() };
  return config;
});

authAxios.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = Cookies.get("refresh_token");
      try {
        const { data } = await publicAxios.post("/token-refresh/", { refresh: refreshToken });
        Cookies.set("access_token", data.access);
        originalRequest.headers["Authorization"] = `Bearer ${data.access}`;
        return authAxios(originalRequest);
      } catch (e) {
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export { authAxios, publicAxios };
```

---

## 🔁 useSessionRestore Hook

```javascript
import { useEffect } from "react";
import { authAxios } from "../auth/axios";
import { useUserContext } from "../context/userContext";

const useSessionRestore = () => {
  const { setUser, setIsLoggedIn } = useUserContext();

  useEffect(() => {
    const restore = async () => {
      try {
        const { data } = await authAxios.get("/whoami/");
        setUser(data);
        setIsLoggedIn(true);
      } catch (err) {
        console.warn("Session restore failed:", err);
      }
    };
    restore();
  }, []);
};

export default useSessionRestore;
```

---

## 🔐 PrivateRoute.jsx

```javascript
import { Navigate } from "react-router-dom";
import { useUserContext } from "../context/userContext";

const PrivateRoute = ({ children }) => {
  const { isLoggedIn, authLoaded } = useUserContext();
  if (!authLoaded) return null;
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
```

---

## 🛡️ RoleGate.jsx

```javascript
import { useUserContext } from "../../context/userContext";

const RoleGate = ({ allowedRoles, children, fallback = null }) => {
  const { user } = useUserContext();
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return roles.includes(user?.role) ? children : fallback;
};

export default RoleGate;
```

---

## 🔑 useAuth.jsx

```javascript
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAxios } from "./axios";
import Cookies from "js-cookie";
import { useUserContext } from "../context/userContext";

export const useAuth = () => {
  const { setUser, setIsLoggedIn } = useUserContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const login = useCallback(async ({ email, password }) => {
    setIsLoading(true);
    try {
      const { data } = await authAxios.post("/token/", { email, password });
      Cookies.set("access_token", data.access);
      Cookies.set("refresh_token", data.refresh);
      const { data: userData } = await authAxios.get("/whoami/");
      setUser(userData);
      setIsLoggedIn(true);
      navigate("/");
    } catch (err) {
      setError("Login failed");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    setUser(null);
    setIsLoggedIn(false);
    navigate("/login");
  }, []);

  return { login, logout, isLoading, error };
};
```

---

## 📌 Summary Table

| Feature             | Description                                                                 |
|---------------------|-----------------------------------------------------------------------------|
| Token Management    | Uses `access_token` and `refresh_token` stored in cookies                   |
| Auto Refresh        | Handles 401 errors by attempting a refresh, otherwise logs out              |
| Role-Based UI       | `RoleGate` component restricts content by role                              |
| Protected Routes    | `PrivateRoute` redirects unauthenticated users                              |
| Session Restore     | Checks `/whoami/` on load to recover login session                          |
