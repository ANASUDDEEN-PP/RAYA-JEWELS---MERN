import { useState } from 'react';
import { ArrowLeft, User, Camera, Phone, Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Components/sideBarSettings';

export default function SettingsPage() {

    const [formData, setFormData] = useState({
        name: 'John Doe',
        phone: '+1 (555) 123-4567',
        email: 'john.doe@example.com',
        password: ''
    });

    const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfileImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Profile updated:', formData);
        alert('Profile settings updated successfully!');
    };
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div onClick={() => navigate('/admin-settings')} className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 cursor-pointer transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm font-medium">Go back to dashboard</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-200 transition-colors">
                            <User className="w-4 h-4 text-blue-600" />
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <div className="flex-1 p-8">
                    <div className="min-h-screen bg-gray-50 py-8">
                        <div className="max-w-4xl mx-auto px-4">
                            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Profile Settings</h1>

                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <div className="flex flex-col lg:flex-row gap-8">
                                    {/* Left Side - Profile Image and Name */}
                                    <div className="lg:w-1/3 flex flex-col items-center">
                                        <div className="relative mb-6">
                                            <img
                                                src={profileImage}
                                                alt="Profile"
                                                className="w-48 h-48 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                                            />
                                            <label className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                                                <Camera size={20} />
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                        <h2 className="text-2xl font-semibold text-gray-800 text-center">{formData.name}</h2>
                                        <p className="text-gray-600 text-center mt-1">User</p>
                                    </div>

                                    {/* Right Side - Form Details */}
                                    <div className="lg:w-2/3">
                                        <div className="space-y-6">
                                            {/* Name Field */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    <User className="inline w-4 h-4 mr-2" />
                                                    Full Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                                    placeholder="Enter your full name"
                                                />
                                            </div>

                                            {/* Phone Field */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    <Phone className="inline w-4 h-4 mr-2" />
                                                    Phone Number
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                                    placeholder="Enter your phone number"
                                                />
                                            </div>

                                            {/* Email Field */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    <Mail className="inline w-4 h-4 mr-2" />
                                                    Email Address
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                                    placeholder="Enter your email address"
                                                />
                                            </div>

                                            {/* Password Field */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    <Lock className="inline w-4 h-4 mr-2" />
                                                    Password
                                                </label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                                    placeholder="Enter new password (leave blank to keep current)"
                                                />
                                            </div>

                                            {/* Submit Button */}
                                            <div className="pt-4">
                                                <button
                                                    type="submit"
                                                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all font-medium text-lg"
                                                >
                                                    Update Profile
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}