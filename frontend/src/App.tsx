// src/App.tsx
import { AuthProvider } from "./auth/context/AuthProvider";
import { AuthTester } from "./auth/utils/TestAuth";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <main className="app-shell">
        <header>
          <h1>Lumen</h1>
          <p>Vascular Reporting Platform — Under Construction 🚧</p>
        </header>

        <section className="auth-dev">
          <AuthTester />
        </section>

        <footer>
          <p style={{ fontSize: "0.875rem", color: "#888" }}>
            Auth system live — routing & UI coming next.
          </p>
        </footer>
      </main>
    </AuthProvider>
  );
}

export default App;
