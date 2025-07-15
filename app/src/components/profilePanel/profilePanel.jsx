import React, { useEffect, useState } from "react";
import { UserX, User, LogOut, X, ChevronDown, Package, Settings, MapPin, CreditCard, Edit2, Save, Camera, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import UserAddress from "./profileAddress";
import axios from "axios";
import baseUrl from "../../url";

const ProfilePanel = ({ userProfile, onClose, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddresses, setShowAddresses] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    Name: '',
    Email: '',
    Mobile: ''
  });
  const navigate = useNavigate();
  const loginUser = JSON.parse(localStorage.getItem("userProfile")) || null;

  useEffect(() => {
    if (userProfile) {
      setEditedProfile({
        Name: userProfile.Name || '',
        Email: userProfile.Email || '',
        Mobile: userProfile.Mobile || ''
      });
    }
  }, [userProfile]);

  useEffect(() => {
    const fetchUserProfile = async() => {
      if (!loginUser) {
        setImageLoading(false);
        return;
      }
      
      setImageLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/auth/get/profile/image/${loginUser._id}`);
        if (response.data.isProfile) {
          localStorage.setItem('userProfileImg', JSON.stringify(response.data.isProfile));
          setProfileImage(response.data.isProfile.ImageUrl);
        } else {
          setProfileImage(null);
        }
      } catch(err) {
        console.log(err);
        setProfileImage(null);
      } finally {
        setImageLoading(false);
      }
    }
    fetchUserProfile();
  }, [loginUser?._id]);

  const getInitials = (name) => {
    if (!name) return '';
    
    const names = name.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();
    
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    
    return initials;
  };

  const handleImageChange = async (e) => {
    if (!loginUser) return;
    
    const file = e.target.files[0];
    if (file) {
      setUploadingImage(true);
      try {
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const response = await axios.post(`${baseUrl}/auth/set/profile/img/${loginUser._id}`, {
              profileImage: event.target.result
            });
            if (response.data.isProfile) {
              localStorage.setItem('userProfileImg', JSON.stringify(response.data.isProfile));
              setProfileImage(response.data.isProfile.ImageUrl);
            }
          } catch (error) {
            console.error("Error uploading image:", error);
          } finally {
            setUploadingImage(false);
          }
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error processing image:", error);
        setUploadingImage(false);
      }
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setEditedProfile({
        Name: userProfile?.Name || '',
        Email: userProfile?.Email || '',
        Mobile: userProfile?.Mobile || ''
      });
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async() => {
    if (!loginUser) return;
    
    try {
      const response = await axios.put(`${baseUrl}/auth/edit/profile/${loginUser._id}`, editedProfile);
      if(response.status === 200){
        localStorage.setItem('userProfile', JSON.stringify(response.data.userWithoutPassword));
        window.location.reload();
      }
    } catch (error) {
      alert("Something Went Wrong");
      console.error(error);
    }
    
    setIsEditing(false);
  };

  const handleAddressClick = () => {
    setShowAddresses(true);
    setShowDropdown(false);
  };

  const handleBackFromAddresses = () => {
    setShowAddresses(false);
  };

  const dropdownItems = [
    { icon: Package, label: "My Orders", action: () => navigate('/all/orders') },
    { icon: MapPin, label: "Addresses", action: handleAddressClick },
    { icon: CreditCard, label: "Payment Methods", action: () => console.log("Navigate to Payment Methods") },
    { icon: Settings, label: "Account Settings", action: () => console.log("Navigate to Settings") }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>
        <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
          <div className="w-screen max-w-md animate-slideInFromRight">
            <div className="h-full flex flex-col bg-white shadow-xl">
              <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-medium text-gray-900">
                    {userProfile ? "My Profile" : "Welcome"}
                  </h2>
                  <button
                    type="button"
                    className="-mr-2 p-2 text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {userProfile ? (
                  <div className="mt-8">
                    {showAddresses ? (
                      <UserAddress onBack={handleBackFromAddresses} user={loginUser} />
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="mb-4 relative group">
                          {imageLoading ? (
                            <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                              <Loader2 className="h-6 w-6 text-gray-500 animate-spin" />
                            </div>
                          ) : profileImage ? (
                            <img
                              className="h-24 w-24 rounded-full object-cover"
                              src={profileImage}
                              alt="Profile"
                            />
                          ) : (
                            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-2xl font-bold">
                              {getInitials(userProfile.Name)}
                            </div>
                          )}
                          
                          {!imageLoading && userProfile && (
                            <label className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all cursor-pointer">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                disabled={uploadingImage}
                              />
                              {uploadingImage ? (
                                <Loader2 className="h-6 w-6 text-white animate-spin" />
                              ) : (
                                <Camera className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              )}
                            </label>
                          )}
                          
                          {!isEditing && !imageLoading && !uploadingImage && userProfile && (
                            <button
                              onClick={handleEditToggle}
                              className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-1.5 hover:bg-blue-600 transition-colors"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                          )}
                        </div>

                        {isEditing ? (
                          <div className="w-full max-w-sm space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                              <input
                                type="text"
                                value={editedProfile.Name}
                                onChange={(e) => handleInputChange('Name', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                              <input
                                type="email"
                                value={editedProfile.Email}
                                onChange={(e) => handleInputChange('Email', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                              <input
                                type="tel"
                                value={editedProfile.Mobile}
                                onChange={(e) => handleInputChange('Mobile', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={handleSubmit}
                                className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                              >
                                <Save className="h-4 w-4 mr-2" />
                                Save
                              </button>
                              <button
                                onClick={handleEditToggle}
                                className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                              >
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <h1 className="text-xl font-bold text-gray-900 mb-2">
                              {userProfile.Name}
                            </h1>
                            <p className="mt-1 text-sm text-gray-900">
                              {userProfile.Email}
                            </p>
                            <p className="mt-1 text-sm text-gray-900">
                              {userProfile.Mobile}
                            </p>
                            <p className="mt-1 text-sm text-gray-900">
                              {userProfile.joinDate}
                            </p>

                            <div className="mt-6 w-full relative">
                              <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                              >
                                <span className="text-sm font-medium text-gray-700">Quick Actions</span>
                                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                              </button>
                              
                              {showDropdown && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                                  {dropdownItems.map((item, index) => (
                                    <button
                                      key={index}
                                      onClick={() => {
                                        item.action();
                                        setShowDropdown(false);
                                      }}
                                      className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors first:rounded-t-md last:rounded-b-md"
                                    >
                                      <item.icon className="h-4 w-4 mr-3 text-gray-500" />
                                      {item.label}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </>
                        )}

                        <div className="mt-8 w-full">
                          <button
                            onClick={onLogout}
                            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-8 flex flex-col items-center">
                    <div className="mb-6">
                      <div className="h-32 w-32 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <UserX className="h-16 w-16 text-gray-400" />
                      </div>
                    </div>
                    <div className="text-center mb-8">
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Welcome!
                      </h1>
                      <p className="text-lg text-gray-600 mb-1">
                        Please sign in to your account
                      </p>
                    </div>
                    <div className="w-full">
                      <Link
                        to="/auth"
                        className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-yellow-600 hover:bg-yellow-700 transition-colors"
                        onClick={onClose}
                      >
                        <User className="h-5 w-5 mr-2" />
                        Sign In
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePanel;