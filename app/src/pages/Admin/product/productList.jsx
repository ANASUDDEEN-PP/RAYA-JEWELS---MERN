import React, { useEffect, useState } from "react";
import {
  Search,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Upload,
  Check,
  Loader2,
} from "lucide-react";

import Sidebar from "../Components/sideBar";
import NavBar from "../Components/navBar";
import axios from "axios";
import baseUrl from "../../../url";

const ProductListPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSizeAlert, setShowSizeAlert] = useState(false);

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

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sample product data
  const [products] = useState([
    {
      id: 1,
      productId: "PRD001",
      productName: "Wireless Headphones",
      collectionName: "Electronics",
      quantity: 45,
    },
    {
      id: 2,
      productId: "PRD002",
      productName: "Gaming Mouse",
      collectionName: "Electronics",
      quantity: 23,
    },
    {
      id: 3,
      productId: "PRD003",
      productName: "Cotton T-Shirt",
      collectionName: "Clothing",
      quantity: 78,
    },
    {
      id: 4,
      productId: "PRD004",
      productName: "Running Shoes",
      collectionName: "Footwear",
      quantity: 12,
    },
    {
      id: 5,
      productId: "PRD005",
      productName: "Coffee Mug",
      collectionName: "Home & Kitchen",
      quantity: 156,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const itemsPerPage = 5;

  // Add Product Form State
  const [formData, setFormData] = useState({
    productName: "",
    collection: "",
    normalPrice: "",
    offerPrice: "",
    quantity: "",
    material: "",
    size: "",
    images: [],
  });

  // Available sizes
  const availableSizes = Array.from({ length: 18 }, (_, i) => i + 1);

  // Image upload state
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadingImages, setUploadingImages] = useState(new Set());

  // Filter products based on search term
  const filteredProducts = products.filter(
    (product) =>
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.collectionName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle size input focus
  const handleSizeFocus = () => {
    setShowSizeAlert(true);
    setTimeout(() => {
      setShowSizeAlert(false);
    }, 10000);
  };

  // Simulate image upload to backend
  const uploadImageToBackend = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Simulate upload progress
        let progress = 0;
        const imageId = Date.now() + Math.random();

        const progressInterval = setInterval(() => {
          progress += Math.random() * 30;
          if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);

            setUploadProgress((prev) => ({ ...prev, [imageId]: 100 }));
            setUploadingImages((prev) => {
              const newSet = new Set(prev);
              newSet.delete(imageId);
              return newSet;
            });

            resolve({
              id: imageId,
              base64: reader.result,
              name: file.name,
              uploaded: true,
            });
          } else {
            setUploadProgress((prev) => ({
              ...prev,
              [imageId]: Math.round(progress),
            }));
          }
        }, 200);

        setUploadingImages((prev) => new Set([...prev, imageId]));
        setUploadProgress((prev) => ({ ...prev, [imageId]: 0 }));
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    for (const file of files) {
      if (file.type.startsWith("image/")) {
        try {
          const uploadedImage = await uploadImageToBackend(file);
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, uploadedImage],
          }));
        } catch (error) {
          console.error("Upload failed:", error);
        }
      }
    }

    // Reset file input
    e.target.value = "";
  };

  // Handle image deletion
  const handleImageDelete = async (imageId) => {
    // Simulate backend deletion
    try {
      // Remove from form data
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((img) => img.id !== imageId),
      }));

      // Clean up progress tracking
      setUploadProgress((prev) => {
        const newProgress = { ...prev };
        delete newProgress[imageId];
        return newProgress;
      });

      console.log(`Image ${imageId} deleted from database`);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      const responce = await axios.post(`${baseUrl}/product/create`, formData);
      console.log(responce)

      console.log("Product data saved:", formData);

      // Reset form and close modal
      setFormData({
        productName: "",
        collection: "",
        normalPrice: "",
        offerPrice: "",
        quantity: "",
        material: "",
        size: "",
        images: [],
      });
      setShowAddProductModal(false);

      alert("Product added successfully!");
    } catch (error) {
      console.error("Submit failed:", error);
      alert("Failed to add product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate pagination buttons
  const getPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;

    if (totalPages <= maxVisibleButtons) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          buttons.push(i);
        }
        if (totalPages > 5) {
          buttons.push("...");
        }
      } else if (currentPage >= totalPages - 2) {
        buttons.push(1);
        buttons.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          buttons.push(i);
        }
      } else {
        buttons.push(1);
        buttons.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          buttons.push(i);
        }
        buttons.push("...");
        buttons.push(totalPages);
      }
    }

    return buttons;
  };

  const [collections, setCollections] = useState([]);

useEffect(() => {
  const fetchCollectionName = async () => {
    try {
      const response = await axios.get(`${baseUrl}/collection/get/collection/name`);
      // console.log(response.data);
      setCollections(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching collections:", error);
      setCollections([]);
    }
  };
  fetchCollectionName();
}, []);


  const handleAction = (action, product) => {
    alert(
      `${action} action clicked for ${product.productName} (${product.productId})`
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Navbar */}
        <NavBar toggleSidebar={toggleSidebar} />

        {/* Main Content Area */}
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
              {/* Left side - Title and Counter */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  All Products
                </h1>
                <p className="text-gray-600 text-lg">
                  Total Products:{" "}
                  <span className="font-semibold text-blue-600">
                    {filteredProducts.length}
                  </span>
                  {filteredProducts.length > 0 && (
                    <span className="ml-2 text-sm">
                      (Showing {startIndex + 1}-
                      {Math.min(endIndex, filteredProducts.length)} of{" "}
                      {filteredProducts.length})
                    </span>
                  )}
                </p>
              </div>

              {/* Right side - Search Bar and Add Button */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                {/* Add Product Button */}
                <button
                  onClick={() => setShowAddProductModal(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Product
                </button>
              </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sl No
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Collection Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentProducts.map((product, index) => (
                      <tr
                        key={product.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {startIndex + index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-blue-600">
                            {product.productId}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {product.productName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                            {product.collectionName}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
                    ))}
                  </tbody>
                </table>
              </div>

              {/* No results message */}
              {currentProducts.length === 0 &&
                filteredProducts.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-lg">
                      No products found matching your search.
                    </p>
                  </div>
                )}
            </div>

            {/* Pagination */}
            {filteredProducts.length > itemsPerPage && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(endIndex, filteredProducts.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{filteredProducts.length}</span>{" "}
                  results
                </div>
                <div className="flex items-center space-x-2">
                  {/* Previous button */}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </button>

                  {/* Page numbers */}
                  <div className="flex items-center space-x-1">
                    {getPaginationButtons().map((button, index) => (
                      <React.Fragment key={index}>
                        {button === "..." ? (
                          <span className="px-3 py-2 text-sm text-gray-500">
                            ...
                          </span>
                        ) : (
                          <button
                            onClick={() => setCurrentPage(button)}
                            className={`px-3 py-2 text-sm font-medium rounded-md ${
                              currentPage === button
                                ? "bg-blue-600 text-white"
                                : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                            }`}
                          >
                            {button}
                          </button>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Next button */}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      currentPage === totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Add Product Modal */}
          {showAddProductModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-lg">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Add New Product
                  </h2>
                  <button
                    onClick={() => setShowAddProductModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="h-6 w-6 text-gray-500" />
                  </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Product Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        name="productName"
                        value={formData.productName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Enter product name"
                      />
                    </div>

                    {/* Collection Dropdown */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Collection *
                      </label>
                      <select
                        name="collection"
                        value={formData.collection}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      >
                        <option value="">Select Collection</option>
                        {collections.map((collection) => (
                          <option key={collection.CollectionName} value={collection.CollectionName}>
                            {collection.CollectionName}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Normal Price */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Normal Price *
                      </label>
                      <input
                        type="number"
                        name="normalPrice"
                        value={formData.normalPrice}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="0.00"
                      />
                    </div>

                    {/* Offer Price */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Offer Price
                      </label>
                      <input
                        type="number"
                        name="offerPrice"
                        value={formData.offerPrice}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="0.00"
                      />
                    </div>

                    {/* Quantity */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        required
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="0"
                      />
                    </div>

                    {/* Material */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Material
                      </label>
                      <input
                        type="text"
                        name="material"
                        value={formData.material}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Enter material"
                      />
                    </div>
                  </div>

                  {/* Size Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Size
                    </label>
                    <input
                      type="text"
                      name="size"
                      value={formData.size}
                      onChange={handleInputChange}
                      onFocus={handleSizeFocus}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Enter size (e.g., S, M, L, XL)"
                    />
                    {showSizeAlert && (
                      <div className="mt-2 p-2 bg-blue-100 text-blue-800 text-sm rounded-lg">
                        Please enter sizes separated by commas (e.g., S, M, L, XL)
                      </div>
                    )}
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Product Images
                    </label>

                    {/* Upload Button */}
                    <div className="mb-4">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                      >
                        <div className="text-center">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">
                            Click to upload images
                          </p>
                          <p className="text-xs text-gray-400">
                            PNG, JPG, GIF up to 10MB each
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* Uploaded Images */}
                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {formData.images.map((image) => (
                          <div key={image.id} className="relative">
                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                              <img
                                src={image.base64}
                                alt={image.name}
                                className="w-full h-full object-cover transition-opacity duration-300"
                                style={{
                                  opacity: uploadingImages.has(image.id)
                                    ? (uploadProgress[image.id] || 1) / 100
                                    : 1,
                                }}
                              />
                            </div>

                            {/* Loading Overlay with Spinner and Progress */}
                            {uploadingImages.has(image.id) && (
                              <div className="absolute inset-0 flex items-center justify-center rounded-lg">
                                <div className="text-center">
                                  {/* Loading Spinner */}
                                  <div className="relative mb-3">
                                    <Loader2 className="h-8 w-8 animate-spin text-white drop-shadow-lg" />
                                    {/* Progress percentage in center of spinner */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <span className="text-xs font-bold text-white drop-shadow-lg">
                                        {uploadProgress[image.id] || 0}%
                                      </span>
                                    </div>
                                  </div>

                                  {/* Progress Bar */}
                                  <div className="w-24 bg-black bg-opacity-30 rounded-full h-2">
                                    <div
                                      className="bg-white rounded-full h-2 transition-all duration-300"
                                      style={{
                                        width: `${
                                          uploadProgress[image.id] || 0
                                        }%`,
                                      }}
                                    ></div>
                                  </div>

                                  {/* Upload text */}
                                  <p className="text-xs text-white drop-shadow-lg mt-2 font-medium">
                                    Uploading...
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Upload Complete Indicator */}
                            {image.uploaded &&
                              !uploadingImages.has(image.id) && (
                                <div className="absolute top-2 left-2 bg-green-500 text-white rounded-full p-1.5 shadow-lg">
                                  <Check className="h-4 w-4" />
                                </div>
                              )}

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => handleImageDelete(image.id)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg"
                              disabled={uploadingImages.has(image.id)}
                            >
                              <X className="h-4 w-4" />
                            </button>

                            {/* Image Name */}
                            <p className="text-xs text-gray-500 mt-2 truncate font-medium">
                              {image.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowAddProductModal(false)}
                      className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Submitting...
                        </>
                      ) : (
                        "Add Product"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;