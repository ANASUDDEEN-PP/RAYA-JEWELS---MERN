import React, { Component } from 'react'
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
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const menuItems = [
    { icon: Home, label: 'Home', path: '/admin-dash' },
    { icon: Users, label: 'Users', path: '/admin-user' },
    { icon: Package, label: 'Products', path: '/admin-product' },
    { icon: ShoppingCart, label: 'Orders', path: '/orders' },
    { icon: Grid, label: 'Collections', path: '/collections' },
    { icon: UserCheck, label: 'Admins', path: '/admins' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Dashboard</h2>
          <button 
            onClick={toggleSidebar}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="mt-8">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={index}
                to={item.path}
                className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200"
              >
                <IconComponent size={20} className="mr-3" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
