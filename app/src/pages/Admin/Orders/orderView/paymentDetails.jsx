import React, { useState, useEffect } from 'react';

const PaymentDetailsPopup = ({ isOpen, onClose, paymentData }) => {
  if (!isOpen) return null;

  // Simulate base64 image from backend
  const base64Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Payment Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Transaction Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Payment Method</span>
                    <span className="text-sm text-gray-800">{paymentData?.paymentType || 'UPI'}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Transaction ID</span>
                    <span className="text-sm text-gray-800 font-mono">{paymentData?.transactionId || 'TXN123456789'}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">UPI ID</span>
                    <span className="text-sm text-gray-800">{paymentData?.upiId || 'user@paytm'}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Amount</span>
                    <span className="text-sm text-gray-800 font-semibold">${paymentData?.amount || '599.98'}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Payment Date</span>
                    <span className="text-sm text-gray-800">{paymentData?.paymentDate || 'July 8, 2024 10:15 AM'}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-green-600">Status</span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      <CheckCircle className="w-4 h-4" />
                      Success
                    </span>
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Details</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600 block">Bank Reference Number</span>
                    <span className="text-sm text-gray-800 font-mono">{paymentData?.bankRefNumber || 'BRN987654321'}</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600 block">Payment Gateway</span>
                    <span className="text-sm text-gray-800">{paymentData?.gateway || 'Razorpay'}</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600 block">Merchant ID</span>
                    <span className="text-sm text-gray-800 font-mono">{paymentData?.merchantId || 'MER123456'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Payment Screenshot/QR Code */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Screenshot</h3>
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  {paymentData?.screenshot ? (
                    <img 
                      src={paymentData.screenshot} 
                      alt="Payment Screenshot" 
                      className="w-full max-w-md mx-auto rounded-lg shadow-md"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">Payment screenshot will appear here</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* QR Code or Additional Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Transaction QR Code</h3>
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <div className="w-32 h-32 bg-white rounded-lg mx-auto mb-3 flex items-center justify-center shadow-sm">
                    <div className="w-24 h-24 bg-gray-300 rounded"></div>
                  </div>
                  <p className="text-gray-600 text-sm">Scan to verify transaction</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-4">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Close
            </button>
            <button 
              onClick={() => window.print()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsPopup;