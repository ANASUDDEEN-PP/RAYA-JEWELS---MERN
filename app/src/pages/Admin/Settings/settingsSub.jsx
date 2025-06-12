import { useState } from 'react';
import { ArrowLeft, User, Info, Settings, FolderPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Components/sideBarSettings';

export default function CollectionSettings() {

  const softwareDetails = [
    { label: 'Software Name', value: 'RAYA Jewels E-Commerce' },
    { label: 'Developer Name', value: 'Anasuddeen PP' },
    { label: 'Model Number', value: 'RAYA.2025.01.1' },
    { label: 'Version', value: '25.2.1' },
    { label: 'Server Name', value: 'rayajewels.com' },
    { label: 'Domain Name', value: 'app.rayajewels.com' },
    { label: 'Database', value: 'mongoDB 22.1' },
    { label: 'Framework', value: 'React 18.2.0' },
    { label: 'API Version', value: 'v2.1' },
    { label: 'Build Number', value: '2025.06.12.001' },
    { label: 'License Type', value: 'Enterprise' },
    { label: 'Support Level', value: 'Premium 24/7' }
  ];
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div onClick={() => navigate('/admin-settings')} className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 cursor-pointer transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Go back to dashboard</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-200 transition-colors">
              <User className="w-4 h-4 text-blue-600" />
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">About Us</h1>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Welcome to our comprehensive cloud synchronization platform. We provide enterprise-grade 
                solutions for seamless data management and collaboration across distributed teams. Our 
                platform is built with cutting-edge technology to ensure reliability, security, and 
                scalability for businesses of all sizes.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {softwareDetails.map((detail, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium text-gray-500">{detail.label}</span>
                      <span className="text-gray-900 font-mono text-sm">{detail.value}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">System Status</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-blue-800">All systems operational</span>
                </div>
                <p className="text-sm text-blue-700 mt-2">
                  Last updated: {new Date().toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}