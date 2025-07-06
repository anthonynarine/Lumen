// Filename: src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import TestPage from "./pages/TestPage";
import Dashboard from "./pages/Dashboard"; // ✅ Make sure this path is correct
import AppShell from "./layout/AppShell/AppShell";
import TestBox from "./pages/TestBox";

function App() {
  return (
    <Routes>
      {/* ✅ Dashboard route wrapped in AppShell */}
      <Route path="/dashboard" element={<Dashboard />}/>
      <Route path="/test/box" element={<TestBox />} />

      {/* Test route */}
      <Route
        path="/test"
        element={
          <AppShell>
            <TestPage />
          </AppShell>
        }
      />

      {/* Redirect all other routes to /dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
