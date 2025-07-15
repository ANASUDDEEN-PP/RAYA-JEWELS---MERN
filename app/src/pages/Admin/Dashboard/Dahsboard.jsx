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
  Loader2,
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
  Area,
  AreaChart,
} from "recharts";
import NotificationSystem from "../Components/notification";
import NavBar from "../Components/navBar";
import SideBar from "../Components/sideBar";
import axios from "axios";
import baseUrl from "../../../url";
import UnauthorizedPage from "../../../components/unauthorized Alert/unAuth";

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

// Trading Chart Component
const TradingChart = ({ data, profit, loss }) => {
  const isProfit = parseFloat(profit) > Math.abs(parseFloat(loss));
  const netProfit = parseFloat(profit) - Math.abs(parseFloat(loss));
  const [showOpposite, setShowOpposite] = useState(false);

  // Transform data to show both lines above x-axis
  const chartData = data.map((item) => ({
    ...item,
    profit: item.profit || 0,
    lossDisplay: Math.abs(item.loss || 0),
  }));

  return (
    <div
      className={`rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden ${
        isProfit ? "bg-green-50" : "bg-red-50"
      }`}
    >
      {/* Background overlay */}
      <div
        className={`absolute inset-0 ${
          isProfit ? "bg-green-500" : "bg-red-500"
        } opacity-5`}
      ></div>

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              Trading Performance
            </h3>
            <p className="text-sm text-gray-600">
              Net P&L:{" "}
              <span
                className={`font-bold ${
                  isProfit ? "text-green-600" : "text-red-600"
                }`}
              >
                {isProfit ? "+" : "-"}₹{Math.abs(netProfit).toLocaleString()}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <div
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                isProfit
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {isProfit ? "📈 Profitable" : "📉 Loss"}
            </div>

            <button
              onClick={() => setShowOpposite(!showOpposite)}
              className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
                showOpposite
                  ? isProfit
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {showOpposite ? (
                <>
                  <CheckCircle size={14} />
                  {isProfit ? "Showing Loss" : "Showing Profit"}
                </>
              ) : (
                <>
                  <XCircle size={14} />
                  {isProfit ? "Show Loss" : "Show Profit"}
                </>
              )}
            </button>
          </div>
        </div>

        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                formatter={(value, name) => {
                  if (name === "profit")
                    return [`$${value.toLocaleString()}`, "Profit"];
                  if (name === "lossDisplay")
                    return [`-$${value.toLocaleString()}`, "Loss"];
                  return [`$${value.toLocaleString()}`, "Sales"];
                }}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Legend
                formatter={(value) => {
                  if (value === "profit") return "Profit";
                  if (value === "lossDisplay") return "Loss";
                  return value;
                }}
              />

              {/* Default line (profit for profit chart, loss for loss chart) */}
              {(!showOpposite || !isProfit) && (
                <Area
                  type="monotone"
                  dataKey={isProfit ? "profit" : "lossDisplay"}
                  name={isProfit ? "profit" : "loss"}
                  stroke={isProfit ? "#10B981" : "#EF4444"}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill={isProfit ? "url(#colorProfit)" : "url(#colorLoss)"}
                  animationDuration={5000}
                  activeDot={{ r: 8 }}
                  isAnimationActive={true}
                />
              )}

              {/* Opposite line (shown when toggle is on) */}
              {showOpposite && (
                <Area
                  type="monotone"
                  dataKey={isProfit ? "lossDisplay" : "profit"}
                  name={isProfit ? "loss" : "profit"}
                  stroke={isProfit ? "#EF4444" : "#10B981"}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill={isProfit ? "url(#colorLoss)" : "url(#colorProfit)"}
                  animationDuration={5000}
                  activeDot={{ r: 8 }}
                  isAnimationActive={true}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Profit Loss Summary Component
const ProfitLossSummary = ({ profit, loss }) => {
  const netProfit = parseFloat(profit || 0) - Math.abs(parseFloat(loss || 0));
  const isPositive = netProfit >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-green-100 p-3 rounded-lg">
            <TrendingUp className="text-green-600" size={24} />
          </div>
          <div className="text-right">
            <div className="text-xs text-green-600 font-medium">PROFIT</div>
          </div>
        </div>
        <div>
          <p className="text-3xl font-bold text-green-600">
            ₹{parseFloat(profit || 0).toFixed(2)}
          </p>
          <p className="text-sm text-gray-500 mt-1">Total Earnings</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-red-100 p-3 rounded-lg">
            <TrendingDown className="text-red-600" size={24} />
          </div>
          <div className="text-right">
            <div className="text-xs text-red-600 font-medium">LOSS</div>
          </div>
        </div>
        <div>
          <p className="text-3xl font-bold text-red-600">
            ₹{Math.abs(parseFloat(loss || 0)).toFixed(2)}
          </p>
          <p className="text-sm text-gray-500 mt-1">Total Losses</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`p-3 rounded-lg ${
              isPositive ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <DollarSign
              className={`${isPositive ? "text-green-600" : "text-red-600"}`}
              size={24}
            />
          </div>
          <div className="text-right">
            <div
              className={`text-xs font-medium ${
                isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              NET {isPositive ? "PROFIT" : "LOSS"}
            </div>
          </div>
        </div>
        <div>
          <p
            className={`text-3xl font-bold ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {isPositive ? "+" : "-"}₹{Math.abs(netProfit).toFixed(2)}
          </p>
          <p className="text-sm text-gray-500 mt-1">Net Result</p>
        </div>
      </div>
    </div>
  );
};

// Monthly Sales Analysis Component
const MonthlySalesAnalysis = ({ salesData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Bar Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Monthly Sales Overview
          </h3>
          <BarChart2 className="text-gray-400" size={20} />
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, "Sales"]} />
            <Bar dataKey="sales" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Sales Trend</h3>
          <TrendingUp className="text-gray-400" size={20} />
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, "Sales"]} />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#10B981"
              strokeWidth={3}
              dot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Order Status Component
const OrderStatusGrid = ({ data }) => {
  const orderStatusData = [
    {
      name: "Processing",
      value: data.orderProcessing || 0,
      color: "bg-blue-500",
      icon: Clock,
      textColor: "text-blue-600",
    },
    {
      name: "Confirmed",
      value: data.orderConfirm || 0,
      color: "bg-green-500",
      icon: CheckCircle,
      textColor: "text-green-600",
    },
    {
      name: "Shipped",
      value: data.orderShipped || 0,
      color: "bg-purple-500",
      icon: Truck,
      textColor: "text-purple-600",
    },
    {
      name: "Delivered",
      value: data.orderDelivered || 0,
      color: "bg-emerald-500",
      icon: CheckCircle,
      textColor: "text-emerald-600",
    },
    {
      name: "Cancelled",
      value: data.orderCancelled || 0,
      color: "bg-red-500",
      icon: XCircle,
      textColor: "text-red-600",
    },
  ];

  const paymentStatusData = [
    {
      name: "Paid",
      value: data.paymentPaid || 0,
      color: "bg-green-500",
      icon: CheckCircle,
      textColor: "text-green-600",
    },
    {
      name: "Pending",
      value: data.paymentPending || 0,
      color: "bg-yellow-500",
      icon: Clock,
      textColor: "text-yellow-600",
    },
    {
      name: "Failed",
      value: data.paymentFailed || 0,
      color: "bg-red-500",
      icon: XCircle,
      textColor: "text-red-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Order Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Order Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {orderStatusData.map((item, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
              <div
                className={`${item.color} p-3 rounded-lg mx-auto mb-3 w-12 h-12 flex items-center justify-center`}
              >
                <item.icon className="text-white" size={20} />
              </div>
              <p className={`text-2xl font-bold ${item.textColor} mb-1`}>
                {item.value}
              </p>
              <p className="text-sm text-gray-600">{item.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Payment Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {paymentStatusData.map((item, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
              <div
                className={`${item.color} p-3 rounded-lg mx-auto mb-3 w-12 h-12 flex items-center justify-center`}
              >
                <item.icon className="text-white" size={20} />
              </div>
              <p className={`text-2xl font-bold ${item.textColor} mb-1`}>
                {item.value}
              </p>
              <p className="text-sm text-gray-600">{item.name}</p>
            </div>
          ))}
        </div>
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
        console.log(response);
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

  const isAdmin = JSON.parse(localStorage.getItem("adminCode"));
  if (!isAdmin && isAdmin !== "ADMRAYA1752604097026") {
    return (
      <div>
        <UnauthorizedPage />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          <Navbar toggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <Loader2 className="animate-spin text-blue-500" size={48} />
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

  // Add sample data for better visualization when we have limited data
  const enhancedSalesData =
    salesData.length === 1 && salesData[0].month !== "No Data"
      ? [
          {
            month: "May 2025",
            sales: 45000,
            profit: 12000,
            loss: -5000,
            orders: 2,
          },
          {
            month: "Jun 2025",
            sales: 62000,
            profit: 18000,
            loss: -3000,
            orders: 3,
          },
          ...salesData.map((item) => ({
            ...item,
            profit: item.sales * 0.3, // example calculation
            loss: -item.sales * 0.1, // example calculation
          })),
        ]
      : salesData;

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
                  Trading Dashboard
                </h1>
                <p className="text-gray-600">
                  Monitor your business performance and trading metrics
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
                value={`${(
                  data.monthlySalesGrid?.[0]?.sales || 0
                ).toLocaleString()}`}
                change={15.8}
                icon={DollarSign}
                color="bg-yellow-500"
                subtitle="This month"
              />
            </div>

            {/* Trading Chart - Full Width */}
            <div className="mb-8">
              <TradingChart
                data={enhancedSalesData}
                profit={data.profit}
                loss={data.loss}
              />
            </div>

            {/* Profit/Loss Summary */}
            <ProfitLossSummary profit={data.profit} loss={data.loss} />

            {/* Monthly Sales Analysis */}
            <MonthlySalesAnalysis salesData={enhancedSalesData} />

            {/* Order Status Grid */}
            <OrderStatusGrid data={data} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
