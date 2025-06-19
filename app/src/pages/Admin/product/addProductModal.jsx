import React, { useState, useEffect, useCallback } from 'react';
import { X, Upload, Check, Loader2 } from "lucide-react";
import axios from 'axios';
import baseUrl from '../../../url';

const AddProductModel = ({ isOpen, onClose, onProductAdded }) => {
    const [collections, setCollections] = useState([]);
    const [showSizeAlert, setShowSizeAlert] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadingImages, setUploadingImages] = useState(new Set());
    const [uploadProgress, setUploadProgress] = useState({});

    // Initial form state
    const initialFormData = {
        productName: "",
        collection: "",
        normalPrice: "",
        offerPrice: "",
        quantity: "",
        material: "",
        size: "",
        images: [],
    };

    const [formData, setFormData] = useState(initialFormData);

    const fetchCollectionName = useCallback(async () => {
        try {
            const response = await axios.get(`${baseUrl}/collection/get/collection/name`);
            setCollections(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Error fetching collections:", error);
            setCollections([]);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            fetchCollectionName();
            // Reset form when opening
            setFormData(initialFormData);
        }
    }, [isOpen, fetchCollectionName]);

    const uploadImageToBackend = async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const imageId = Date.now() + Math.random();
            setUploadingImages(prev => new Set([...prev, imageId]));

            const response = await axios.post(`${baseUrl}/upload`, formData, {
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(prev => ({ ...prev, [imageId]: progress }));
                }
            });

            setUploadingImages(prev => {
                const newSet = new Set(prev);
                newSet.delete(imageId);
                return newSet;
            });

            return {
                id: imageId,
                url: response.data.url,
                name: file.name,
                uploaded: true,
            };
        } catch (error) {
            console.error("Upload failed:", error);
            throw error;
        }
    };

    const handleSizeFocus = () => {
        setShowSizeAlert(true);
        const timer = setTimeout(() => {
            setShowSizeAlert(false);
        }, 10000);
        return () => clearTimeout(timer);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageDelete = async (imageId) => {
        try {
            setFormData(prev => ({
                ...prev,
                images: prev.images.filter(img => img.id !== imageId),
            }));

            setUploadProgress(prev => {
                const newProgress = { ...prev };
                delete newProgress[imageId];
                return newProgress;
            });
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);

        try {
            const uploadPromises = files
                .filter(file => file.type.startsWith("image/"))
                .map(file => uploadImageToBackend(file));

            const uploadedImages = await Promise.all(uploadPromises);

            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...uploadedImages],
            }));
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Some images failed to upload");
        }

        e.target.value = "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.productName || !formData.collection || !formData.normalPrice || !formData.quantity) {
            alert("Please fill in all required fields");
            return;
        }

        if (formData.images.length === 0) {
            alert("Please upload at least one image");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await axios.post(`${baseUrl}/product/create`, {
                ...formData,
                images: formData.images.map(img => img.url)
            });

            console.log("Product created:", response.data);

            // Reset form
            setFormData(initialFormData);
            onClose();
            if (onProductAdded) onProductAdded(response.data);

            alert("Product added successfully!");
        } catch (error) {
            console.error("Submit failed:", error);
            alert(`Failed to add product: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-lg">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Add New Product
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Close modal"
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
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck="false"
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
                            Product Images *
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
                                                src={image.url}
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
                                            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black bg-opacity-30">
                                                <div className="text-center">
                                                    <div className="relative mb-3">
                                                        <Loader2 className="h-8 w-8 animate-spin text-white drop-shadow-lg" />
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <span className="text-xs font-bold text-white drop-shadow-lg">
                                                                {uploadProgress[image.id] || 0}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="w-24 bg-black bg-opacity-30 rounded-full h-2 mx-auto">
                                                        <div
                                                            className="bg-white rounded-full h-2 transition-all duration-300"
                                                            style={{
                                                                width: `${uploadProgress[image.id] || 0}%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <p className="text-xs text-white drop-shadow-lg mt-2 font-medium">
                                                        Uploading...
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Upload Complete Indicator */}
                                        {image.uploaded && !uploadingImages.has(image.id) && (
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
                            onClick={onClose}
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
    )
}

export default AddProductModel;