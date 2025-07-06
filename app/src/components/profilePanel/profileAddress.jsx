import React, { useState } from "react";
import { MapPin, Plus, Edit2, Trash2, Save, X, ArrowLeft } from "lucide-react";
import axios from "axios";
import baseUrl from "../../url";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";

const UserAddress = ({ onBack, user }) => {
    // console.log(user)
    const [addresses, setAddresses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        const fetchAddress = async() => {
            try{
                setIsLoading(true);
                const responce =await axios.get(`${baseUrl}/address/get/${user._id}`)
                console.log(responce)
                setAddresses(responce.data.address)
            } catch(err){
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchAddress();
    }, []);

    const [isAddingNew, setIsAddingNew] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        type: "Home",
        name: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        phone: ""
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAddNew = () => {
        setIsAddingNew(true);
        setFormData({
            type: "Home",
            name: "",
            address: "",
            city: "",
            state: "",
            zipCode: "",
            phone: ""
        });
    };

    const handleEdit = (address) => {
        setEditingId(address.id);
        setFormData(address);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (isAddingNew) {
                const newAddress = {
                    ...formData,
                    id: user._id,
                    isSaved : true
                };
                
                const responce = await axios.post(`${baseUrl}/address/add`, newAddress)
                if (responce.status === 200){
                    setAddresses(prev => [...prev, newAddress]);
                    toast.success(responce.data.message)
                    setIsAddingNew(false);
                    resetForm();
                }
                else
                    toast.error(responce.data.message);
            } else {
                // Add your edit API call here
                setAddresses(prev =>
                    prev.map(addr =>
                        addr.id === editingId ? { ...formData, id: editingId } : addr
                    )
                );
                setEditingId(null);
                resetForm();
                toast.success("Address updated successfully");
            }
        } catch (err) {
            console.log(err);
            toast.error("Something went wrong");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setIsAddingNew(false);
        setEditingId(null);
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            type: "Home",
            name: "",
            address: "",
            city: "",
            state: "",
            zipCode: "",
            phone: ""
        });
    };

    const handleDelete = async (id) => {
        setDeletingId(id);
        try {
            // Add your delete API call here
            // await axios.delete(`${baseUrl}/address/delete/${id}`);
            
            setAddresses(prev => prev.filter(addr => addr.id !== id));
            toast.success("Address deleted successfully");
        } catch (err) {
            console.log(err);
            toast.error("Failed to delete address");
        } finally {
            setDeletingId(null);
        }
    };

    const handleSetDefault = (id) => {
        setAddresses(prev =>
            prev.map(addr => ({
                ...addr,
                isDefault: addr.id === id
            }))
        );
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <button
                        onClick={onBack}
                        className="mr-3 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <h2 className="text-lg font-medium text-gray-900">My Addresses</h2>
                </div>
                {addresses.length > 0 && (
                    <button
                        onClick={handleAddNew}
                        disabled={isSaving}
                        className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                                Processing...
                            </>
                        ) : (
                            <>
                                <Plus className="h-4 w-4 mr-1" />
                                Add New
                            </>
                        )}
                    </button>
                )}
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Loading addresses...</span>
                </div>
            )}

            {/* No Data State */}
            {!isLoading && addresses.length === 0 && !isAddingNew && (
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-48 h-48 mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg 
                            className="w-24 h-24 text-gray-400" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={1.5} 
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={1.5} 
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No Address Have</h3>
                    <p className="text-gray-500 text-center mb-6 max-w-md">
                        You haven't added any addresses yet. Add your first address to get started with faster checkout.
                    </p>
                    <button
                        onClick={handleAddNew}
                        disabled={isSaving}
                        className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Processing...
                            </>
                        ) : (
                            <>
                                <Plus className="h-5 w-5 mr-2" />
                                Create Address
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Address List */}
            {!isLoading && addresses.length > 0 && (
                <div className="space-y-4">
                    {addresses.map((address) => (
                        <div
                            key={address.id}
                            className="p-4 border border-gray-200 rounded-lg"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center mb-2">
                                        <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                                        <span className="font-medium text-gray-900">{address.type}</span>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        <p className="font-medium">{address.name}</p>
                                        <p>{address.address}</p>
                                        <p>{address.city}, {address.state} {address.zipCode}</p>
                                        <p>{address.phone}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(address)}
                                        disabled={isSaving || deletingId === address.id}
                                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(address.id)}
                                        disabled={isSaving || deletingId === address.id}
                                        className="p-1 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {deletingId === address.id ? (
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                                        ) : (
                                            <Trash2 className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Form */}
            {(isAddingNew || editingId) && (
                <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        {isAddingNew ? 'Add New Address' : 'Edit Address'}
                    </h3>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Address Type
                                </label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => handleInputChange('type', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="Home">Home</option>
                                    <option value="Office">Office</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter full name"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Address
                            </label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter street address"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    City
                                </label>
                                <input
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) => handleInputChange('city', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter city"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    State
                                </label>
                                <input
                                    type="text"
                                    value={formData.state}
                                    onChange={(e) => handleInputChange('state', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter state"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    ZIP Code
                                </label>
                                <input
                                    type="text"
                                    value={formData.zipCode}
                                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter ZIP code"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter phone number"
                                />
                            </div>
                        </div>

                        <div className="flex space-x-3 pt-4">
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSaving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Address
                                    </>
                                )}
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={isSaving}
                                className="flex items-center px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Toaster />
        </div>
    );
};

export default UserAddress;