import React, { useState, useEffect } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Package, ArrowLeft, Calendar, CreditCard, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ShoppingCompletedPage = () => {
  const [showContent, setShowContent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Show content with delay for better UX
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const orderList = [
    { 
      id: '#ORD-001', 
      item: 'Wireless Bluetooth Headphones', 
      quantity: 1, 
      price: 129.99,
      image: '🎧'
    },
    { 
      id: '#ORD-002', 
      item: 'Premium Phone Case', 
      quantity: 2, 
      price: 39.98,
      image: '📱'
    },
    { 
      id: '#ORD-003', 
      item: 'USB-C Fast Charging Cable', 
      quantity: 1, 
      price: 19.99,
      image: '🔌'
    },
    { 
      id: '#ORD-004', 
      item: 'Portable Power Bank', 
      quantity: 1, 
      price: 49.99,
      image: '🔋'
    }
  ];

  const totalAmount = orderList.reduce((sum, item) => sum + item.price, 0);

  const handleBackToDashboard = () => {
    alert('Navigating back to dashboard...');
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-12 min-h-screen">
          
          {/* Left Side - Animation and Confirmation */}
          <div className="flex flex-col items-center justify-center space-y-8">
            
            {/* Large Confirmation Animation */}
            <div className={`transform transition-all duration-1000 ${
              showContent ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}>
              <div className="w-80 h-80 flex items-center justify-center">
                <DotLottieReact
                  src="https://lottie.host/eb94c284-5872-4830-90fd-d54d9c57bdcb/zkIqpYYk3x.lottie"
                  loop
                  autoplay
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Shopping Confirmed Text with Smaller Animation */}
            <div className={`text-center transform transition-all duration-1000 delay-300 ${
              showContent ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <div className="flex items-center justify-center space-x-4 mb-4"><h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Shopping Confirmed
                </h1>
              </div>
              <p className="text-xl text-gray-600 max-w-md">
                Your order has been successfully confirmed and will be processed shortly
              </p>
              
              {/* Status Cards */}
              <div className="grid grid-cols-2 gap-4 mt-8 max-w-sm">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-emerald-100">
                  <Calendar className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-800">Est. Delivery</p>
                  <p className="text-xs text-gray-600">3-5 Business Days</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-emerald-100">
                  <Truck className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-800">Tracking</p>
                  <p className="text-xs text-gray-600">Via Email & SMS</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Order Details */}
          <div className={`transform transition-all duration-1000 delay-500 ${
            showContent ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
          }`}>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 h-full flex flex-col">
              
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Order Summary</h2>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-semibold text-gray-800">{new Date().toLocaleDateString()}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="flex-1 space-y-4 mb-8">
                {orderList.map((order, index) => (
                  <div 
                    key={order.id}
                    className={`group p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300 transform ${
                      showContent ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                    }`}
                    style={{ transitionDelay: `${600 + index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                          {order.image}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors">
                            {order.item}
                          </h3>
                          <p className="text-sm text-gray-500">Order {order.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-800">${order.price.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">Qty: {order.quantity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Section */}
              <div className="border-t border-gray-200 pt-6 mb-8">
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-emerald-600 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>${(totalAmount * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-gray-200"></div>
                  <div className="flex justify-between text-xl font-bold text-gray-800">
                    <span>Total</span>
                    <span className="text-emerald-600">${(totalAmount * 1.08).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 mb-8">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-medium text-gray-700">Payment Method:</span>
                  <span className="text-sm text-gray-600">**** **** **** 1234</span>
                </div>
              </div>

              {/* Back to Dashboard Button */}
              <button
                onClick={handleBackToDashboard}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] flex items-center justify-center space-x-3"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCompletedPage;