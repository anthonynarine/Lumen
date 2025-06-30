// src/auth/__dev__/AuthTester.tsx
import { useAuth } from "../hooks/useAuth";

/**
 * A temporary component for testing login, logout, and registration
 * without a UI — directly calls useAuth() and displays current auth state.
 */
export const AuthTester = () => {
  const {
    login,
    logout,
    register,
    error,
    isLoading,
    requires2FA,
    state: { user },
  } = useAuth();

  const testEmail = "newuser@example.com";
  const testPassword = "password123";

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h2>🧪 Auth Tester</h2>

      <div style={{ marginBottom: "1rem" }}>
        <button
          onClick={() =>
            login({
              email: testEmail,
              password: testPassword,
            })
          }
        >
          🔐 Login
        </button>

        <button onClick={() => logout()} style={{ marginLeft: "1rem" }}>
          🚪 Logout
        </button>

        <button
          onClick={() =>
            register({
              email: testEmail,
              password: testPassword,
              password_confirm: testPassword, // required for your Auth API
              first_name: "New",
              last_name: "User",
            })
          }
          style={{ marginLeft: "1rem" }}
        >
          📝 Register
        </button>
      </div>

      {isLoading && <p>⏳ Loading...</p>}
      {error && <p style={{ color: "red" }}>❌ {error}</p>}
      {requires2FA && <p style={{ color: "orange" }}>⚠️ 2FA Required</p>}

      {user ? (
        <div style={{ marginTop: "1rem" }}>
          <h3>👤 Logged In User:</h3>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
      ) : (
        <p>🙅 No user logged in</p>
      )}
    </div>
  );
};
