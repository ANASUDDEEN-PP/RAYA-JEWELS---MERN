import React, { useState } from 'react';
import { Package, Truck, Calendar, CreditCard, User, Phone, Mail, ChevronRight } from 'lucide-react';
import NavBar from '../../components/navBar';

export default function OrderDetailsPage() {
    const [selectedOrderId, setSelectedOrderId] = useState('#ORD-2024-001');

    // Sample orders data
    const ordersData = {
        '#ORD-2024-001': {
            orderId: '#ORD-2024-001',
            orderDate: '2024-06-28',
            status: 'Shipped',
            trackingNumber: 'TRK123456789',
            product: {
                name: 'Premium Wireless Headphones',
                brand: 'AudioTech Pro',
                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
                price: 299.99,
                quantity: 1,
                sku: 'ATP-WH-001'
            },
            payment: {
                method: 'Credit Card',
                last4: '****1234',
                total: 315.98,
                shipping: 15.99
            },
            customer: {
                name: 'John Doe',
                email: 'john.doe@email.com',
                phone: '+1 (555) 123-4567'
            }
        },
        '#ORD-2024-002': {
            orderId: '#ORD-2024-002',
            orderDate: '2024-06-25',
            status: 'Delivered',
            trackingNumber: 'TRK987654321',
            product: {
                name: 'Smart Watch Series 5',
                brand: 'TechWear',
                image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
                price: 399.99,
                quantity: 1,
                sku: 'TW-SW-005'
            },
            payment: {
                method: 'PayPal',
                last4: '****9876',
                total: 419.98,
                shipping: 19.99
            },
            customer: {
                name: 'John Doe',
                email: 'john.doe@email.com',
                phone: '+1 (555) 123-4567'
            }
        },
        '#ORD-2024-003': {
            orderId: '#ORD-2024-003',
            orderDate: '2024-06-20',
            status: 'Processing',
            trackingNumber: null,
            product: {
                name: 'Wireless Gaming Mouse',
                brand: 'GamePro',
                image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop',
                price: 89.99,
                quantity: 2,
                sku: 'GP-WM-012'
            },
            payment: {
                method: 'Credit Card',
                last4: '****5678',
                total: 199.97,
                shipping: 19.99
            },
            customer: {
                name: 'John Doe',
                email: 'john.doe@email.com',
                phone: '+1 (555) 123-4567'
            }
        }
    };

    const currentOrder = ordersData[selectedOrderId];
    const ordersList = Object.values(ordersData);

    const handleCancelOrder = () => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            alert('Order cancellation request submitted. You will receive a confirmation email shortly.');
        }
    };

    const handleTrackOrder = () => {
        if (currentOrder.trackingNumber) {
            alert(`Tracking order ${currentOrder.trackingNumber}. Redirecting to tracking page...`);
        } else {
            alert('Tracking information is not yet available for this order.');
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'delivered': return 'text-green-600 bg-green-100';
            case 'shipped': return 'text-blue-600 bg-blue-100';
            case 'processing': return 'text-yellow-600 bg-yellow-100';
            case 'cancelled': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <>
            <NavBar />
            <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Details</h1>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                                <span className="text-lg font-medium text-gray-600">Order {currentOrder.orderId}</span>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentOrder.status)}`}>
                                    {currentOrder.status}
                                </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                                <Calendar className="w-4 h-4 mr-2" />
                                Ordered on {new Date(currentOrder.orderDate).toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                        {/* Orders List */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Orders</h2>
                                <div className="space-y-3">
                                    {ordersList.map((order) => (
                                        <div
                                            key={order.orderId}
                                            onClick={() => setSelectedOrderId(order.orderId)}
                                            className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedOrderId === order.orderId
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm text-gray-900">{order.orderId}</p>
                                                    <p className="text-xs text-gray-600 mt-1">
                                                        {new Date(order.orderDate).toLocaleDateString()}
                                                    </p>
                                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-gray-400" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-3 space-y-6">

                            {/* Product Information */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                    <Package className="w-5 h-5 mr-2" />
                                    Product Details
                                </h2>

                                <div className="flex flex-col sm:flex-row gap-6">
                                    {/* Product Image */}
                                    <div className="flex-shrink-0">
                                        <img
                                            src={currentOrder.product.image}
                                            alt={currentOrder.product.name}
                                            className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                                        />
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1">
                                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                                            {currentOrder.product.name}
                                        </h3>
                                        <p className="text-gray-600 mb-2">{currentOrder.product.brand}</p>
                                        <p className="text-sm text-gray-500 mb-2">SKU: {currentOrder.product.sku}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Quantity: {currentOrder.product.quantity}</span>
                                            <span className="text-xl font-bold text-gray-900">
                                                ${currentOrder.product.price.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button
                                            onClick={handleTrackOrder}
                                            className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                        >
                                            <Truck className="w-4 h-4 mr-2" />
                                            Track Order
                                        </button>
                                        <button
                                            onClick={handleCancelOrder}
                                            className="flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                                        >
                                            Cancel Order
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Payment Information */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <CreditCard className="w-5 h-5 mr-2" />
                                        Payment Details
                                    </h3>

                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Subtotal</span>
                                            <span className="font-medium">${(currentOrder.payment.total - currentOrder.payment.shipping).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Shipping</span>
                                            <span className="font-medium">${currentOrder.payment.shipping.toFixed(2)}</span>
                                        </div>
                                        <div className="border-t pt-3 flex justify-between">
                                            <span className="font-semibold text-gray-900">Total</span>
                                            <span className="font-bold text-gray-900">${currentOrder.payment.total.toFixed(2)}</span>
                                        </div>

                                        <div className="mt-4 pt-4 border-t">
                                            <p className="text-sm text-gray-600">Payment Method</p>
                                            <p className="font-medium text-gray-900">
                                                {currentOrder.payment.method} {currentOrder.payment.last4}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Customer Information */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <User className="w-5 h-5 mr-2" />
                                        Customer Info
                                    </h3>

                                    <div className="space-y-3">
                                        <div className="flex items-center">
                                            <User className="w-4 h-4 mr-2 text-gray-400" />
                                            <span className="text-gray-900">{currentOrder.customer.name}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                            <span className="text-gray-900">{currentOrder.customer.email}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                            <span className="text-gray-900">{currentOrder.customer.phone}</span>
                                        </div>

                                        {currentOrder.trackingNumber && (
                                            <div className="mt-4 pt-4 border-t">
                                                <p className="text-sm text-gray-600">Tracking Number</p>
                                                <p className="font-medium text-blue-600">{currentOrder.trackingNumber}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}