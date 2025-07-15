import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function UnauthorizedPage() {
    const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/auth");
  };

  return (
    <div className="mt-[150px] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center border border-gray-200">
          {/* Lock Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-red-500/20 p-6 rounded-full">
              <Lock className="w-12 h-12 text-red-400" />
            </div>
          </div>
          
          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Access Denied
          </h1>
          
          {/* Message */}
          <p className="text-gray-600 mb-8 text-lg">
            You Are Not authenticated. Please Login
          </p>
          
          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Click Here to Login
          </button>
          
          {/* Additional styling elements */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-500 text-sm">
              Need help? Contact your administrator
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}