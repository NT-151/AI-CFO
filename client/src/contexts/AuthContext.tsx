import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  id: string;
  username: string;
  companyName: string | null;
  industry: string | null;
  foundingDate: string | null;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (
    username: string,
    password: string,
    companyName: string
  ) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasConnectedBanks: boolean;
  setHasConnectedBanks: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasConnectedBanks, setHasConnectedBanks] = useState(false);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`/api/auth/me`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Auth check successful:", data.user);
        setUser(data.user);
      } else {
        console.log("Auth check failed - not logged in");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only check auth status once on mount
    console.log("AuthProvider mounted, checking auth status...");
    checkAuthStatus();
  }, []); // Empty dependency array - only run once

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    console.log("Login function called with:", username);
    try {
      const response = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful, setting user:", data.user);
        setUser(data.user);
        // Add a small delay to ensure state updates properly
        await new Promise((resolve) => setTimeout(resolve, 100));
        return true;
      } else {
        console.log("Login failed with status:", response.status);
        return false;
      }
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const register = async (
    username: string,
    password: string,
    companyName: string
  ): Promise<boolean> => {
    console.log("Register function called with:", username, companyName);
    try {
      const response = await fetch(`/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password, companyName }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Registration successful, setting user:", data.user);
        setUser(data.user);
        // Add a small delay to ensure state updates properly
        await new Promise((resolve) => setTimeout(resolve, 100));
        return true;
      } else {
        console.log("Registration failed with status:", response.status);
        return false;
      }
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    }
  };

  const logout = async () => {
    console.log("Logout function called");
    try {
      await fetch(`/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      console.log("Clearing user state");
      setUser(null);
    }
  };

  // Debug: Log when user state changes
  useEffect(() => {
    console.log("User state changed:", user);
  }, [user]);

  // Debug: Log when loading state changes
  useEffect(() => {
    console.log("Loading state changed:", isLoading);
  }, [isLoading]);

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated: !!user,
    hasConnectedBanks,
    setHasConnectedBanks,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
