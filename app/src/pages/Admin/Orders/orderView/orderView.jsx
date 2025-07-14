import React, { useState, useEffect } from 'react';
import { Edit3, Package, Calendar, CreditCard, Truck, Hash, ShoppingBag, Clock, CheckCircle, XCircle, X, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import AddressDetails from "./addressDetails";
import ProductDetails from "./productDetails";
import UserDetails from "./userDetails";
import PaymentDetailsPopup from './paymentDetails';
import axios from 'axios';
import baseUrl from '../../../../url';
import toast, { Toaster } from 'react-hot-toast';

const OrderDetailsPage = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);
    const [showPaymentPopup, setShowPaymentPopup] = useState(false);
    const [showProcessingPopup, setShowProcessingPopup] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    // Consolidated edit mode state
    const [editMode, setEditMode] = useState({
        paymentStatus: false,
        orderStatus: false,
        deliveryDate: false,
        trackId: false
    });

    // Main order data state
    const [orderData, setOrderData] = useState({
        orderId: '',
        productId: '',
        customerId: '',
        paymentType: '',
        paymentStatus: '',
        orderStatus: '',
        orderedDate: '',
        deliveryDate: '',
        trackId: '',
        size: '',
        qty: '',
        productImage: ''
    });

    // Related data states
    const [userData, setUserData] = useState(null);
    const [productData, setProductData] = useState(null);
    const [addressData, setAddressData] = useState(null);
    const [productImage, setProductImage] = useState(null);

    // Fetch all order related data
    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                setLoading(true);
                // Fetch order data
                const orderResponse = await axios.get(`${baseUrl}/order/get/order/${id}`);
                const order = orderResponse.data.order;
                console.log("Order Details :", order)

                // Format order data
                const formattedOrderData = {
                    orderId: order.orderID,
                    productId: order.productId,
                    customerId: order.customerId,
                    paymentType: order.paymentType,
                    paymentStatus: order.paymentStatus,
                    orderStatus: order.orderStatus,
                    orderedDate: order.orderDate,
                    deliveryDate: order.deliveredDate || '',
                    trackId: order.trackId || 'Not assigned',
                    size: order.size,
                    qty: order.qty,
                    productImage: order.productImage || ''
                };
                setOrderData(formattedOrderData);

                // Fetch user data
                const userResponse = await axios.get(`${baseUrl}/auth/get/user/${order.customerId}`);
                setUserData(userResponse.data.user);

                // Fetch product data
                const productResponse = await axios.get(`${baseUrl}/product/get/${order.productId}`);
                setProductData(productResponse.data.product);
                setProductImage(productResponse.data.images)

                // Fetch address data
                const addressResponse = await axios.get(`${baseUrl}/address/get/address/order/${order.addressId}`);
                setAddressData(addressResponse.data.address);

            } catch (err) {
                console.error('Error fetching data:', err);
                toast.error('Failed to load order data');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderData();
    }, [id]);

    const handleEditToggle = (field) => {
        setEditMode(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
        setSaveError(null);
    };

    const handleSave = async (field, value) => {
        if (orderData[field] === value) {
            handleEditToggle(field);
            return;
        }

        try {
            setSaving(true);
            setShowProcessingPopup(true);
            
            // Optimistic UI update
            setOrderData(prev => ({ ...prev, [field]: value }));
            
            // Map frontend field names to backend field names
            const fieldMap = {
                orderId: 'orderID',
                orderedDate: 'orderDate',
                deliveryDate: 'deliveredDate'
            };
            
            const backendField = fieldMap[field] || field;
            console.log(backendField, value);
            
            const res = await axios.put(`${baseUrl}/order/edit/${id}`, {
                [backendField]: value
            });
            
            if (res.status === 200) {
                toast.success(res.data.message);
                handleEditToggle(field);
            } else {
                toast.error("Something went wrong");
            }

        } catch (err) {
            console.error('Error updating order:', err);
            setSaveError(`Failed to update ${field}. Please try again.`);
            toast.error(`Failed to update ${field}`);
            // Revert optimistic update
            setOrderData(prev => ({ ...prev, [field]: orderData[field] }));
        } finally {
            setSaving(false);
            setShowProcessingPopup(false);
        }
    };

    const handleInputSave = (field, e) => {
        if (e.key === 'Enter' || e.type === 'blur') {
            handleSave(field, e.target.value);
        }
    };

    const getStatusColor = (status) => {
        if (!status) return 'text-gray-600 bg-gray-100';
        switch (status.toLowerCase()) {
            case 'paid':
            case 'confirmed':
            case 'delivered':
                return 'text-green-600 bg-green-100';
            case 'pending':
                return 'text-yellow-600 bg-yellow-100';
            case 'failed':
            case 'cancelled':
                return 'text-red-600 bg-red-100';
            case 'processing':
                return 'text-blue-600 bg-blue-100';
            case 'shipped':
                return 'text-purple-600 bg-purple-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusIcon = (status) => {
        if (!status) return <Clock className="w-4 h-4" />;
        switch (status.toLowerCase()) {
            case 'paid':
            case 'confirmed':
            case 'delivered':
                return <CheckCircle className="w-4 h-4" />;
            case 'failed':
            case 'cancelled':
                return <XCircle className="w-4 h-4" />;
            case 'shipped':
                return <Truck className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not available';
        try {
            return new Date(dateString).toLocaleString();
        } catch {
            return dateString;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 relative">
            {/* Processing Popup */}
            {showProcessingPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <div className="flex flex-col items-center">
                            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Processing Update</h3>
                            <p className="text-gray-600 text-center">Please wait while we update your changes...</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                <div className="flex justify-end">
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-6 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-full"
                        disabled={loading || saving}
                    >
                        <X />
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Details</h1>
                    <p className="text-gray-600">Manage and track your order information</p>
                </div>

                {loading ? (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex justify-center">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    </div>
                ) : (
                    <>
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Information</h2>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    {saveError && (
                                        <div className="p-2 bg-red-100 text-red-700 rounded text-sm">
                                            {saveError}
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1">
                                                <Hash className="w-4 h-4" />
                                                Order ID
                                            </label>
                                            <p className="text-gray-800 font-mono">{orderData.orderId}</p>
                                        </div>

                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1">
                                                <CreditCard className="w-4 h-4" />
                                                Payment Type
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <p className="text-gray-800 capitalize">{orderData.paymentType}</p>
                                                {orderData.paymentType?.toLowerCase() === 'upi' && (
                                                    <button
                                                        onClick={() => setShowPaymentPopup(false)}
                                                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                                                        disabled={saving}
                                                    >
                                                        View UPI Details
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1">
                                                <CheckCircle className="w-4 h-4" />
                                                Payment Status
                                                <button 
                                                    onClick={() => handleEditToggle('paymentStatus')} 
                                                    className="text-blue-600 hover:text-blue-800"
                                                    disabled={saving}
                                                >
                                                    {editMode.paymentStatus && saving ? (
                                                        <Loader2 className="w-3 h-3 animate-spin" />
                                                    ) : (
                                                        <Edit3 className="w-3 h-3" />
                                                    )}
                                                </button>
                                            </label>
                                            {editMode.paymentStatus ? (
                                                <select
                                                    value={orderData.paymentStatus}
                                                    onChange={(e) => handleSave('paymentStatus', e.target.value)}
                                                    className="border rounded px-2 py-1 text-sm"
                                                    disabled={saving}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="paid">Paid</option>
                                                    <option value="failed">Failed</option>
                                                </select>
                                            ) : (
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm ${getStatusColor(orderData.paymentStatus)}`}>
                                                    {getStatusIcon(orderData.paymentStatus)}
                                                    {orderData.paymentStatus || 'Unknown'}
                                                </span>
                                            )}
                                        </div>

                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1">
                                                <Package className="w-4 h-4" />
                                                Order Status
                                                <button 
                                                    onClick={() => handleEditToggle('orderStatus')} 
                                                    className="text-blue-600 hover:text-blue-800"
                                                    disabled={saving}
                                                >
                                                    {editMode.orderStatus && saving ? (
                                                        <Loader2 className="w-3 h-3 animate-spin" />
                                                    ) : (
                                                        <Edit3 className="w-3 h-3" />
                                                    )}
                                                </button>
                                            </label>
                                            {editMode.orderStatus ? (
                                                <select
                                                    value={orderData.orderStatus}
                                                    onChange={(e) => handleSave('orderStatus', e.target.value)}
                                                    className="border rounded px-2 py-1 text-sm"
                                                    disabled={saving}
                                                >
                                                    <option value="Processing">Processing</option>
                                                    <option value="Confirmed">Confirm</option>
                                                    <option value="Shipped">Shipped</option>
                                                    <option value="Delivered">Delivered</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                            ) : (
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm ${getStatusColor(orderData.orderStatus)}`}>
                                                    {getStatusIcon(orderData.orderStatus)}
                                                    {orderData.orderStatus || 'Unknown'}
                                                </span>
                                            )}
                                        </div>

                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1">
                                                <Calendar className="w-4 h-4" />
                                                Delivery Date
                                                <button 
                                                    onClick={() => handleEditToggle('deliveryDate')} 
                                                    className="text-blue-600 hover:text-blue-800"
                                                    disabled={saving}
                                                >
                                                    {editMode.deliveryDate && saving ? (
                                                        <Loader2 className="w-3 h-3 animate-spin" />
                                                    ) : (
                                                        <Edit3 className="w-3 h-3" />
                                                    )}
                                                </button>
                                            </label>
                                            {editMode.deliveryDate ? (
                                                <input
                                                    type="datetime-local"
                                                    defaultValue={orderData.deliveryDate}
                                                    onBlur={(e) => handleInputSave('deliveryDate', e)}
                                                    onKeyPress={(e) => handleInputSave('deliveryDate', e)}
                                                    className="border rounded px-2 py-1 text-sm"
                                                    disabled={saving}
                                                />
                                            ) : (
                                                <p className="text-gray-800">{formatDate(orderData.deliveryDate)}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1">
                                                <Truck className="w-4 h-4" />
                                                Track ID
                                                <button 
                                                    onClick={() => handleEditToggle('trackId')} 
                                                    className="text-blue-600 hover:text-blue-800"
                                                    disabled={saving}
                                                >
                                                    {editMode.trackId && saving ? (
                                                        <Loader2 className="w-3 h-3 animate-spin" />
                                                    ) : (
                                                        <Edit3 className="w-3 h-3" />
                                                    )}
                                                </button>
                                            </label>
                                            {editMode.trackId ? (
                                                <input
                                                    type="text"
                                                    placeholder={orderData.trackId}
                                                    onBlur={(e) => handleInputSave('trackId', e)}
                                                    onKeyPress={(e) => handleInputSave('trackId', e)}
                                                    className="border rounded px-2 py-1 text-sm"
                                                    disabled={saving}
                                                />
                                            ) : (
                                                <p className="text-gray-800 font-mono">{orderData.trackId}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-gray-600 mb-1">Size</label>
                                            <p className="text-gray-800">{orderData.size || 'N/A'}</p>
                                        </div>

                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1">
                                                <ShoppingBag className="w-4 h-4" />
                                                Quantity
                                            </label>
                                            <p className="text-gray-800">{orderData.qty || '0'}</p>
                                        </div>

                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1">
                                                <Clock className="w-4 h-4" />
                                                Ordered Date
                                            </label>
                                            <p className="text-gray-800">{orderData.orderedDate}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <UserDetails userData={userData} loading={loading} />
                            <ProductDetails productData={productData} loading={loading} productImage={productImage} />
                            <AddressDetails addressData={addressData} loading={loading} />
                        </div>
                    </>
                )}
            </div>

            {showPaymentPopup && (
                <PaymentDetailsPopup onClose={() => setShowPaymentPopup(false)} />
            )}
            <Toaster />
        </div>
    );
};

export default OrderDetailsPage;