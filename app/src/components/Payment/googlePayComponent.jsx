import React, { useState, useEffect } from 'react';
import { X, Upload, Check } from 'lucide-react';
import axios from 'axios';
import baseUrl from '../../url';

const GooglePayPopup = ({ isOpen, onClose, onPaymentComplete, orderTotal, orderId }) => {
  const [currentStep, setCurrentStep] = useState('initial');
  const [fadeIn, setFadeIn] = useState(false);
  const [formData, setFormData] = useState({
    screenshot: null,
    screenshotBase64: null,
    screenshotName: ''
  });
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFadeIn(true);
      setCurrentStep('initial');
    } else {
      setFadeIn(false);
    }
  }, [isOpen]);

  const handleOkClick = () => setCurrentStep('qr');

  const handlePaymentCompleted = () => setCurrentStep('form');

  const handleFileUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({
          screenshot: file,
          screenshotBase64: e.target.result,
          screenshotName: file.name,
          orderId,
          paymentType: 'UPI'
        });
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a valid image file.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleFileSelect = (e) => handleFileUpload(e.target.files[0]);

  const handleSubmit = async () => {
    if (formData.screenshotBase64) {
      try {
        const res = await axios.post(`${baseUrl}/order/gpay/payment/details`, formData);
        if (res.data.status === 200) {
          setCurrentStep('success');
          setTimeout(() => {
            const paymentData = {
              screenshotBase64: formData.screenshotBase64,
              screenshotName: formData.screenshotName,
              amount: orderTotal
            };
            onPaymentComplete(paymentData);
            onClose();
          }, 2000);
        } else {
          alert("Something went wrong...")
        }

      } catch (err) {
        console.log(err);
      }
    } else {
      alert('Please upload the screenshot before submitting.');
    }
  };

  const handleClose = () => {
    setCurrentStep('initial');
    setFormData({
      screenshot: null,
      screenshotBase64: null,
      screenshotName: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transition-all duration-500 ${fadeIn ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Google Pay Payment</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentStep === 'initial' && (
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Wait a moment…</h1>
              <p className="text-gray-600 mb-4">
                After clicking OK, a QR code will appear. Scan it using UPI app or take a screenshot to pay.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 font-medium">Amount to Pay: ₹{orderTotal?.toFixed(2)}</p>
              </div>
              <button
                onClick={handleOkClick}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
              >
                OK
              </button>
            </div>
          )}

          {currentStep === 'qr' && (
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Scan QR to Pay</h2>
              <img
                src="/qr-code.png"
                alt="QR Code"
                className="w-48 h-48 mx-auto border rounded-lg mb-4 object-contain"
              />
              <p className="text-xs text-gray-500 mb-6">Amount: ₹{orderTotal?.toFixed(2)}</p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800 text-sm">
                  After payment, click “Payment Completed” to upload your screenshot.
                </p>
              </div>
              <button
                onClick={handlePaymentCompleted}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
              >
                Payment Completed
              </button>
            </div>
          )}

          {currentStep === 'form' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Payment Screenshot</h2>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition ${dragOver ? 'border-blue-400 bg-blue-50' :
                  formData.screenshot ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-gray-50'
                  }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                {formData.screenshot ? (
                  <div className="space-y-2">
                    <Check className="w-8 h-8 text-green-600 mx-auto" />
                    <p className="text-sm text-green-600 font-medium">{formData.screenshotName}</p>
                    <p className="text-xs text-gray-500">File uploaded successfully</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                    <p className="text-sm text-gray-600">Drag & drop or</p>
                    <label className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer">
                      Browse Files
                      <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                    </label>
                  </div>
                )}
              </div>

              <button
                onClick={handleSubmit}
                disabled={!formData.screenshotBase64}
                className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Submit Screenshot
              </button>
            </div>
          )}

          {currentStep === 'success' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Submitted!</h2>
              <p className="text-gray-600">Your payment screenshot has been received and will be verified.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GooglePayPopup;
