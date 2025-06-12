import { useState } from 'react';
import { ArrowLeft, User, Upload, Calendar, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Components/sideBarSettings';

export default function SettingsPage() {
  const navigate = useNavigate();
  const [collectionName, setCollectionName] = useState('');
  const [createdDate, setCreatedDate] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleImageDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setUploadedImage(file);
        
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setUploadedImage(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleSubmit = async () => {
    if (!collectionName || !createdDate) return;
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log({
      collectionName,
      createdDate,
      uploadedImage: uploadedImage?.name
    });
    
    setIsLoading(false);
    // Reset form or show success message
  };

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
          <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-4xl font-bold text-black mb-8 text-center">
                Create the Collection
              </h1>
              
              {/* Image Drop Component */}
              <div className="mb-8">
                <div
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                    isDragOver 
                      ? 'border-indigo-500 bg-indigo-50 scale-105' 
                      : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
                  }`}
                  onDrop={handleImageDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="mx-auto max-h-48 rounded-lg shadow-lg"
                      />
                      <p className="text-sm text-gray-600">
                        {uploadedImage?.name} • Click or drop to replace
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Upload className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-700 mb-2">
                          Drop your image here
                        </p>
                        <p className="text-sm text-gray-500">
                          or click to browse files
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Form */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="space-y-6">
                  {/* Collection Name */}
                  <div>
                    <label htmlFor="collectionName" className="block text-sm font-semibold text-gray-700 mb-3">
                      Collection Name
                    </label>
                    <input
                      type="text"
                      id="collectionName"
                      value={collectionName}
                      onChange={(e) => setCollectionName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                      placeholder="Enter collection name"
                      required
                    />
                  </div>

                  {/* Created Date */}
                  <div>
                    <label htmlFor="createdDate" className="block text-sm font-semibold text-gray-700 mb-3">
                      Created Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        id="createdDate"
                        value={createdDate}
                        onChange={(e) => setCreatedDate(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900"
                        required
                      />
                      <Calendar className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white font-semibold py-4 px-6 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100 shadow-lg"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Creating Collection...</span>
                      </div>
                    ) : (
                      'Create Collection'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}