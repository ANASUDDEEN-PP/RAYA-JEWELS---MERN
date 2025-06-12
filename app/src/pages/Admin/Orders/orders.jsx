import React, { useState } from 'react';
import { Search, Eye, Edit, Trash2 } from 'lucide-react';
import NavBar from "../Components/navBar";
import Sidebar from '../Components/sideBar';

const OrderListPage = () => {
    // Sample order data
    const [orders] = useState([
        {
            orderId: 'ORD-2024-001',
            productId: 'PRD-001',
            customerName: 'John Smith',
            quantity: 2,
            orderDate: '2024-06-10'
        },
        {
            orderId: 'ORD-2024-002',
            productId: 'PRD-002',
            customerName: 'Sarah Johnson',
            quantity: 1,
            orderDate: '2024-06-09'
        },
        {
            orderId: 'ORD-2024-003',
            productId: 'PRD-003',
            customerName: 'Mike Davis',
            quantity: 5,
            orderDate: '2024-06-08'
        },
        {
            orderId: 'ORD-2024-004',
            productId: 'PRD-001',
            customerName: 'Emily Brown',
            quantity: 3,
            orderDate: '2024-06-07'
        },
        {
            orderId: 'ORD-2024-005',
            productId: 'PRD-004',
            customerName: 'David Wilson',
            quantity: 1,
            orderDate: '2024-06-06'
        },
        {
            orderId: 'ORD-2024-006',
            productId: 'PRD-002',
            customerName: 'Lisa Anderson',
            quantity: 4,
            orderDate: '2024-06-05'
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

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

    // Filter orders based on search term
    const filteredOrders = orders.filter(order =>
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination calculations
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentOrders = filteredOrders.slice(startIndex, endIndex);

    // Reset to first page when search changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Pagination helper function
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 7;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 4) {
                for (let i = 1; i <= 5; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 3) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 4; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    const handleView = (orderId) => {
        alert(`Viewing order: ${orderId}`);
    };

    const handleEdit = (orderId) => {
        alert(`Editing order: ${orderId}`);
    };

    const handleDelete = (orderId) => {
        if (window.confirm(`Are you sure you want to delete order ${orderId}?`)) {
            alert(`Deleted order: ${orderId}`);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
                {/* Navbar */}
                <NavBar toggleSidebar={toggleSidebar} />
                <div className="min-h-screen bg-gray-50 p-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <h1 className="text-3xl font-bold text-gray-900 mb-8">Orders</h1>

                        {/* Search Section */}
                        <div className="mb-6 flex justify-end">
                            <div className="relative max-w-md">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by Order ID, Product ID, or Customer Name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/* Orders Table */}
                        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Order ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Product ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Customer Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Quantity
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Order Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {currentOrders.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                                No orders found matching your search criteria.
                                            </td>
                                        </tr>
                                    ) : (
                                        currentOrders.map((order, index) => (
                                            <tr key={order.orderId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {order.orderId}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {order.productId}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {order.customerName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {order.quantity}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {order.orderDate}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleView(order.orderId)}
                                                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                                            title="View Order"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEdit(order.orderId)}
                                                            className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                                                            title="Edit Order"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(order.orderId)}
                                                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                                            title="Delete Order"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Results count and Pagination */}
                        <div className="mt-4 flex justify-between items-center">
                            <div className="text-sm text-gray-500">
                                Showing {startIndex + 1} to {Math.min(endIndex, filteredOrders.length)} of {filteredOrders.length} orders
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center space-x-1">
                                    <button
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>

                                    {getPageNumbers().map((page, index) => (
                                        <button
                                            key={index}
                                            onClick={() => typeof page === 'number' && setCurrentPage(page)}
                                            disabled={page === '...'}
                                            className={`px-3 py-2 text-sm font-medium rounded-md ${page === currentPage
                                                    ? 'bg-blue-600 text-white border border-blue-600'
                                                    : page === '...'
                                                        ? 'text-gray-400 cursor-not-allowed'
                                                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderListPage;