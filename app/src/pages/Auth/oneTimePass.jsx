import React, { useState, useEffect, useRef } from "react";
import {
  Gem,
  Crown,
  Diamond,
  Mail,
  ArrowLeft,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import axios from "axios";
import baseUrl from "../../url";
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const JewelryOTPPage = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(10);
  const [canResend, setCanResend] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();
  const { email } = location.state || {};

  const [userEmail, setUserEmail] = useState(email);

  const inputRefs = useRef([]);

  // Timer countdown
  useEffect(() => {
    if (timer > 0 && !canResend) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else if (timer === 0) {
      setCanResend(true);
    }
  }, [timer, canResend]);

  const handleBack = () => {
    // In your actual implementation, this would use navigate('/auth')
    alert("Navigate back to login page");
  };

  const handleInputChange = (index, value) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      alert("Please enter complete OTP");
      return;
    }

    setIsLoading(true);

    const bodyValues = {
      otp: otpValue,
      email: userEmail,
      screen: "register",
    };

    // console.log(bodyValues);

    try {
      const response = await axios.post(`${baseUrl}/auth/post/otp`, bodyValues);
      if (response.status === 200) {
        toast.success(response.data.message);
        navigate("/auth");
      } else if (response.status === 201) {
        toast.error(response.data.message);
        clearTimeout(countdown);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      alert("Verification failed. Please try again.");
      console.error("OTP verification error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    setCanResend(false);
    setTimer(60);
    setOtp(["", "", "", "", "", ""]);
    

    try {
      const response = await axios.post(`${baseUrl}/auth/resend/otp`, {
        email: userEmail
      });
      console.log(response);
    } catch (error) {
      alert("Failed to resend OTP");
      console.error("Resend OTP error:", error);
    } finally {
      setIsResending(false);
    }
  };

  const switchVerificationType = (type) => {
    setOtp(["", "", "", "", "", ""]);
    setTimer(60);
    setCanResend(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative">
      {/* Back Button */}
      <button
        onClick={() => navigate("/auth")}
        className="absolute top-4 left-4 z-10 flex items-center space-x-2 bg-white/80 backdrop-blur-sm hover:bg-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200 group"
      >
        <ArrowLeft
          size={20}
          className="text-gray-600 group-hover:text-gray-800"
        />
        <span className="text-gray-600 group-hover:text-gray-800 font-medium">
          Back
        </span>
      </button>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 flex">
        {/* Left Side - Cartoon Jewelry Image */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-100 to-pink-100 items-center justify-center p-8">
          <div className="text-center">
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-10 -left-10 text-yellow-400 animate-pulse">
                <Crown size={40} />
              </div>
              <div className="absolute -top-5 -right-5 text-pink-400 animate-bounce">
                <Diamond size={30} />
              </div>
              <div className="absolute -bottom-5 -left-5 text-purple-400 animate-pulse">
                <Gem size={35} />
              </div>

              {/* Verification Lock Icon */}
              <div className="bg-white rounded-full p-12 shadow-2xl border-4 border-gradient-to-r from-yellow-300 to-pink-300">
                <svg
                  width="200"
                  height="200"
                  viewBox="0 0 200 200"
                  className="mx-auto"
                >
                  {/* Shield/Lock shape */}
                  <path
                    d="M100 20 L160 50 L160 120 Q160 160 100 180 Q40 160 40 120 L40 50 Z"
                    fill="#9d4edd"
                    opacity="0.9"
                  />
                  <path
                    d="M100 30 L150 55 L150 115 Q150 150 100 170 Q50 150 50 115 L50 55 Z"
                    fill="#d4af37"
                    opacity="0.8"
                  />

                  {/* Lock symbol */}
                  <circle
                    cx="100"
                    cy="90"
                    r="25"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="6"
                  />
                  <rect
                    x="85"
                    y="105"
                    width="30"
                    height="40"
                    fill="#ffffff"
                    rx="5"
                  />
                  <circle cx="100" cy="115" r="6" fill="#9d4edd" />
                  <rect x="98" y="118" width="4" height="15" fill="#9d4edd" />

                  {/* Sparkles around */}
                  <text x="60" y="40" fontSize="16" fill="#ffd700">
                    ✨
                  </text>
                  <text x="140" y="60" fontSize="14" fill="#ff6b9d">
                    ✨
                  </text>
                  <text x="70" y="160" fontSize="18" fill="#06ffa5">
                    ✨
                  </text>
                  <text x="130" y="170" fontSize="16" fill="#8338ec">
                    ✨
                  </text>
                </svg>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-800 mt-8 mb-4">
              Secure Verification
            </h2>
            <p className="text-gray-600 text-lg">
              Protecting your precious jewelry collection
            </p>
          </div>
        </div>

        {/* Right Side - OTP Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="max-w-md w-full">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full">
                  {isVerified ? (
                    <CheckCircle className="text-white" size={32} />
                  ) : (
                    <Crown className="text-white" size={32} />
                  )}
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-800">
                {isVerified ? "Verified!" : "Verify Your Identity"}
              </h1>
              <p className="text-gray-600 mt-2">
                {isVerified
                  ? "Welcome to your jewelry collection"
                  : "Enter the 6-digit code sent to your email"}
              </p>
            </div>

            {!isVerified && (
              <>
                {/* Email Display */}
                <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center mb-2">
                    <Mail className="text-purple-600 mr-2" size={20} />
                    <p className="text-sm text-gray-600">
                      Verification code sent to:
                    </p>
                  </div>
                  <p className="font-semibold text-purple-800 ml-7">
                    {userEmail}
                  </p>
                </div>

                {/* OTP Input */}
                <div className="mb-6">
                  <div className="flex space-x-3 justify-center mb-4">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) =>
                          handleInputChange(index, e.target.value)
                        }
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-12 h-12 text-center text-lg font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      />
                    ))}
                  </div>
                </div>

                {/* Timer and Resend */}
                <div className="text-center mb-6">
                  {!canResend ? (
                    <p className="text-gray-600">
                      Resend code in{" "}
                      <span className="font-semibold text-purple-600">
                        {formatTime(timer)}
                      </span>
                    </p>
                  ) : (
                    <button
                      onClick={handleResendOTP}
                      disabled={isResending}
                      className="flex items-center justify-center mx-auto text-purple-600 hover:text-purple-800 font-semibold transition-colors duration-200 disabled:opacity-50"
                    >
                      {isResending ? (
                        <>
                          <RefreshCw className="animate-spin mr-2" size={16} />
                          Sending...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-2" size={16} />
                          Resend Code
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Verify Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || otp.join("").length !== 6}
                  className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white py-4 px-6 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Diamond className="mr-2" size={20} />
                      Verify Code
                      <Gem className="ml-2" size={20} />
                    </div>
                  )}
                </button>
              </>
            )}

            {/* Success Message */}
            {isVerified && (
              <div className="text-center">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                  <CheckCircle
                    className="mx-auto text-green-500 mb-4"
                    size={48}
                  />
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    Verification Successful!
                  </h3>
                  <p className="text-green-600">
                    You will be redirected to your dashboard shortly.
                  </p>
                </div>
              </div>
            )}

            {/* Decorative Elements */}
            <div className="absolute top-4 right-4 text-yellow-400 animate-pulse">
              <Crown size={24} />
            </div>
            <div className="absolute bottom-4 left-4 text-pink-400 animate-bounce">
              <Diamond size={20} />
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default JewelryOTPPage;
