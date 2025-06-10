import React, { useState } from 'react';
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

import Sidebar from '../Components/sideBar';
import Navbar from '../Components/navBar';


// Main Dashboard Component
const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar when clicking outside on mobile
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Dashboard Content */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Dashboard</h2>
              <p className="text-gray-600">Manage your application from this admin panel.</p>
            </div>

            {/* Sample Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { title: 'Total Users', value: '1,234', icon: Users, color: 'bg-blue-500' },
                { title: 'Products', value: '567', icon: Package, color: 'bg-green-500' },
                { title: 'Orders', value: '890', icon: ShoppingCart, color: 'bg-yellow-500' },
                { title: 'Collections', value: '45', icon: Grid, color: 'bg-purple-500' },
              ].map((card, index) => {
                const IconComponent = card.icon;
                return (
                  <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{card.title}</p>
                        <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                      </div>
                      <div className={`${card.color} p-3 rounded-lg`}>
                        <IconComponent size={24} className="text-white" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sample Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  'New user registration: john@example.com',
                  'Order #1234 has been shipped',
                  'Product "Smartphone X" added to inventory',
                  'Admin user updated system settings',
                ].map((activity, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">{activity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;