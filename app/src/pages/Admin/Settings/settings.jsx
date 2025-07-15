import React from "react";
import { X, User, Info, Grid, ArrowLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import UnauthorizedPage from "../../../components/unauthorized Alert/unAuth";

export default function Settings() {
  const settingsItems = [
    {
      id: 1,
      title: "About Us",
      icon: Info,
      description: "Learn more about our company",
      path: "/admin-settings-about",
    },
    {
      id: 2,
      title: "Profile Settings",
      icon: User,
      description: "Manage your account preferences",
      path: "/admin-settings-profile",
    },
    {
      id: 3,
      title: "Make Collections",
      icon: Grid,
      description: "Create and organize collections",
      path: "/admin-settings-collections",
    },
  ];
  const navigate = useNavigate();

  const isAdmin = JSON.parse(localStorage.getItem("adminCode"));
  if (!isAdmin && isAdmin !== "ADMRAYA1752604097026") {
    return (
      <div>
        <UnauthorizedPage />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with close button and dashboard link */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate("/admin-dash")}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors mr-3"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <span className="text-gray-600 hover:text-gray-800 cursor-pointer">
            Go to Dashboard
          </span>
        </div>

        {/* Main content */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Settings</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Customize your experience and manage your account preferences.
            Configure your settings to make the most out of our platform.
          </p>
        </div>

        {/* First row of settings cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {settingsItems.map((item) => (
            <Link
              to={item.path}
              key={item.id}
              className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-gray-300 cursor-pointer transition-all duration-300 group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <item.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
