// Filename: src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import TestPage from "./pages/TestPage";
import Dashboard from "./pages/Dashboard"; // ✅ Make sure this path is correct
import AppShell from "./layout/AppShell/AppShell";

function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppShell>
  );
}

export default App;
