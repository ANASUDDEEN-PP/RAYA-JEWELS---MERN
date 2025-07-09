import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart2,
  RefreshCw,
  CreditCard,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Users,
  Package,
  ShoppingCart,
  Loader,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import NotificationSystem from "../Components/notification";
import NavBar from "../Components/navBar";
import SideBar from "../Components/sideBar";
import axios from "axios";
import baseUrl from "../../../url";

// Sidebar Component
const Sidebar = ({ isOpen, toggleSidebar }) => {
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
  return <NavBar />;
};

// StatCard Component
const StatCard = ({ title, value, change, icon: Icon, color, subtitle }) => {
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`${color} p-3 rounded-lg`}>
          <Icon size={24} className="text-white" />
        </div>
        <div className="text-right">
          {change !== undefined && !isNaN(change) && (
            <div
              className={`flex items-center text-sm ${
                isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {isPositive ? (
                <TrendingUp size={14} className="mr-1" />
              ) : (
                <TrendingDown size={14} className="mr-1" />
              )}
              {Math.abs(change)}%
            </div>
          )}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
};

// DonutChart Component
const DonutChart = ({ data, title, centerText }) => {
  const total = data?.reduce((sum, item) => sum + item.value, 0) || 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="relative">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={90}
              innerRadius={50}
              fill="#8884d8"
              dataKey="value"
            >
              {data?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{total}</div>
            <div className="text-sm text-gray-600">{centerText}</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 space-y-2">
        {data?.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-gray-700">{item.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900">{item.value}</span>
              <span className="text-gray-500">
                ({total > 0 ? ((item.value / total) * 100).toFixed(1) : 0}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseUrl}/get/dashboard/data`);
        setData(response.data.dashboardData);
      } catch (err) {
        setError(err.message || "Failed to fetch dashboard data");
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          <Navbar toggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <Loader className="animate-spin text-blue-500" size={48} />
              <p className="mt-4 text-gray-600">Loading dashboard data...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          <Navbar toggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
            <div className="bg-red-50 p-6 rounded-xl max-w-md text-center">
              <AlertCircle className="mx-auto text-red-500" size={48} />
              <h3 className="mt-4 text-lg font-medium text-red-800">
                Error Loading Dashboard
              </h3>
              <p className="mt-2 text-red-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
              >
                Retry
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          <Navbar toggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
            <div className="bg-yellow-50 p-6 rounded-xl max-w-md text-center">
              <AlertCircle className="mx-auto text-yellow-500" size={48} />
              <h3 className="mt-4 text-lg font-medium text-yellow-800">
                No Data Available
              </h3>
              <p className="mt-2 text-yellow-600">
                Dashboard data could not be loaded.
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Process data for charts
  const paymentStatusData = [
    { name: "Paid", value: data.paymentPaid || 0, color: "#10B981" },
    { name: "Pending", value: data.paymentPending || 0, color: "#F59E0B" },
    { name: "Failed", value: data.paymentFailed || 0, color: "#EF4444" },
  ];

  const orderStatusData = [
    { name: "Processing", value: data.orderProcessing || 0, color: "#3B82F6" },
    { name: "Confirmed", value: data.orderConfirm || 0, color: "#10B981" },
    { name: "Shipped", value: data.orderShipped || 0, color: "#8B5CF6" },
    { name: "Delivered", value: data.orderDelivered || 0, color: "#059669" },
    { name: "Cancelled", value: data.orderCancelled || 0, color: "#EF4444" },
  ].filter((item) => item.value > 0);

  const salesData = data.monthlySalesGrid?.map((item) => ({
    month: item.month
      ? new Date(item.month).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        })
      : "N/A",
    sales: item.sales || 0,
    orders: item.orders || 0,
  })) || [{ month: "No Data", sales: 0, orders: 0 }];

  const profitLossData = [
    {
      name: "Profit",
      value: parseFloat(data.profit || 0),
      color: "#10B981",
    },
    {
      name: "Loss",
      value: Math.abs(parseFloat(data.loss || 0)),
      color: "#EF4444",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Navbar toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-start mb-8 w-full">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Dashboard Overview
                </h1>
                <p className="text-gray-600">
                  Monitor your business performance and key metrics
                </p>
              </div>
              <NotificationSystem />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Users"
                value={data.userCount?.toString() || "0"}
                change={12.5}
                icon={Users}
                color="bg-blue-500"
                subtitle="Active users"
              />
              <StatCard
                title="Products"
                value={data.productCount?.toString() || "0"}
                change={8.2}
                icon={Package}
                color="bg-purple-500"
                subtitle="In inventory"
              />
              <StatCard
                title="Total Orders"
                value={data.orderCount?.toString() || "0"}
                change={5.7}
                icon={ShoppingCart}
                color="bg-green-500"
                subtitle="This month"
              />
              <StatCard
                title="Revenue"
                value={`$${
                  (data.monthlySalesGrid?.[0]?.sales || 0).toLocaleString()
                }`}
                change={-1.2}
                icon={DollarSign}
                color="bg-yellow-500"
                subtitle="This month"
              />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Payment Status */}
              <DonutChart
                data={paymentStatusData}
                title="Payment Status"
                centerText="Payments"
              />

              {/* Order Status */}
              <DonutChart
                data={orderStatusData}
                title="Order Status"
                centerText="Orders"
              />
            </div>

            {/* Profit/Loss and Sales Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Profit/Loss Bar Chart */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Profit & Loss
                  </h3>
                  <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                    <RefreshCw size={16} />
                  </button>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={profitLossData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`$${value.toFixed(2)}`, ""]}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]}>
                      {profitLossData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-800">
                          Total Profit
                        </p>
                        <p className="text-2xl font-bold text-green-900">
                          ${parseFloat(data.profit || 0).toFixed(2)}
                        </p>
                      </div>
                      <TrendingUp className="text-green-600" size={20} />
                    </div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-red-800">
                          Total Loss
                        </p>
                        <p className="text-2xl font-bold text-red-900">
                          ${Math.abs(parseFloat(data.loss || 0)).toFixed(2)}
                        </p>
                      </div>
                      <TrendingDown className="text-red-600" size={20} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sales Chart */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Monthly Sales
                  </h3>
                  <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                    <RefreshCw size={16} />
                  </button>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">
                        New order received
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        2 minutes ago
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start p-3 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 mr-3"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">
                        Payment processed successfully
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        15 minutes ago
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start p-3 bg-yellow-50 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2 mr-3"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">
                        New user registered
                      </p>
                      <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                    </div>
                  </div>

                  <div className="flex items-start p-3 bg-red-50 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2 mr-3"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">Order cancelled</p>
                      <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-2">
                  <CreditCard className="text-green-500" size={24} />
                  <span className="text-sm text-green-600 font-medium">
                    +{data.paymentPaid || 0}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-gray-600">
                  Paid Orders
                </h3>
                <p className="text-2xl font-bold text-gray-900">
                  {data.paymentPaid || 0}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="text-yellow-500" size={24} />
                  <span className="text-sm text-yellow-600 font-medium">
                    {data.paymentPending || 0}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-gray-600">
                  Pending Payments
                </h3>
                <p className="text-2xl font-bold text-gray-900">
                  {data.paymentPending || 0}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-2">
                  <Truck className="text-blue-500" size={24} />
                  <span className="text-sm text-blue-600 font-medium">
                    {data.orderProcessing || 0}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-gray-600">
                  Processing Orders
                </h3>
                <p className="text-2xl font-bold text-gray-900">
                  {data.orderProcessing || 0}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-2">
                  <XCircle className="text-red-500" size={24} />
                  <span className="text-sm text-red-600 font-medium">
                    {data.orderCancelled || 0}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-gray-600">
                  Cancelled Orders
                </h3>
                <p className="text-2xl font-bold text-gray-900">
                  {data.orderCancelled || 0}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;