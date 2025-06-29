import React from "react";
import { UserX, LogOut, X } from "lucide-react";
import { Link } from "react-router-dom";
import ProfileIcon from "../assets/images/profile.png";

const ProfilePanel = ({ userProfile, onClose, onLogout }) => {
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
                  <div className="mt-8 flex flex-col items-center">
                    <div className="mb-4">
                      <img
                        className="h-24 w-24 rounded-full object-cover"
                        src={userProfile.imageUrl || ProfileIcon}
                        alt="Profile"
                      />
                    </div>
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