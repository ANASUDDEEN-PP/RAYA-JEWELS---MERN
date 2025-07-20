import React, { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Gem,
  Crown,
  Diamond,
  X,
  Mail,
  Lock,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import baseUrl from "../../url";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const JewelryForgetPasswordPage = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset Password
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    otp: ["", "", "", "", "", ""],
    password: "",
    confirmPassword: "",
  });

  // const navigate = useNavigate();

  useEffect(() => {
    let interval = null;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((timer) => timer - 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const handleBack = () => {
    // navigate("/auth");
    console.log("Navigate back to auth page");
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;

    const newOtp = [...formData.otp];
    newOtp[index] = value;

    setFormData({
      ...formData,
      otp: newOtp,
    });

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !formData.otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      alert("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/auth/forget/otp/request`, {
        email: formData.email,
      });
      if( response.status === 202 ) {
        setIsLoading(false);
        toast.error(response.data.message)
      } else if( response.status === 200) {
        setStep(2);
        setOtpTimer(120)
        toast.success(response.data.message);
      } else {
        setIsLoading(false);
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = formData.otp.join("");
    if (otpValue.length !== 6) {
      alert("Please enter complete OTP");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // For demo purposes, accept "123456" as valid OTP
      if (otpValue === "123456") {
        setIsOtpVerified(true);
        alert("OTP verified successfully!");
      } else {
        alert("Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to verify OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!formData.password) {
      alert("Please enter new password");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert("Password reset successfully!");
      // navigate("/auth");
      console.log("Navigate back to auth page after password reset");
    } catch (err) {
      console.error(err);
      alert("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      console.log("Running");
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setOtpTimer(120);
      setFormData({ ...formData, otp: ["", "", "", "", "", ""] });
      console.log(formData);
      alert("OTP resent to your email!");
    } catch (err) {
      console.error(err);
      alert("Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Close Button - Top Left */}
      <button
        onClick={() => navigate("/auth")}
        className="absolute top-4 left-4 z-10 flex items-center space-x-2 bg-white/80 backdrop-blur-sm hover:bg-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200 group"
      >
        <X size={20} className="text-gray-600 group-hover:text-gray-800" />
        <span className="text-gray-600 group-hover:text-gray-800 font-medium">
          Back to Login
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
                <Shield size={35} />
              </div>

              {/* Main security/reset illustration */}
              <div className="bg-white rounded-full p-12 shadow-2xl border-4 border-gradient-to-r from-yellow-300 to-pink-300">
                <svg
                  width="200"
                  height="200"
                  viewBox="0 0 200 200"
                  className="mx-auto"
                >
                  {/* Lock background circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#d4af37"
                    strokeWidth="6"
                    opacity="0.3"
                  />

                  {/* Main lock body */}
                  <rect
                    x="70"
                    y="110"
                    width="60"
                    height="50"
                    rx="8"
                    fill="#6366f1"
                    opacity="0.9"
                  />

                  {/* Lock shackle */}
                  <path
                    d="M 80 110 Q 80 80 100 80 Q 120 80 120 110"
                    fill="none"
                    stroke="#d4af37"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />

                  {/* Keyhole */}
                  <circle cx="100" cy="135" r="8" fill="#ffffff" />
                  <rect x="96" y="135" width="8" height="15" fill="#ffffff" />

                  {/* Reset arrows around lock */}
                  <path
                    d="M 60 100 Q 60 60 100 60 Q 140 60 140 100"
                    fill="none"
                    stroke="#ff6b9d"
                    strokeWidth="4"
                    strokeLinecap="round"
                    opacity="0.7"
                  />
                  <polygon
                    points="55,95 65,90 65,105"
                    fill="#ff6b9d"
                    opacity="0.7"
                  />

                  {/* Decorative gems */}
                  <circle cx="50" cy="50" r="6" fill="#9d4edd" />
                  <circle cx="150" cy="50" r="6" fill="#06ffa5" />
                  <circle cx="50" cy="150" r="6" fill="#ff006e" />
                  <circle cx="150" cy="150" r="6" fill="#ffd60a" />

                  {/* Sparkles */}
                  <text x="40" y="30" fontSize="16" fill="#ffd700">
                    ✨
                  </text>
                  <text x="160" y="40" fontSize="14" fill="#ff6b9d">
                    ✨
                  </text>
                  <text x="30" y="180" fontSize="18" fill="#9d4edd">
                    ✨
                  </text>
                  <text x="170" y="170" fontSize="16" fill="#06ffa5">
                    ✨
                  </text>
                </svg>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-800 mt-8 mb-4">
              Reset Your Password
            </h2>
            <p className="text-gray-600 text-lg">
              Secure access to your jewelry collection
            </p>
          </div>
        </div>

        {/* Right Side - Reset Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="max-w-md w-full">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full">
                  <Lock className="text-white" size={32} />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-800">
                Forgot Password?
              </h1>
              <p className="text-gray-600 mt-2">
                {step === 1 && "Enter your email to receive OTP"}
                {step === 2 && "Enter the OTP sent to your email"}
                {isOtpVerified && "Create your new password"}
              </p>
            </div>

            {/* Form */}
            <div className="space-y-6">
              {/* Step 1: Email Input */}
              {step === 1 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your email"
                      required
                    />
                    <Mail
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: OTP Verification */}
              {step === 2 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter OTP
                  </label>
                  <p className="text-sm text-gray-600 mb-4">
                    OTP sent to{" "}
                    <span className="font-semibold">{formData.email}</span>
                  </p>
                  <div className="flex justify-center space-x-2 mb-4">
                    {formData.otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        maxLength="1"
                      />
                    ))}
                  </div>

                  {otpTimer > 0 ? (
                    <p className="text-center text-sm text-gray-600">
                      Resend OTP in {Math.floor(otpTimer / 60)}:
                      {(otpTimer % 60).toString().padStart(2, "0")}
                    </p>
                  ) : (
                    <div className="text-center">
                      <button
                        onClick={handleResendOtp}
                        disabled={isLoading}
                        className="text-purple-600 hover:text-purple-800 font-semibold text-sm transition-colors duration-200"
                      >
                        Resend OTP
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Password Reset Fields - Show only after OTP verification */}
              {isOtpVerified && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter new password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder="Confirm new password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Back Button - Show when in OTP step or password reset */}
              {(step === 2 || isOtpVerified) && (
                <button
                  onClick={() => {
                    if (isOtpVerified) {
                      setIsOtpVerified(false);
                      setFormData({
                        ...formData,
                        otp: ["", "", "", "", "", ""],
                        password: "",
                        confirmPassword: "",
                      });
                    } else if (step === 2) {
                      setStep(1);
                      setFormData({
                        ...formData,
                        otp: ["", "", "", "", "", ""],
                      });
                      setOtpTimer(0);
                    }
                  }}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 mb-4"
                >
                  <div className="flex items-center justify-center">
                    <X className="mr-2" size={20} />
                    {isOtpVerified
                      ? "Back to OTP Verification"
                      : "Back to Email"}
                  </div>
                </button>
              )}

              {/* Submit Button */}
              <button
                onClick={
                  step === 1
                    ? handleSendOtp
                    : !isOtpVerified
                    ? handleVerifyOtp
                    : handleResetPassword
                }
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white py-4 px-6 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    {step === 1 && (
                      <>
                        <Mail className="mr-2" size={20} />
                        Send OTP
                        <Diamond className="ml-2" size={20} />
                      </>
                    )}
                    {step === 2 && !isOtpVerified && (
                      <>
                        <Shield className="mr-2" size={20} />
                        Verify OTP
                        <Gem className="ml-2" size={20} />
                      </>
                    )}
                    {isOtpVerified && (
                      <>
                        <Lock className="mr-2" size={20} />
                        Reset Password
                        <Crown className="ml-2" size={20} />
                      </>
                    )}
                  </div>
                )}
              </button>
            </div>

            {/* Back to Login */}
            <div className="text-center mt-6">
              <p className="text-gray-600">
                Remember your password?
                <button
                  onClick={() => navigate("/auth")}
                  className="ml-2 text-purple-600 hover:text-purple-800 font-semibold transition-colors duration-200"
                >
                  Back to Login
                </button>
              </p>
            </div>

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

export default JewelryForgetPasswordPage;
