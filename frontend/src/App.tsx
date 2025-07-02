import { Routes, Route, Navigate } from "react-router-dom";
import TestPage from "./pages/TestPage";
// import DashboardPage from "./pages/DashboardPage";
import AppShell from "./layout/AppShell/AppShell";

function App() {
  return (
    <Routes>
      <Route
        path="/test"
        element={
          <AppShell>
            <TestPage />
          </AppShell>
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
