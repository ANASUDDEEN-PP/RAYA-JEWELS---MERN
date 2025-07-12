import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Search,
  Filter,
  Smartphone,
  Truck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Navbar from "../Components/navBar";
import Sidebar from "../Components/sideBar";

const TransactionDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  // E-commerce transaction data
  const transactions = [
    {
      id: "TXN001",
      date: "2024-07-11",
      description: "Order #12345 - Customer Payment",
      amount: 89.99,
      type: "credited",
      status: "completed",
      paymentMethod: "Google Pay",
    },
    {
      id: "TXN002",
      date: "2024-07-11",
      description: "Order #12346 - Customer Payment",
      amount: 156.78,
      type: "credited",
      status: "completed",
      paymentMethod: "COD",
    },
    {
      id: "TXN003",
      date: "2024-07-10",
      description: "Refund - Order #12340",
      amount: -45.3,
      type: "debited",
      status: "completed",
      paymentMethod: "Google Pay",
    },
    {
      id: "TXN004",
      date: "2024-07-10",
      description: "Order #12347 - Customer Payment",
      amount: 234.5,
      type: "credited",
      status: "completed",
      paymentMethod: "Google Pay",
    },
    {
      id: "TXN005",
      date: "2024-07-09",
      description: "Order #12348 - Customer Payment",
      amount: 78.99,
      type: "credited",
      status: "completed",
      paymentMethod: "COD",
    },
    {
      id: "TXN006",
      date: "2024-07-09",
      description: "Refund - Order #12341",
      amount: -120.0,
      type: "debited",
      status: "completed",
      paymentMethod: "Google Pay",
    },
    {
      id: "TXN007",
      date: "2024-07-08",
      description: "Order #12349 - Customer Payment",
      amount: 345.67,
      type: "credited",
      status: "completed",
      paymentMethod: "Google Pay",
    },
    {
      id: "TXN008",
      date: "2024-07-08",
      description: "Order #12350 - Customer Payment",
      amount: 98.5,
      type: "credited",
      status: "completed",
      paymentMethod: "COD",
    },
    {
      id: "TXN009",
      date: "2024-07-07",
      description: "Refund - Order #12342",
      amount: -67.25,
      type: "debited",
      status: "completed",
      paymentMethod: "Google Pay",
    },
    {
      id: "TXN010",
      date: "2024-07-07",
      description: "Order #12351 - Customer Payment",
      amount: 189.99,
      type: "credited",
      status: "completed",
      paymentMethod: "Google Pay",
    },
    {
      id: "TXN011",
      date: "2024-07-06",
      description: "Order #12352 - Customer Payment",
      amount: 267.8,
      type: "credited",
      status: "completed",
      paymentMethod: "COD",
    },
    {
      id: "TXN012",
      date: "2024-07-06",
      description: "Refund - Order #12343",
      amount: -89.99,
      type: "debited",
      status: "completed",
      paymentMethod: "Google Pay",
    },
    {
      id: "TXN013",
      date: "2024-07-05",
      description: "Order #12353 - Customer Payment",
      amount: 156.75,
      type: "credited",
      status: "pending",
      paymentMethod: "COD",
    },
    {
      id: "TXN014",
      date: "2024-07-05",
      description: "Order #12354 - Customer Payment",
      amount: 423.5,
      type: "credited",
      status: "completed",
      paymentMethod: "Google Pay",
    },
    {
      id: "TXN015",
      date: "2024-07-04",
      description: "Refund - Order #12344",
      amount: -78.99,
      type: "debited",
      status: "completed",
      paymentMethod: "Google Pay",
    },
  ];

  // Calculate summary stats
  const totalTransactions = transactions.length;
  const completedTransactions = transactions.filter(
    (t) => t.status === "completed"
  ).length;
  const pendingTransactions = transactions.filter(
    (t) => t.status === "pending"
  ).length;
  const totalIncome = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const totalRefunds = Math.abs(
    transactions
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0)
  );
  const netRevenue = totalIncome - totalRefunds;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.paymentMethod
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === "all" || transaction.type === filterType;
    return matchesSearch && matchesFilter;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "credited":
        return "text-green-600";
      case "debited":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getPaymentIcon = (paymentMethod) => {
    switch (paymentMethod) {
      case "Google Pay":
        return <Smartphone className="h-4 w-4" />;
      case "COD":
        return <Truck className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div
        className={`flex-1 flex flex-col overflow-hidden ${
          isSidebarOpen ? "ml-64" : "ml-0"
        } transition-all duration-300`}
      >
        <Navbar toggleSidebar={toggleSidebar} />
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Transaction Dashboard
              </h1>
              <p className="text-gray-600">
                Monitor all e-commerce transactions and revenue
              </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Total Transactions
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {totalTransactions}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-2 flex items-center text-sm">
                  <span className="text-green-600 font-medium">
                    {completedTransactions} completed
                  </span>
                  <span className="text-gray-500 ml-2">
                    • {pendingTransactions} pending
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Total Revenue
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(totalIncome)}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Total Refunds
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      {formatCurrency(totalRefunds)}
                    </p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-full">
                    <TrendingDown className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Net Revenue
                    </p>
                    <p
                      className={`text-2xl font-bold ${
                        netRevenue >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {formatCurrency(netRevenue)}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-100 rounded-full">
                    <DollarSign className="h-6 w-6 text-gray-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search transactions, orders, or payment methods..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <select
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="credited">Credited</option>
                    <option value="debited">Debited</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Transaction Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Transactions
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Showing {startIndex + 1}-
                  {Math.min(endIndex, filteredTransactions.length)} of{" "}
                  {filteredTransactions.length} transactions
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment Method
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {transaction.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {transaction.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            {getPaymentIcon(transaction.paymentMethod)}
                            {transaction.paymentMethod}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <span
                            className={`capitalize ${getTypeColor(
                              transaction.type
                            )}`}
                          >
                            {transaction.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <span
                            className={
                              transaction.amount >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {transaction.amount >= 0 ? "+" : ""}
                            {formatCurrency(transaction.amount)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              transaction.status
                            )}`}
                          >
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {currentTransactions.length === 0 && (
                <div className="px-6 py-12 text-center">
                  <p className="text-gray-500">
                    No transactions found matching your criteria.
                  </p>
                </div>
              )}

              {/* Pagination */}
              {filteredTransactions.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-700">
                      <span>
                        Showing {startIndex + 1} to{" "}
                        {Math.min(endIndex, filteredTransactions.length)} of{" "}
                        {filteredTransactions.length} results
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={goToPrevPage}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </button>

                      <div className="flex items-center gap-1">
                        {[...Array(totalPages)].map((_, index) => {
                          const page = index + 1;
                          const isCurrentPage = page === currentPage;
                          const shouldShow =
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 &&
                              page <= currentPage + 1);

                          if (!shouldShow) {
                            if (
                              page === currentPage - 2 ||
                              page === currentPage + 2
                            ) {
                              return (
                                <span key={page} className="px-2 text-gray-500">
                                  ...
                                </span>
                              );
                            }
                            return null;
                          }

                          return (
                            <button
                              key={page}
                              onClick={() => goToPage(page)}
                              className={`px-3 py-1 text-sm rounded-md ${
                                isCurrentPage
                                  ? "bg-blue-500 text-white"
                                  : "bg-white border border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDashboard;
