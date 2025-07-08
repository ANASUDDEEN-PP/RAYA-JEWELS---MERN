import React, { Component } from 'react'
import {User} from 'lucide-react';

const UserDetails = ({ userData, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-6 h-6 bg-gray-300 rounded"></div>
          <div className="w-24 h-6 bg-gray-300 rounded"></div>
        </div>
        <div className="space-y-3">
          <div className="w-full h-4 bg-gray-300 rounded"></div>
          <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
          <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500">No user data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-4">
        <User className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">User Details</h3>
      </div>
      <div className="space-y-3">
        <div>
          <label className="text-sm text-gray-600 font-medium">Name</label>
          <p className="text-gray-800">{userData.Name}</p>
        </div>
        <div>
          <label className="text-sm text-gray-600 font-medium">Email</label>
          <p className="text-gray-800">{userData.Email}</p>
        </div>
        <div>
          <label className="text-sm text-gray-600 font-medium">Phone</label>
          <p className="text-gray-800">{userData.Mobile}</p>
        </div>
        <div>
          <label className="text-sm text-gray-600 font-medium">Customer ID</label>
          <p className="text-gray-800 font-mono">{userData.userId}</p>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
