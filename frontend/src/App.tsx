// Filename: src/App.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import TestPage from "./pages/TestPage";
import Dashboard from "./pages/Dashboard"; 
import AppShell from "./layout/AppShell/AppShell";
import { CarotidExamPage } from "./exams/carotid/pages/CarotidExamPage";

function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/carotid" element={<CarotidExamPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppShell>
  );
}

export default App;
