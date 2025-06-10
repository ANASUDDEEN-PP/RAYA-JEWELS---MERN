import React, { Component } from 'react'
import { useState } from 'react';
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

// Navbar Component
const Navbar = ({ toggleSidebar }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const profileMenuItems = [
    { icon: User, label: 'Profile Details' },
    { icon: Settings, label: 'Settings' },
    { icon: HelpCircle, label: 'Help' },
    { icon: LogOut, label: 'Logout', className: 'text-red-600 hover:text-red-700' },
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
                      setIsProfileOpen(false);
                      // Handle menu item click here
                      console.log(`Clicked: ${item.label}`);
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