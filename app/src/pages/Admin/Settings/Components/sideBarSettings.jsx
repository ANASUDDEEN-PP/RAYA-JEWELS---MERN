import React, { useState } from 'react'
import { Info, Settings, FolderPlus } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function SideBarSettings() {
  const location = useLocation();
  
  const sidebarItems = [
    { id: 'aboutus', label: 'About Us', icon: Info, path: '/admin-settings-about' },
    { id: 'profile', label: 'Profile Settings', icon: Settings, path: '/admin-settings-profile' },
    { id: 'collection', label: 'Make Collection', icon: FolderPlus, path: '/admin-settings-collections' }
  ];

  // Determine active item based on current route
  const getActiveItem = () => {
    const currentItem = sidebarItems.find(item => item.path === location.pathname);
    return currentItem ? currentItem.id : 'aboutus'; // default to aboutus
  };

  return (
    <div>
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Settings</h2>
          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = getActiveItem() === item.id;
              
              return (
                <Link
                  to={item.path}
                  key={item.id}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:transform hover:scale-102'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'transform rotate-12' : ''
                  }`} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}