import React, { useState } from 'react';
import { Eye, EyeOff, Gem, Crown, Diamond, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BaseUrl from "../../url"
import toast, { Toaster } from 'react-hot-toast';

const JewelryAuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        Mobile: ''
    });
    const navigate = useNavigate();

    const handleBack = async () => {
        navigate('/');
    }

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        console.log(formData)

        // Simulate API call
        // setTimeout(() => {
        // setIsLoading(false);
        // alert(isLogin ? 'Login successful!' : 'Account created successfully!');
        // }, 2000);
        try {
            const authData = await axios.post(`${BaseUrl}/auth/register`, {
                formData,
                isLogin
            })
            console.log(authData)
            if (authData.status == 201) {
                toast.error(authData.data.message);
                setIsLoading(false)
            } else if (authData.status == 200) {
                toast.success(authData.data.message);
                setIsLoading(false)
                setFormData({
                    email: '',
                    password: '',
                    confirmPassword: '',
                    name: '',
                    Mobile: ''
                });
            } else if (authData.status == 202 && authData.data.message == "ADMLGN") {
                localStorage.setItem('adminCode', JSON.stringify(authData.data.Code));
                navigate(authData.data.navigate)
            } else if (authData.status == 202 && authData.data.message == "Login Success") {
                localStorage.setItem('userProfile', JSON.stringify(authData.data.user));
                // localStorage.setItem('userProfileImg', JSON.stringify(authData.data.profileImg));
                localStorage.setItem('isLoggedIn', true);
                navigate('/')
            }
            // isLoading(false)
        } catch (err) {
            console.error(err);
        }
    };

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setFormData({
            email: '',
            password: '',
            confirmPassword: '',
            name: '',
            Mobile: ''
        });
    };

    return (
        <div className="relative">
            {/* Close Button - Top Left */}
            <button onClick={handleBack} className="absolute top-4 left-4 z-10 flex items-center space-x-2 bg-white/80 backdrop-blur-sm hover:bg-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200 group">
                <X size={20} className="text-gray-600 group-hover:text-gray-800" />
                <span className="text-gray-600 group-hover:text-gray-800 font-medium">Back to Previous Page</span>
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

                            {/* Main jewelry cartoon */}
                            <div className="bg-white rounded-full p-12 shadow-2xl border-4 border-gradient-to-r from-yellow-300 to-pink-300">
                                <svg width="200" height="200" viewBox="0 0 200 200" className="mx-auto">
                                    {/* Necklace */}
                                    <circle cx="100" cy="80" r="60" fill="none" stroke="#d4af37" strokeWidth="8" opacity="0.8" />
                                    <circle cx="100" cy="80" r="50" fill="none" stroke="#ffd700" strokeWidth="4" />

                                    {/* Pendant */}
                                    <ellipse cx="100" cy="140" rx="20" ry="30" fill="#ff6b9d" opacity="0.9" />
                                    <ellipse cx="100" cy="140" rx="15" ry="25" fill="#ff8fab" />
                                    <circle cx="100" cy="135" r="8" fill="#ffffff" opacity="0.7" />

                                    {/* Gemstones on necklace */}
                                    <circle cx="70" cy="60" r="6" fill="#9d4edd" />
                                    <circle cx="130" cy="60" r="6" fill="#06ffa5" />
                                    <circle cx="85" cy="45" r="5" fill="#ff006e" />
                                    <circle cx="115" cy="45" r="5" fill="#8338ec" />

                                    {/* Earrings */}
                                    <circle cx="50" cy="50" r="12" fill="#ffd60a" opacity="0.9" />
                                    <circle cx="50" cy="70" r="8" fill="#ff8500" />
                                    <circle cx="150" cy="50" r="12" fill="#ffd60a" opacity="0.9" />
                                    <circle cx="150" cy="70" r="8" fill="#ff8500" />

                                    {/* Ring */}
                                    <circle cx="100" cy="180" r="15" fill="none" stroke="#d4af37" strokeWidth="6" />
                                    <circle cx="100" cy="165" r="8" fill="#ff006e" />

                                    {/* Sparkles */}
                                    <text x="40" y="30" fontSize="20" fill="#ffd700">✨</text>
                                    <text x="160" y="40" fontSize="16" fill="#ff6b9d">✨</text>
                                    <text x="30" y="120" fontSize="18" fill="#9d4edd">✨</text>
                                    <text x="170" y="130" fontSize="14" fill="#06ffa5">✨</text>
                                </svg>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold text-gray-800 mt-8 mb-4">
                            Sparkle & Shine
                        </h2>
                        <p className="text-gray-600 text-lg">
                            Discover the finest collection of handcrafted jewelry
                        </p>
                    </div>
                </div>

                {/* Right Side - Authentication Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                    <div className="max-w-md w-full">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="flex items-center justify-center mb-4">
                                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full">
                                    <Crown className="text-white" size={32} />
                                </div>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-800">
                                {isLogin ? 'Welcome Back' : 'Create Account'}
                            </h1>
                            <p className="text-gray-600 mt-2">
                                {isLogin ? 'Sign in to your account' : 'Join our jewelry family'}
                            </p>
                        </div>

                        {/* Form */}
                        <div className="space-y-6">
                            {!isLogin && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                            {!isLogin && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mobile Number
                                    </label>
                                    <input
                                        type="text"
                                        name="Mobile"
                                        value={formData.Mobile}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Enter Your Mobile Number"
                                        required
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Enter your password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {!isLogin && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Confirm your password"
                                        required
                                    />
                                </div>
                            )}

                            {/* Ornament-styled Submit Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white py-4 px-6 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                                        <span>Processing...</span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -skew-x-12 animate-pulse"></div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center">
                                        <Diamond className="mr-2" size={20} />
                                        {isLogin ? 'Sign In' : 'Create Account'}
                                        <Gem className="ml-2" size={20} />
                                    </div>
                                )}
                            </button>
                        </div>

                        {/* Toggle Form */}
                        <div className="text-center mt-6">
                            <p className="text-gray-600">
                                {isLogin ? "Don't have an account?" : "Already have an account?"}
                                <button
                                    onClick={toggleForm}
                                    className="ml-2 text-purple-600 hover:text-purple-800 font-semibold transition-colors duration-200"
                                >
                                    {isLogin ? 'Sign up' : 'Sign in'}
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

export default JewelryAuthPage;