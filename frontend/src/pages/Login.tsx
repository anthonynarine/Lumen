import { useAuth } from "../auth/hooks/useAuth";
import { useState } from "react";
import * as yup from "yup";
import { ValidationError } from "yup";

const schema = yup.object().shape({
	email: yup.string().email("Invalid email").required("Email is required"),
	password: yup
		.string()
		.min(6, "Password must be at least 6 characters")
		.required("Password is required"),
});

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState<{
		email?: string;
		password?: string;
	}>({});

	const { login, logout } = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await schema.validate({ email, password }, { abortEarly: false });
			setErrors({});
			const response = await login({ email, password });
			console.log("Login response:", response);
		} catch (err) {
			if (err instanceof ValidationError && err.inner) {
				const formErrors: { email?: string; password?: string } = {};
				err.inner.forEach((validationError) => {
					formErrors[validationError.path as "email" | "password"] =
						validationError.message;
				});
				setErrors(formErrors);
			}
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="w-full max-w-sm p-8 bg-white rounded shadow">
				<div className="flex justify-center mb-8 text-xl font-bold tracking-tight text-primary hover:text-accent transition">
					<h1>Lumen</h1>
				</div>
				<form className="space-y-6" onSubmit={handleSubmit}>
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-700"
						>
							Email
						</label>
						<input
							id="email"
							name="email"
							type="email"
							autoComplete="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						{errors.email && (
							<span className="text-red-600 text-xs mt-1 block">
								{errors.email}
							</span>
						)}
					</div>
					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-700"
						>
							Password
						</label>
						<input
							id="password"
							name="password"
							type="password"
							autoComplete="current-password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						{errors.password && (
							<span className="text-red-600 text-xs mt-1 block">
								{errors.password}
							</span>
						)}
					</div>
					<button
						type="submit"
						className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
					>
						Login
					</button>
					<button
						onClick={logout}
						className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
						type="button"
					>
						Logout
					</button>
				</form>
			</div>
		</div>
	);
};

export default Login;
