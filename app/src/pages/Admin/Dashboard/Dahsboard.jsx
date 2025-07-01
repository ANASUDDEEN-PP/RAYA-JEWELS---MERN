import React, { useState } from 'react';
import {
  Home,
  Users,
  Package,
  ShoppingCart,
  Grid,
  Settings,
  Menu,
  X,
  User,
  Bell,
  TrendingUp,
  ChevronDown,
  TrendingDown,
  DollarSign,
  BarChart2,
  PieChart as PieChartIcon,
  RefreshCw,
  MoreHorizontal
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';
import NotificationSystem from '../Components/notification';
import NavBar from '../Components/navBar';
import SideBar from '../Components/sideBar'

// Sidebar Component
const Sidebar = ({ isOpen, toggleSidebar }) => {
  const menuItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: Users, label: 'Users' },
    { icon: Package, label: 'Products' },
    { icon: ShoppingCart, label: 'Orders' },
    { icon: Grid, label: 'Collections' },
    { icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      <SideBar />
    </>
  );
};

// Navbar Component
const Navbar = ({ toggleSidebar }) => {
  return (
    <NavBar />
  );
};

// StatCard Component
const StatCard = ({ title, value, change, icon: Icon, color }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <p className={`text-sm flex items-center mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
            {change >= 0 ? (
              <TrendingUp size={14} className="mr-1" />
            ) : (
              <TrendingDown size={14} className="mr-1" />
            )}
            {Math.abs(change)}% from last month
          </p>
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );
};

// ChartCard Component
const ChartCard = ({ title, children, icon: Icon, onRefresh }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          {Icon && <Icon size={18} className="mr-2" />}
          {title}
        </h3>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
          >
            <RefreshCw size={16} />
          </button>
        )}
      </div>
      {children}
    </div>
  );
};

// Sample Data
const sampleNotifications = [
  {
    id: 1,
    type: 'order',
    title: 'New Order Received',
    message: 'Order #ORD-2024-001 placed for $250.00',
    time: '2 minutes ago',
    isRead: false
  },
  {
    id: 2,
    type: 'warning',
    title: 'Low Stock Alert',
    message: 'iPhone 15 Pro Max has only 3 units remaining',
    time: '15 minutes ago',
    isRead: false
  },
  {
    id: 3,
    type: 'success',
    title: 'Order Delivered',
    message: 'Order #ORD-2024-003 delivered successfully',
    time: '3 hours ago',
    isRead: true
  }
];

const orderStatusData = [
  { name: 'Completed', value: 65, color: '#10B981' },
  { name: 'Processing', value: 25, color: '#F59E0B' },
  { name: 'Cancelled', value: 10, color: '#EF4444' }
];

const salesData = [
  { month: 'Jan', sales: 12000 },
  { month: 'Feb', sales: 15000 },
  { month: 'Mar', sales: 18000 },
  { month: 'Apr', sales: 22000 },
  { month: 'May', sales: 19000 },
  { month: 'Jun', sales: 25000 }
];

const revenueSources = [
  { name: 'Products', value: 45, color: '#3B82F6' },
  { name: 'Services', value: 32, color: '#8B5CF6' },
  { name: 'Subscriptions', value: 28, color: '#10B981' },
  { name: 'Other', value: 15, color: '#F59E0B' }
];

const recentActivities = [
  { id: 1, activity: 'New user registered: john@example.com', time: '2 min ago', type: 'user' },
  { id: 2, activity: 'Order #1234 has been shipped', time: '15 min ago', type: 'order' },
  { id: 3, activity: 'New product "Smartphone X" added', time: '1 hour ago', type: 'product' },
  { id: 4, activity: 'System settings updated', time: '2 hours ago', type: 'system' }
];

// Main Dashboard Component
const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chartData, setChartData] = useState(salesData);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const refreshChartData = () => {
    // Simulate data refresh
    const newData = [...salesData].map(item => ({
      ...item,
      sales: item.sales + Math.floor(Math.random() * 2000) - 1000
    }));
    setChartData(newData);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Navbar toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, Admin</h2>
                <p className="text-gray-600">Here's what's happening with your store today.</p>
              </div>
              <div className="flex justify-end">
                <NotificationSystem notifications={sampleNotifications} />
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Revenue"
                value="$24,780"
                change={12.5}
                icon={DollarSign}
                color="bg-green-500"
              />
              <StatCard
                title="Total Orders"
                value="1,245"
                change={8.2}
                icon={ShoppingCart}
                color="bg-blue-500"
              />
              <StatCard
                title="Active Users"
                value="876"
                change={5.7}
                icon={Users}
                color="bg-purple-500"
              />
              <StatCard
                title="Conversion Rate"
                value="3.42%"
                change={-1.2}
                icon={BarChart2}
                color="bg-yellow-500"
              />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <ChartCard title="Sales Overview" icon={BarChart2} onRefresh={refreshChartData}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Revenue Sources" icon={PieChartIcon}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={revenueSources}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {revenueSources.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <ChartCard title="Monthly Sales Trend">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Order Status">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Recent Activity */}
            <ChartCard title="Recent Activity">
              <div className="space-y-4">
                {recentActivities.map((item) => (
                  <div key={item.id} className="flex items-start p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${item.type === 'user' ? 'bg-blue-500' :
                      item.type === 'order' ? 'bg-green-500' :
                        item.type === 'product' ? 'bg-purple-500' :
                          'bg-orange-500'
                      }`}></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{item.activity}</p>
                      <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 p-1">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;