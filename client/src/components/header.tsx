import { Button } from "@/components/ui/button";
import { Download, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Export report clicked");
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/login");
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = user?.companyName || user?.username || "User";
  const userInitials = getUserInitials(displayName);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
          <p className="text-gray-600">
            {subtitle || `Welcome back, `}
            <span className="font-medium">{displayName}</span>
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            onClick={handleExport}
            className="bg-google-blue hover:bg-google-blue-dark"
          >
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>

          {/* User Menu */}
          <div className="relative group">
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-10 h-10 bg-google-blue rounded-full flex items-center justify-center">
                <span className="text-white font-medium">{userInitials}</span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {displayName}
                </p>
                <p className="text-xs text-gray-500">{user?.username}</p>
              </div>
            </div>

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="mr-3 h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
