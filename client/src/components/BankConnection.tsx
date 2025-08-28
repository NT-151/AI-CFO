import React from "react";
import { useLocation } from "wouter";
import { useAuth } from "../contexts/AuthContext";

const BankConnection: React.FC = () => {
  const [, setLocation] = useLocation();
  const { setHasConnectedBanks } = useAuth();

  const handleConnectBanks = () => {
    // Navigate to bank selection page
    setLocation("/bank-selection");
  };

  // Hide sidebar for this page
  React.useEffect(() => {
    const sidebar = document.querySelector("[data-sidebar]");
    if (sidebar) {
      (sidebar as HTMLElement).style.display = "none";
    }

    return () => {
      if (sidebar) {
        (sidebar as HTMLElement).style.display = "flex";
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Header */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Connect Your Bank Accounts
          </h1>
          <p className="text-lg text-gray-600">
            Link your financial accounts to get started with AI-powered
            financial insights
          </p>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Real-time Data</h3>
            <p className="text-sm text-gray-600">
              Get up-to-date financial information
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">AI Insights</h3>
            <p className="text-sm text-gray-600">
              Smart analysis of your finances
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">
              Secure & Private
            </h3>
            <p className="text-sm text-gray-600">
              Bank-level security for your data
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleConnectBanks}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 px-8 rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Connect Bank Accounts
          </button>

          <button
            onClick={() => setLocation("/dashboard")}
            className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-200 transition-all duration-200"
          >
            Skip for now
          </button>
        </div>

        {/* Security Note */}
        <div className="mt-8 p-4 bg-blue-50 rounded-xl">
          <div className="flex items-center justify-center text-blue-700">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span className="text-sm font-medium">
              Your financial data is encrypted and secure. We use bank-level
              security protocols.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankConnection;
