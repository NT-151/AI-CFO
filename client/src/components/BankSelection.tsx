import React, { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../contexts/AuthContext";
import {
  Building2,
  CreditCard,
  Shield,
  ArrowLeft,
  Search,
  CheckCircle,
} from "lucide-react";

// Import bank logos
import hsbcLogo from "../../../logos/hsbc.jpg";
import monzoLogo from "../../../logos/monzo.jpg";
import barclaysLogo from "../../../logos/barclays.jpg";

interface Bank {
  id: string;
  name: string;
  logo: string;
  description: string;
  features: string[];
  popular: boolean;
}

const banks: Bank[] = [
  {
    id: "hsbc",
    name: "HSBC",
    logo: hsbcLogo,
    description:
      "One of the largest banks in the US with comprehensive financial services",
    features: [
      "Online Banking",
      "Mobile App",
      "Credit Cards",
      "Investment Services",
    ],
    popular: true,
  },
  {
    id: "monzo",
    name: "Monzo",
    logo: monzoLogo,
    description:
      "Full-service financial institution serving individuals and businesses",
    features: [
      "Checking & Savings",
      "Credit Cards",
      "Loans",
      "Investment Solutions",
    ],
    popular: true,
  },
  {
    id: "barclays",
    name: "Barclays",
    logo: barclaysLogo,
    description:
      "Diversified financial services company with strong retail banking",
    features: [
      "Personal Banking",
      "Business Banking",
      "Wealth Management",
      "Insurance",
    ],
    popular: true,
  },
];

const BankSelection: React.FC = () => {
  const [, setLocation] = useLocation();
  const { setHasConnectedBanks } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBank, setSelectedBank] = useState<string | null>(null);

  const filteredBanks = banks.filter((bank) =>
    bank.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBankSelect = (bankId: string) => {
    setSelectedBank(bankId);

    // Bank website URLs
    const bankUrls = {
      hsbc: "https://www.hsbc.co.uk/",
      monzo: "https://monzo.com/",
      barclays: "https://www.barclays.co.uk/",
    };

    // Open bank website in new tab
    const bankUrl = bankUrls[bankId as keyof typeof bankUrls];
    if (bankUrl) {
      window.open(bankUrl, "_blank");
    }

    // Redirect to dashboard after a short delay
    setTimeout(() => {
      setHasConnectedBanks(true);
      setLocation("/dashboard");
    }, 1500);
  };

  const handleBack = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={handleBack}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Bank Connection
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Choose Your Bank
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select your bank to securely connect your accounts and start getting
            AI-powered financial insights
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for your bank..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Popular Banks Section */}
        {!searchTerm && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Star className="w-6 h-6 text-yellow-500 mr-2" />
              Popular Banks
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {banks
                .filter((bank) => bank.popular)
                .map((bank) => (
                  <BankCard
                    key={bank.id}
                    bank={bank}
                    onSelect={handleBankSelect}
                    isSelected={selectedBank === bank.id}
                  />
                ))}
            </div>
          </div>
        )}

        {/* Connection Status */}
        {selectedBank && (
          <div className="fixed bottom-8 right-8 bg-white rounded-xl shadow-lg p-6 border border-gray-200 max-w-sm">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <div>
                <p className="font-semibold text-gray-900">
                  Connecting to {banks.find((b) => b.id === selectedBank)?.name}
                  ...
                </p>
                <p className="text-sm text-gray-600">
                  Please complete the authentication process
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Bank Card Component
const BankCard: React.FC<{
  bank: Bank;
  onSelect: (bankId: string) => void;
  isSelected: boolean;
}> = ({ bank, onSelect, isSelected }) => {
  return (
    <div
      className={`relative bg-white rounded-xl shadow-sm border-2 transition-all duration-200 cursor-pointer hover:shadow-md overflow-hidden ${
        isSelected
          ? "border-blue-500 ring-2 ring-blue-200"
          : "border-gray-200 hover:border-blue-300"
      }`}
      onClick={() => onSelect(bank.id)}
      style={{ aspectRatio: "4/3" }}
    >
      {/* Bank Logo Image */}
      <div className="w-full h-full relative">
        <img
          src={bank.logo}
          alt={bank.name}
          className="w-full h-full object-contain p-2 bg-gray-50"
        />

        {/* Popular Badge */}
        {bank.popular && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
              Popular
            </span>
          </div>
        )}

        {/* Selection Indicator */}
        {isSelected && (
          <div className="absolute top-3 right-3">
            <CheckCircle className="w-6 h-6 text-blue-600 bg-white rounded-full" />
          </div>
        )}

        {/* Bank Name Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="font-semibold text-white text-lg">{bank.name}</h3>
        </div>
      </div>

      {/* Connecting Overlay */}
      {isSelected && (
        <div className="absolute inset-0 bg-blue-600/90 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p className="font-medium">Connecting...</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Star icon component
const Star: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export default BankSelection;
