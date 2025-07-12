import React, { useState } from 'react';
import { 
  Home, 
  Users, 
  Package, 
  ShoppingCart,
  X,
  BadgeIndianRupee
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const menuItems = [
    { icon: Home, label: 'Home', path: '/admin-dash' },
    { icon: Users, label: 'Users', path: '/admin-user' },
    { icon: Package, label: 'Products', path: '/admin-product' },
    { icon: ShoppingCart, label: 'Orders', path: '/admin-orders' },
    // { icon: BadgeIndianRupee, label: 'Transaction', path: '/admin/transaction' },
    // { icon: Grid, label: 'Collections', path: '/collections' },
    // { icon: UserCheck, label: 'Admins', path: '/admins' },
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
      <div 
        className={`
          fixed top-0 left-0 h-full z-50 transform transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
          ${isHovered ? 'w-64' : 'w-16'}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          fixed top-0 left-0 h-full z-50 transform transition-all duration-300 ease-in-out bg-white shadow-lg
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
          ${isHovered ? 'w-64' : 'w-16'}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {isHovered ? (
            <h2 className="text-xl font-bold text-black transition-all duration-300 opacity-100 translate-x-0">
              Dashboard
            </h2>
          ) : (
            <div className="flex justify-center w-full">
              <ShoppingCart size={24} className="text-black/90" />
            </div>
          )}
          <button 
            onClick={toggleSidebar}
            className="lg:hidden text-gray-700 hover:text-black transition-colors"
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
                className="flex items-center px-4 py-3 text-black/80 hover:bg-blue-50 hover:text-blue-600 hover:border-l-4 hover:border-blue-500 transition-all duration-200 relative group rounded-r-lg mx-2 hover:shadow-md"
              >
                <div className="min-w-[24px] flex justify-center">
                  <IconComponent size={20} className="text-black/90 group-hover:text-blue-600 transition-colors" />
                </div>
                <span className={`ml-3 whitespace-nowrap transition-all duration-300 ${
                  isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                }`}>
                  {item.label}
                </span>
                
                {/* Tooltip for collapsed state */}
                {!isHovered && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;