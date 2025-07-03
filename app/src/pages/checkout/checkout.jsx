import React, { useState } from 'react';
import { CreditCard, MapPin, User, Mail, Phone, Home, Check, Smartphone, Banknote, CheckCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function CheckoutPage() {
  const location = useLocation();
  const { product } = location.state || {};
  console.log(product)
  const [currentStep, setCurrentStep] = useState('checkout'); // 'checkout', 'payment', 'confirmed'
  const [useAccountAddress, setUseAccountAddress] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState('');
  
  // Dummy account address
  const accountAddress = {
    email: 'john.doe@example.com',
    firstName: 'John Doe',
    phone: '+91 98765 43210',
    address: '123 MG Road, Koramangala',
    place: 'Apartment 4B, Sterling Heights',
    city: 'Bangalore',
    pincode: '560034'
  };

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    phone: '',
    address: '',
    place: '',
    city: '',
    pincode: ''
  });

  // Sample cart items for the invoice
  const cartItems = [
    { id: 1, name: 'Gold Chain Necklace', price: 2499.99, quantity: 1 },
    { id: 2, name: 'Diamond Earrings', price: 1899.99, quantity: 1 },
    { id: 3, name: 'Silver Bracelet', price: 599.99, quantity: 2 }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.03; // 3% tax
  const shipping = 99.99;
  const total = subtotal + tax + shipping;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressToggle = (checked) => {
    setUseAccountAddress(checked);
    if (checked) {
      setFormData(accountAddress);
    } else {
      setFormData({
        email: '',
        firstName: '',
        phone: '',
        address: '',
        place: '',
        city: '',
        pincode: ''
      });
    }
  };

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setCurrentStep('payment');
  };

  const handlePayment = async () => {
    if (!selectedPaymentMode) {
      alert('Please select a payment mode');
      return;
    }
    
    setIsLoading(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setCurrentStep('confirmed');
  };

  if (currentStep === 'confirmed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600">Thank you for your purchase</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Order Details</h3>
            <p className="text-sm text-gray-600">Order #: ORD-2024-001</p>
            <p className="text-sm text-gray-600">Total: ₹{total.toFixed(2)}</p>
            <p className="text-sm text-gray-600">Payment: {selectedPaymentMode === 'googlepay' ? 'Google Pay' : 'Cash on Delivery'}</p>
          </div>
          
          <div className="text-sm text-gray-600 mb-6">
            <p>Expected delivery: 3-5 business days</p>
            <p>You will receive SMS updates on your order</p>
          </div>
          
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (currentStep === 'payment') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Payment Method</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Select Payment Mode</h2>
            
            <div className="space-y-4 mb-8">
              <div 
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedPaymentMode === 'googlepay' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPaymentMode('googlepay')}
              >
                <div className="flex items-center">
                  <Smartphone className="w-6 h-6 text-blue-600 mr-3" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">Google Pay</h3>
                    <p className="text-sm text-gray-600">Pay securely with Google Pay</p>
                  </div>
                  {selectedPaymentMode === 'googlepay' && (
                    <Check className="w-5 h-5 text-blue-600" />
                  )}
                </div>
              </div>
              
              <div 
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedPaymentMode === 'cod' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPaymentMode('cod')}
              >
                <div className="flex items-center">
                  <Banknote className="w-6 h-6 text-green-600 mr-3" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">Cash on Delivery</h3>
                    <p className="text-sm text-gray-600">Pay when you receive your order</p>
                  </div>
                  {selectedPaymentMode === 'cod' && (
                    <Check className="w-5 h-5 text-blue-600" />
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-gray-800 mb-2">Order Total</h3>
              <p className="text-2xl font-bold text-gray-900">₹{total.toFixed(2)}</p>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setCurrentStep('checkout')}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition duration-200 font-medium"
              >
                Back to Checkout
              </button>
              <button
                onClick={handlePayment}
                disabled={isLoading || !selectedPaymentMode}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 font-medium flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  'Complete Order'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Checkout</h1>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-6">
              
              {/* Address Toggle */}
              <div className="border-b border-gray-200 pb-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useAccountAddress}
                    onChange={(e) => handleAddressToggle(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    Add my account Address
                  </span>
                </label>
              </div>
              
              {/* Customer Details */}
              {!useAccountAddress && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Customer Details
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="John"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="+91 98765 43210"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Delivery Details */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Delivery Details
                </h2>
                
                {useAccountAddress ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                    <div className="flex items-center text-blue-700 mb-2">
                      <Check className="w-4 h-4 mr-2" />
                      <span className="font-medium">Using Account Address</span>
                    </div>
                    <p className="text-sm text-gray-700"><strong>Name:</strong> {accountAddress.firstName}</p>
                    <p className="text-sm text-gray-700"><strong>Email:</strong> {accountAddress.email}</p>
                    <p className="text-sm text-gray-700"><strong>Phone:</strong> {accountAddress.phone}</p>
                    <p className="text-sm text-gray-700"><strong>Address:</strong> {accountAddress.address}</p>
                    <p className="text-sm text-gray-700"><strong>Place:</strong> {accountAddress.place}</p>
                    <p className="text-sm text-gray-700"><strong>City:</strong> {accountAddress.city}</p>
                    <p className="text-sm text-gray-700"><strong>Pincode:</strong> {accountAddress.pincode}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <div className="relative">
                        <Home className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="123 Main Street"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Place
                      </label>
                      <input
                        type="text"
                        name="place"
                        value={formData.place}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Apartment, suite, etc."
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Bangalore"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Pincode
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="560001"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Submit Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 font-medium flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  'Place Order'
                )}
              </button>
            </div>
          </div>

          {/* Right Side - Receipt Style Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Receipt Header */}
            <div className="text-center border-b-2 border-gray-200 pb-4 mb-6">
              <h1 className="text-2xl font-bold text-gray-900">RAYA JEWELS</h1>
              <p className="text-sm text-gray-600 mt-1">Premium Jewelry Collection</p>
              <p className="text-xs text-gray-500 mt-1">Order #: ORD-2024-001</p>
            </div>
            
            {/* Receipt Items */}
            <div className="space-y-3 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-start text-sm">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{item.name}</h3>
                    <p className="text-gray-600">₹{item.price.toFixed(2)} x {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Receipt Totals */}
            <div className="border-t border-gray-200 pt-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (3%):</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>₹{shipping.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>TOTAL:</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Receipt Footer */}
            <div className="mt-6 pt-4 border-t border-gray-200 text-center">
              <div className="text-xs text-gray-500 space-y-1">
                <p>Thank you for choosing RAYA JEWELS</p>
                <p>Estimated delivery: 3-5 business days</p>
                <p>Free returns within 30 days</p>
                <div className="flex items-center justify-center mt-3">
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Secure SSL encryption</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}