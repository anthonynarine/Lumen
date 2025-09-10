// Filename: src/App.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import TestPage from "./pages/TestPage";
import Dashboard from "./pages/Dashboard";
import AppShell from "./layout/AppShell/AppShell";
import { CarotidExamPage } from "./exams/carotid/pages/CarotidExamPage";
import ProtectedRoute from "./auth/utils/ProtectedRoute";

function App() {
	return (
		<Routes>
			<Route path="/login" element={<Login />} />
			<Route
				path="*"
				element={
					// <ProtectedRoute>
						<AppShell>
							<Routes>
								<Route path="/dashboard" element={<Dashboard />} />
								<Route path="/carotid" element={<CarotidExamPage />} />
								<Route path="/test" element={<TestPage />} />
								<Route
									path="*"
									element={<Navigate to="/dashboard" replace />}
								/>
							</Routes>
						</AppShell>
					// </ProtectedRoute>
				}
			/>
		</Routes>
	);
}

export default App;
