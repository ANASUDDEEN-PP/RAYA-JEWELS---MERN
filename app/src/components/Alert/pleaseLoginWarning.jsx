import React from "react";
import { AlertTriangle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WarningPopup = ({ onClose }) => {
    const navigate = useNavigate();
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-xl animate-fade-in relative">
        {/* Close button - top left */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        <div className="flex flex-col items-center text-center space-y-4">
          <div className="bg-yellow-100 p-4 rounded-full">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>

          <h3 className="text-xl font-semibold text-gray-800">You're not logged in.</h3>
          <p className="text-gray-600">Please login to visit our site.</p>

          <button
            onClick={() => navigate('/auth')}
            className="mt-4 mb-10 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300"
          >
            Login Here
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarningPopup;