import { ArrowLeft } from "lucide-react";
import NavBar from "../../components/navBar";
import { useNavigate } from "react-router-dom";

export default function PageNotFound() {
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="relative">
              <div className="text-9xl font-bold text-orange-200 select-none">
                404
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center animate-bounce">
                  <div className="text-white text-3xl">😵</div>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8 space-y-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Page Not Found
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              Oops! The page you're looking for doesn't exist. It might have
              been moved, deleted, or you entered the wrong URL.
            </p>
          </div>

          {/* Go Back Button */}
          <button
            onClick={handleGoBack}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
          >
            <ArrowLeft size={20} />
            Go Back to Previous Page
          </button>

          {/* Additional Help */}
          <div className="mt-8 text-sm text-gray-500">
            <p>
              You can also go back to{" "}
              <a
                href="/"
                className="text-orange-600 hover:text-orange-800 underline font-medium"
              >
                homepage
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
