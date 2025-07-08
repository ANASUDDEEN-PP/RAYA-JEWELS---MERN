import React, { useState, useEffect } from 'react';
import {MapPin} from 'lucide-react';
const AddressDetails = ({ addressData, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-6 h-6 bg-gray-300 rounded"></div>
          <div className="w-32 h-6 bg-gray-300 rounded"></div>
        </div>
        <div className="space-y-3">
          <div className="w-full h-4 bg-gray-300 rounded"></div>
          <div className="w-4/5 h-4 bg-gray-300 rounded"></div>
          <div className="w-2/3 h-4 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (!addressData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500">No address data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-4">
        <MapPin className="w-6 h-6 text-red-600" />
        <h3 className="text-lg font-semibold text-gray-800">Address Details</h3>
      </div>
      <div className="space-y-3">
        <div>
          <label className="text-sm text-gray-600 font-medium">Delivery Address</label>
          <p className="text-gray-800">{addressData.name}</p>
          <p className="text-gray-800">{addressData.address}, {addressData.city}, {addressData.state}, {addressData.zipCode}</p>
          <p className="text-gray-800">{addressData.country}</p>
        </div>
        <div>
          <label className="text-sm text-gray-600 font-medium">Phone Number</label>
          <p className="text-gray-800">{addressData.phone}</p>
        </div>
        {addressData.landmark && (
          <div>
            <label className="text-sm text-gray-600 font-medium">Landmark</label>
            <p className="text-gray-600 text-sm">{addressData.landmark}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressDetails;