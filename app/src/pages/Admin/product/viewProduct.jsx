import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Upload,
  Plus,
  X,
  Save,
  Camera,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import UnauthorizedPage from "../../../components/unauthorized Alert/unAuth";
import axios from "axios";
import baseUrl from "../../../url";

const ProductActionView = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState(null);
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseUrl}/product/get/${id}`);
        const data = response.data;
        console.log(data)

        // Transform API data to match our component structure
        const transformedProduct = {
          id: data.product._id,
          ProductId: data.product.ProductId,
          name: data.product.ProductName,
          description: data.product.Description,
          category: data.product.CollectionName,
          price: data.product.OfferPrice,
          originalPrice: data.product.NormalPrice,
          actualPrice: data.product.ActualPrice || data.product.NormalPrice, // Add actualPrice
          stock: data.product.Quantity,
          material: data.product.Material,
          size: data.product.Size,
          specifications: {
            Material: data.product.Material,
            Size: data.product.Size,
          },
          features: data.product.Description ? [data.product.Description] : [],
        };

        setProductData(transformedProduct);
        setImages(data.images.map(img => img.ImageUrl));
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsEditing(false);
    try {
      // Prepare updated data in the format your API expects
      const updatedData = {
        ProductName: productData.name,
        Description: productData.description,
        CollectionName: productData.category,
        OfferPrice: productData.price,
        NormalPrice: productData.originalPrice,
        ActualPrice: productData.actualPrice,
        Quantity: productData.stock,
        Material: productData.specifications.Material,
        Size: productData.specifications.Size,
      };

      console.log(updatedData)

      await axios.put(`${baseUrl}/product/update/${id}`, updatedData);
      // Optionally show success message
    } catch (err) {
      console.error("Error updating product:", err);
      // Optionally show error message
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedFiles([]);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`${baseUrl}/product/delete/${id}`);
        navigate(-1); // Go back after deletion
      } catch (err) {
        console.error("Error deleting product:", err);
      }
    }
  };

  const handleInputChange = (field, value) => {
    setProductData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSpecificationChange = (key, value) => {
    setProductData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value,
      },
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages((prev) => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    if (currentImageIndex >= images.length - 1) {
      setCurrentImageIndex(Math.max(0, images.length - 2));
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const isAdmin = JSON.parse(localStorage.getItem("adminCode"));
  if (!isAdmin && isAdmin !== "ADMRAYA1752604097026") {
    return <UnauthorizedPage />;
  }

  // Loading shimmer effect
  if (loading || !productData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <button className="p-2 rounded-lg">
                  <ArrowLeft className="w-5 h-5 text-gray-300" />
                </button>
                <div>
                  <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mt-1"></div>
                </div>
              </div>
              <div className="flex space-x-3">
                <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Image loading shimmer */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="aspect-square bg-gray-200 rounded-lg animate-pulse mb-4"></div>
                <div className="grid grid-cols-3 gap-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-200 rounded-md animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Details loading shimmer */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                <div className="space-y-4">
                  <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
                  <div className="grid grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                </div>

                <div className="space-y-4">
                  <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex justify-between">
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {isEditing ? "Edit Product" : "Product Details"}
                </h1>
                <p className="text-sm text-gray-500">
                  Manage your product information
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {!isEditing ? (
                <>
                  <button
                    onClick={handleEdit}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit Product</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Product Images */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Product Images
              </h2>

              {/* Main image display */}
              <div className="relative mb-4">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  {images.length > 0 ? (
                    <img
                      src={images[currentImageIndex]}
                      alt={productData.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <Camera className="w-12 h-12 mx-auto mb-2" />
                        <p>No images available</p>
                      </div>
                    </div>
                  )}

                  {/* Navigation arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow-md transition-all"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow-md transition-all"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Thumbnail strip */}
              {images.length > 1 && (
                <div className="max-h-64 overflow-y-auto mb-4">
                  <div className="grid grid-cols-3 gap-2">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <button
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-full aspect-square rounded-md overflow-hidden border-2 transition-all ${currentImageIndex === index
                              ? "border-blue-500 ring-2 ring-blue-200"
                              : "border-gray-200 hover:border-gray-300"
                            }`}
                        >
                          <img
                            src={image}
                            alt={`${productData.name} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                        {isEditing && (
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 shadow-md"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                        <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1 py-0.5 rounded">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Image count */}
              <div className="text-sm text-gray-500 text-center">
                {images.length > 0
                  ? `${currentImageIndex + 1} of ${images.length} images`
                  : "No images"}
              </div>
            </div>
          </div>

          {/* Center - Product Details */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              {!isEditing ? (
                /* Display Mode */
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {productData.name}
                    </h2>
                    <p className="text-lg text-gray-600 mb-4">
                      {productData.ProductId || "N/A"}
                    </p>

                    <div className="flex items-center space-x-4 mb-4">
                      <span className="text-3xl font-bold text-green-600">
                        ₹{productData.price}
                      </span>
                      {productData.originalPrice > productData.price && (
                        <span className="text-lg text-gray-500 line-through">
                          ₹{productData.originalPrice}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-4 mb-4">
                      <span className="text-lg font-medium">
                        Actual Price: <span className="text-gray-600">₹{productData.actualPrice}</span>
                      </span>
                    </div>

                    <div>
                      <span className="font-medium">Stock:</span>
                      <span
                        className={`ml-2 text-[20px] font-semibold ${productData.stock === 0
                            ? "text-gray-500"
                            : productData.stock <= 4
                              ? "text-red-600"
                              : productData.stock <= 7
                                ? "text-yellow-500"
                                : "text-green-600"
                          }`}
                      >
                        {productData.stock === 0 ? "Out of Stock" : `${productData.stock} units`}
                      </span>

                      {productData.stock === 0 && (
                        <p className="text-red-500 text-sm mt-1">Out of Stock</p>
                      )}

                      {productData.stock > 0 && productData.stock <= 4 && (
                        <p className="text-white bg-red-500 text-sm mt-1 p-2 animate-pulse">Limited Stock!...Please restock</p>
                      )}

                      {productData.stock > 4 && productData.stock <= 7 && (
                        <p className="text-white bg-yellow-500 text-sm mt-1 p-2 animate-pulse">Stock running low. Consider restocking.</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                      <div>
                        <span className="font-medium">Category:</span>
                        <span className="ml-2">{productData.category}</span>
                      </div>
                      <div>
                        <span className="font-medium">Material:</span>
                        <span className="ml-2">{productData.specifications.Material || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Description
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {productData.description || "No description available"}
                    </p>
                  </div>

                  {/* Features */}
                  {productData.features.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Key Features
                      </h3>
                      <ul className="space-y-2">
                        {productData.features.map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-start text-gray-700"
                          >
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Specifications */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Specifications
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(productData.specifications).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between py-2 border-b border-gray-100 last:border-b-0"
                          >
                            <span className="font-medium text-gray-600">
                              {key}:
                            </span>
                            <span className="text-gray-900 text-right">
                              {value || "N/A"}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* Edit Mode */
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Edit Product Details
                  </h2>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Name
                      </label>
                      <input
                        type="text"
                        value={productData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        rows="4"
                        value={productData.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Selling Price
                        </label>
                        <input
                          type="number"
                          value={productData.price}
                          onChange={(e) =>
                            handleInputChange("price", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Original Price
                        </label>
                        <input
                          type="number"
                          value={productData.originalPrice}
                          onChange={(e) =>
                            handleInputChange("originalPrice", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Actual Price
                        </label>
                        <input
                          type="number"
                          value={productData.actualPrice}
                          onChange={(e) =>
                            handleInputChange("actualPrice", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stock
                      </label>
                      <input
                        type="number"
                        value={productData.stock}
                        onChange={(e) =>
                          handleInputChange("stock", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Features (one per line)
                      </label>
                      <textarea
                        rows="4"
                        value={productData.features.join("\n")}
                        onChange={(e) =>
                          handleInputChange(
                            "features",
                            e.target.value.split("\n")
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Specifications
                      </label>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              Material
                            </label>
                            <input
                              type="text"
                              value={productData.specifications.Material}
                              onChange={(e) =>
                                handleSpecificationChange("Material", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="e.g., Cotton, Silk"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              Size
                            </label>
                            <input
                              type="text"
                              value={productData.specifications.Size}
                              onChange={(e) =>
                                handleSpecificationChange("Size", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="e.g., S,M,L"
                            />
                            <p className="text-xs text-red-500 mt-1">
                              Add sizes separated by commas (e.g., S,M,L)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Add Images */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Manage Images
              </h2>

              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors mb-6">
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
                  className="cursor-pointer flex flex-col items-center space-y-3"
                >
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <span className="text-lg font-medium text-gray-900 block">
                      Upload Images
                    </span>
                    <span className="text-sm text-gray-600">
                      Click to browse or drag and drop
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    PNG, JPG, GIF up to 10MB each
                  </span>
                </label>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2">
                  <Camera className="w-5 h-5" />
                  <span>Take Photo</span>
                </button>

                <button className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Add from Gallery</span>
                </button>
              </div>

              {/* Image Stats */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Image Statistics
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Total Images:</span>
                    <span className="font-medium">{images.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Main Image:</span>
                    <span className="font-medium">
                      {images.length > 0 ? "Set" : "Not Set"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span
                      className={`font-medium ${images.length > 0 ? "text-green-600" : "text-orange-600"
                        }`}
                    >
                      {images.length > 0 ? "Ready" : "Needs Images"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-sm font-medium text-blue-900 mb-2">
                  💡 Tips
                </h3>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Use high-quality images (1200x1200px minimum)</li>
                  <li>• Show different angles of your product</li>
                  <li>• Include lifestyle shots when possible</li>
                  <li>• First image will be used as main display</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductActionView;