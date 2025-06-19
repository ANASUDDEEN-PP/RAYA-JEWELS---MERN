import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Search, Edit, Trash2, Eye, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import Sidebar from "../Components/sideBar";
import NavBar from "../Components/navBar";
import axios from "axios";
import baseUrl from "../../../url";
import AddProductModal from "./addProductModal";

const ProductListPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showAddProductModal, setShowAddProductModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const itemsPerPage = 10;

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsSidebarOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const fetchProducts = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await axios.get(`${baseUrl}/product/get/all`);
            console.log(response)
            const rawProducts = response.data.products || [];
            
            // Ensure all products have required fields with defaults
            const validProducts = rawProducts.map(product => ({
                _id: product._id || '',
                productId: product.ProductId || 'N/A',
                productName: product.ProductName || 'Unnamed Product',
                collectionName: product.CollectionName || 'No Collection',
                quantity: product.Quantity || 0,
                normalPrice: product.NormalPrice || 0,
                offerPrice: product.OfferPrice || 0,
                material: product.Material || 'Not specified',
                size: product.Size || 'Not specified'
            }));
            
            setProducts(validProducts);
        } catch (err) {
            console.error("Error fetching products:", err);
            setError("Failed to load products. Please try again later.");
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const filteredProducts = useMemo(() => {
        if (!searchTerm) return products;
        
        const searchTermLower = searchTerm.toLowerCase();
        return products.filter((product) => {
            return (
                product.productName.toLowerCase().includes(searchTermLower) ||
                product.productId.toLowerCase().includes(searchTermLower) ||
                product.collectionName.toLowerCase().includes(searchTermLower)
            );
        });
    }, [products, searchTerm]);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, endIndex);

    useEffect(() => {
        // Reset to first page when search term changes
        setCurrentPage(1);
    }, [searchTerm]);

    const getPaginationButtons = () => {
        const buttons = [];
        const maxVisibleButtons = 5;

        if (totalPages <= maxVisibleButtons) {
            // Show all pages if total pages is less than max visible buttons
            for (let i = 1; i <= totalPages; i++) {
                buttons.push(i);
            }
        } else {
            // Always show first page
            buttons.push(1);

            // Show ellipsis if current page is more than 3
            if (currentPage > 3) {
                buttons.push("...");
            }

            // Determine range of pages to show around current page
            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);

            // Adjust if we're near the start or end
            if (currentPage <= 3) {
                end = Math.min(4, totalPages - 1);
            } else if (currentPage >= totalPages - 2) {
                start = Math.max(totalPages - 3, 2);
            }

            // Add the range of pages
            for (let i = start; i <= end; i++) {
                if (i > 1 && i < totalPages) {
                    buttons.push(i);
                }
            }

            // Show ellipsis if current page is less than totalPages - 2
            if (currentPage < totalPages - 2) {
                buttons.push("...");
            }

            // Always show last page if there's more than one page
            if (totalPages > 1) {
                buttons.push(totalPages);
            }
        }

        return buttons;
    };

    const handleAction = (action, product) => {
        console.log(`${action} action for product:`, product);
        alert(`${action} action clicked for ${product.productName}`);
        // Implement actual view/edit/delete logic here
    };

    const handleProductAdded = (newProduct) => {
        setProducts(prev => [...prev, {
            _id: newProduct._id || Date.now().toString(),
            productId: newProduct.productId || `PID-${Date.now()}`,
            productName: newProduct.productName || 'New Product',
            collectionName: newProduct.collection || 'New Collection',
            quantity: newProduct.quantity || 0,
            normalPrice: newProduct.normalPrice || 0,
            offerPrice: newProduct.offerPrice || 0,
            material: newProduct.material || 'Not specified',
            size: newProduct.size || 'Not specified'
        }]);
    };

    if (isLoading) {
        return (
            <div className="flex h-screen bg-gray-100">
                <div className="m-auto text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-lg text-gray-700">Loading products...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen bg-gray-100">
                <div className="m-auto text-center">
                    <p className="text-red-500 text-lg mb-4">{error}</p>
                    <button 
                        onClick={fetchProducts}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            <div className={`flex-1 flex flex-col overflow-hidden ${isSidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300`}>
                <NavBar toggleSidebar={toggleSidebar} />

                <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">All Products</h1>
                                <p className="text-gray-600 text-sm md:text-base">
                                    Total Products:{" "}
                                    <span className="font-semibold text-blue-600">
                                        {filteredProducts.length}
                                    </span>
                                    {filteredProducts.length > 0 && (
                                        <span className="ml-2 text-xs md:text-sm">
                                            (Showing {startIndex + 1}-
                                            {Math.min(endIndex, filteredProducts.length)} of{" "}
                                            {filteredProducts.length})
                                        </span>
                                    )}
                                </p>
                            </div>

                            <div className="flex flex-col md:flex-row items-stretch md:items-center w-full md:w-auto gap-3">
                                <div className="relative w-full md:w-64 lg:w-80">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        autoComplete="off"
                                        autoCorrect="off"
                                        spellCheck="false"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    />
                                </div>

                                <button
                                    onClick={() => setShowAddProductModal(true)}
                                    className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors whitespace-nowrap"
                                >
                                    <Plus className="h-5 w-5 mr-2" />
                                    <span>Add Product</span>
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Sl No
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Product ID
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Product Name
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Collection
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Quantity
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {currentProducts.length > 0 ? (
                                            currentProducts.map((product, index) => (
                                                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {startIndex + index + 1}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-blue-600">
                                                            {product.productId}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {product.productName}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap">
                                                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                                                            {product.collectionName}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap">
                                                        <div
                                                            className={`text-sm font-medium ${
                                                                product.quantity < 20
                                                                    ? "text-red-600"
                                                                    : product.quantity < 50
                                                                        ? "text-yellow-600"
                                                                        : "text-green-600"
                                                            }`}
                                                        >
                                                            {product.quantity}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => handleAction("View", product)}
                                                                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                                                                title="View Product"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleAction("Edit", product)}
                                                                className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-full transition-colors"
                                                                title="Edit Product"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleAction("Delete", product)}
                                                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
                                                                title="Delete Product"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-4 text-center">
                                                    <p className="text-gray-500">
                                                        {searchTerm 
                                                            ? "No products match your search criteria." 
                                                            : "No products available. Add a product to get started."}
                                                    </p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {filteredProducts.length > itemsPerPage && (
                                <div className="px-4 py-3 flex flex-col md:flex-row items-center justify-between border-t border-gray-200">
                                    <div className="text-sm text-gray-700 mb-2 md:mb-0">
                                        Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                                        <span className="font-medium">
                                            {Math.min(endIndex, filteredProducts.length)}
                                        </span>{" "}
                                        of <span className="font-medium">{filteredProducts.length}</span>{" "}
                                        results
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <button
                                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className={`px-3 py-1 rounded-md ${
                                                currentPage === 1
                                                    ? "text-gray-400 cursor-not-allowed"
                                                    : "text-gray-700 hover:bg-gray-100"
                                            }`}
                                        >
                                            <ChevronLeft className="h-5 w-5" />
                                        </button>

                                        {getPaginationButtons().map((button, index) => (
                                            <React.Fragment key={index}>
                                                {button === "..." ? (
                                                    <span className="px-2 py-1">...</span>
                                                ) : (
                                                    <button
                                                        onClick={() => setCurrentPage(button)}
                                                        className={`px-3 py-1 rounded-md ${
                                                            currentPage === button
                                                                ? "bg-blue-600 text-white"
                                                                : "text-gray-700 hover:bg-gray-100"
                                                        }`}
                                                    >
                                                        {button}
                                                    </button>
                                                )}
                                            </React.Fragment>
                                        ))}

                                        <button
                                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className={`px-3 py-1 rounded-md ${
                                                currentPage === totalPages
                                                    ? "text-gray-400 cursor-not-allowed"
                                                    : "text-gray-700 hover:bg-gray-100"
                                            }`}
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {showAddProductModal && (
                        <AddProductModal
                            isOpen={showAddProductModal}
                            onClose={() => setShowAddProductModal(false)}
                            onProductAdded={handleProductAdded}
                        />
                    )}
                </main>
            </div>
        </div>
    );
};

export default ProductListPage;