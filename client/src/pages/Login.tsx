import React, { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [, setLocation] = useLocation();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("=== LOGIN ATTEMPT STARTED ===");
    console.log("Current form state:", {
      username,
      password: "***",
      isLoading,
      error,
    });

    // Don't clear fields immediately - wait for success
    if (isLoading) {
      console.log("Login already in progress, ignoring");
      return; // Prevent double submission
    }

    console.log("Setting loading state to true");
    setIsLoading(true);
    setError("");

    try {
      console.log("Calling login function...");
      const success = await login(username, password);
      console.log("Login function returned:", success);

      if (success) {
        console.log("Login successful, clearing fields and redirecting");
        // Only clear fields and redirect on successful login
        setUsername("");
        setPassword("");
        console.log("Fields cleared, redirecting to dashboard");
        setLocation("/");
      } else {
        console.log("Login failed, showing error");
        setError("Invalid username or password");
        // Don't clear password on failed login for better UX
        setPassword("");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed. Please try again.");
      // Don't clear fields on network error
    } finally {
      console.log("Setting loading state to false");
      setIsLoading(false);
    }
  };

  // Debug: Log when component re-renders
  console.log("Login component render:", {
    username,
    password: "***",
    isLoading,
    error,
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            FynCo
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Your AI-powered financial intelligence platform
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                disabled={isLoading}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => {
                  console.log("Username input changed to:", e.target.value);
                  setUsername(e.target.value);
                }}
              />
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
                required
                disabled={isLoading}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  console.log("Password input changed to:", e.target.value);
                  setPassword(e.target.value);
                }}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                type="button"
                disabled={isLoading}
                onClick={() => setLocation("/register")}
                className="font-medium text-indigo-600 hover:text-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sign up here
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
