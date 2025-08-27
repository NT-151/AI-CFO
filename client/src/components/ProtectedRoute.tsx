import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  // Debug logging
  useEffect(() => {
    console.log("ProtectedRoute state changed:", {
      isAuthenticated,
      isLoading,
    });
  }, [isAuthenticated, isLoading]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    console.log("ProtectedRoute: Showing loading spinner");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log("ProtectedRoute: User not authenticated, redirecting to login");
    setLocation("/login");
    return null;
  }

  // Render protected content if authenticated
  console.log("ProtectedRoute: User authenticated, rendering content");
  return <>{children}</>;
}
