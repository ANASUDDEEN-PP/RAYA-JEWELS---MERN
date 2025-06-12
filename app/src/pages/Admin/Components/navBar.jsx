import React, { useState } from 'react'; // No need for { Component } if you're using functional components
import {
  Home,
  Users,
  Package,
  ShoppingCart,
  Grid,
  UserCheck,
  Menu,
  X,
  User,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Navbar Component
const Navbar = ({ toggleSidebar }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  // --- START: Added handleLogout function ---
  const handleLogout = () => {
    console.log("User logged out");
    // Clear relevant data from localStorage
    localStorage.removeItem('adminCode');
    navigate('/auth')
    // Close the profile dropdown
    setIsProfileOpen(false);

    // You might also want to redirect the user to a login page
    // For example, if you're using React Router:
    // history.push('/login');
    // Or simply reload the page to clear all state:
    // window.location.reload();
  };
  // --- END: Added handleLogout function ---

  const profileMenuItems = [
    // { icon: User, label: 'Profile Details', onClick: () => console.log('Profile Details clicked') },
    { icon: Settings, label: 'Settings', onClick: () => navigate('/admin-settings') },
    { icon: HelpCircle, label: 'Help', onClick: () => console.log('Help clicked') },
    // --- START: Modified Logout item to use handleLogout ---
    { icon: LogOut, label: 'Logout', className: 'text-red-600 hover:text-red-700', onClick: handleLogout },
    // --- END: Modified Logout item ---
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-gray-600 hover:text-gray-900"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Raya</h1>
        </div>

        {/* Right Side - Profile */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <ChevronDown size={16} className={`transform transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
              {profileMenuItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={index}
                    className={`w-full flex items-center px-4 py-2 text-sm hover:bg-gray-50 transition-colors duration-200 ${
                      item.className || 'text-gray-700 hover:text-gray-900'
                    }`}
                    onClick={() => {
                      setIsProfileOpen(false); // Close dropdown on any item click
                      item.onClick && item.onClick(); // Execute the specific item's onClick handler
                    }}
                  >
                    <IconComponent size={16} className="mr-3" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;