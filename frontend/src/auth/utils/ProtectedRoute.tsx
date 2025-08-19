import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";

type ProtectedRouteProps = {
	children: React.ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
	const { state } = useAuth();

	if (!state.isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	return <>{children}</>;
};

export default ProtectedRoute;
