import React, { useState, useEffect, useRef } from 'react';
import { CreditCard, MapPin, User, Mail, X, Phone, Home, Check, Smartphone, Banknote, CheckCircle, ChevronDown, Printer, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import baseUrl from '../../url';
import { useLocation, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState('checkout');
  const [selectedAddress, setSelectedAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState('');
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [saveAddress, setSaveAddress] = useState(false);
  const [showAddressWarning, setShowAddressWarning] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const receiptRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Handle both single product and array of products
  const { product } = location.state || {};
  const [cartItems, setCartItems] = useState(
    product 
      ? Array.isArray(product) 
        ? product 
        : [product]
      : []
  );

  const user = JSON.parse(localStorage.getItem('userProfile'));

  const [formData, setFormData] = useState({
    id : '',
    email: user?.email || '',
    firstName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  // Calculate totals safely
  const subtotal = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.OfferPrice || item.NormalPrice || 0);
    const quantity = parseInt(item.Quantity || 1);
    return sum + (price * quantity);
  }, 0);
  
  const total = subtotal;

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axios.get(`${baseUrl}/address/get/${user._id}`);
        const formattedAddresses = response.data.address.map(addr => ({
          ...addr,
          email: user.email
        }));
        setSavedAddresses(formattedAddresses);
      } catch (err) {
        console.error('Error fetching addresses:', err);
      } finally {
        setIsLoadingAddresses(false);
      }
    };
    fetchAddresses();
  }, [user._id]);

  // Check if form is filled for address warning
  useEffect(() => {
    if (selectedAddress === '') {
      const isFormFilled = formData.firstName && formData.phone && formData.address && 
                          formData.city && formData.state && formData.zipCode;
      setShowAddressWarning(isFormFilled && !saveAddress);
    } else {
      setShowAddressWarning(false);
    }
  }, [formData, saveAddress, selectedAddress]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressSelect = (e) => {
    const addressId = e.target.value;
    setSelectedAddress(addressId);
    setSaveAddress(false); // Reset save address checkbox when selecting saved address
    setShowAddressWarning(false);

    if (addressId === '') {
      setFormData({
        id: '',
        email: user?.email || '',
        firstName: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: ''
      });
    } else {
      const selectedAddressData = savedAddresses.find(addr => addr._id === addressId);
      console.log(selectedAddressData)
      if (selectedAddressData) {
        setFormData({
          id: selectedAddressData._id,
          email: selectedAddressData.email || user?.email || '',
          firstName: selectedAddressData.name,
          phone: selectedAddressData.phone,
          address: selectedAddressData.address,
          city: selectedAddressData.city,
          state: selectedAddressData.state,
          zipCode: selectedAddressData.zipCode
        });
      }
    }
  };

  const handleSaveAddressChange = (e) => {
    setSaveAddress(e.target.checked);
  };

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    try{
      const orderData = {
        productId : cartItems.map(item => item._id),
        customerId : user._id,
        paymentType : '',
        addressId : formData.id,
        address : formData.address,
        city: formData.city,
        name : formData.firstName,
        phone : formData.phone,
        state : formData.state,
        zipCode : formData.zipCode,
        saveAddress: saveAddress // Add save address flag to orderData
      }
      console.log(orderData)
      const response = await axios.post(`${baseUrl}/order/add`, orderData);
      console.log(response)
    } catch(err){
      console.log(err);
    }
    setIsLoading(false);
    setCurrentStep('payment');
  };

  const handlePayment = async () => {
    if (!selectedPaymentMode) {
      alert('Please select a payment mode');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setCurrentStep('confirmed');
  };

  const handlePrintReceipt = async () => {
    setIsPrinting(true);
    try {
      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      // Convert canvas to image
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      // Create a link and trigger download
      const link = document.createElement('a');
      link.download = `receipt-ORD-2024-001.jpg`;
      link.href = imgData;
      link.click();
    } catch (error) {
      console.error('Error generating receipt:', error);
      alert('Error generating receipt. Please try again.');
    } finally {
      setIsPrinting(false);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  if (currentStep === 'confirmed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
          <div ref={receiptRef} className="bg-white p-8">
            <div className="mb-6">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
              <p className="text-gray-600">Thank you for your purchase</p>
            </div>

            <div className="text-center border-b-2 border-gray-200 pb-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-900">RAYA JEWELS</h2>
              <p className="text-sm text-gray-600 mt-1">Premium Jewelry Collection</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Order Details</h3>
              <p className="text-sm text-gray-600">Order #: ORD-2024-001</p>
              <p className="text-sm text-gray-600">Date: {new Date().toLocaleDateString()}</p>
              <p className="text-sm text-gray-600">Total: ₹{total.toFixed(2)}</p>
              <p className="text-sm text-gray-600">Payment: {selectedPaymentMode === 'googlepay' ? 'Google Pay' : 'Cash on Delivery'}</p>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-2">Items Ordered:</h4>
              {cartItems.map((item, index) => (
                <div key={index} className="text-sm text-gray-600 mb-1">
                  {item.ProductName} - ₹{(parseFloat(item.OfferPrice || item.NormalPrice || 0) * parseInt(item.Quantity || 1)).toFixed(2)}
                </div>
              ))}
            </div>

            <div className="text-sm text-gray-600 mb-6">
              <p>Expected delivery: 3-5 business days</p>
              <p>You will receive SMS updates on your order</p>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={handlePrintReceipt}
              disabled={isPrinting}
              className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition duration-200 font-medium flex items-center justify-center"
            >
              {isPrinting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Generating...
                </div>
              ) : (
                <>
                  <Printer className="w-4 h-4 mr-2" />
                  Print Receipt
                </>
              )}
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
            >
              Continue Shopping
            </button>
          </div>
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
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${selectedPaymentMode === 'googlepay'
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
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${selectedPaymentMode === 'cod'
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
      <button onClick={goBack} className="ml-10 bg-gray-50 p-2 rounded-full hover:bg-gray-100">
        <X />
      </button>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Checkout</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-6">
              {/* Address Dropdown */}
              <div className="border-b border-gray-200 pb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Saved Address
                </label>
                <div className="relative">
                  <select
                    value={selectedAddress}
                    onChange={handleAddressSelect}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white pr-8"
                    disabled={isLoadingAddresses}
                  >
                    <option value="">Select an address or enter manually</option>
                    {savedAddresses.map((address) => (
                      <option key={address._id} value={address._id}>
                        {address.type} - {address.address.substring(0, 30)}...
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                  {isLoadingAddresses && (
                    <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer Details */}
              {selectedAddress === '' && (
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
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="John Doe"
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

                {selectedAddress !== '' ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                    <div className="flex items-center text-blue-700 mb-2">
                      <Check className="w-4 h-4 mr-2" />
                      <span className="font-medium">Using Saved Address</span>
                    </div>
                    <p className="text-sm text-gray-700"><strong>Name:</strong> {formData.firstName}</p>
                    <p className="text-sm text-gray-700"><strong>Phone:</strong> {formData.phone}</p>
                    <p className="text-sm text-gray-700"><strong>Address:</strong> {formData.address}</p>
                    <p className="text-sm text-gray-700"><strong>City:</strong> {formData.city}</p>
                    <p className="text-sm text-gray-700"><strong>State:</strong> {formData.state}</p>
                    <p className="text-sm text-gray-700"><strong>Zip Code:</strong> {formData.zipCode}</p>
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
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Karnataka"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Zip Code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="560001"
                        required
                      />
                    </div>

                    {/* Save Address Radio Button */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="saveAddress"
                          checked={saveAddress}
                          onChange={handleSaveAddressChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="saveAddress" className="ml-2 block text-sm text-gray-700">
                          Save this address to my profile for future orders
                        </label>
                      </div>
                      
                      {/* Address Warning */}
                      {showAddressWarning && (
                        <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                          <div className="flex items-center">
                            <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2" />
                            <p className="text-sm text-yellow-800">
                              If you want to save this address to your profile, please click the checkbox above.
                            </p>
                          </div>
                        </div>
                      )}
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

          {/* Right Side - Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center border-b-2 border-gray-200 pb-4 mb-6">
              <h1 className="text-2xl font-bold text-gray-900">RAYA JEWELS</h1>
              <p className="text-sm text-gray-600 mt-1">Premium Jewelry Collection</p>
              <p className="text-xs text-gray-500 mt-1">Order #: ORD-2024-001</p>
            </div>

            <div className="space-y-3 mb-6">
              {cartItems.map((item) => {
                const price = parseFloat(item.OfferPrice || item.NormalPrice || 0);
                const quantity = parseInt(item.Quantity || 1);
                const itemTotal = price * quantity;

                return (
                  <div key={item.ProductId} className="flex justify-between items-start text-sm">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{item.ProductName}</h3>
                      <p className="text-gray-600">₹{price.toFixed(2)} x {quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{itemTotal.toFixed(2)}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>TOTAL:</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

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