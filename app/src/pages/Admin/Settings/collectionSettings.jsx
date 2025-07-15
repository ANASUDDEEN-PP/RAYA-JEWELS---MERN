import { useState, useEffect } from "react";
import {
  ArrowLeft,
  User,
  Upload,
  Calendar,
  Loader2,
  Edit,
  Trash,
  Save,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Components/sideBarSettings";
import axios from "axios";
import baseUrl from "../../../url";
import toast, { Toaster } from "react-hot-toast";
import UnauthorizedPage from "../../../components/unauthorized Alert/unAuth";

export default function CreateCollectionPage() {
  const navigate = useNavigate();
  const [collectionName, setCollectionName] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState("");
  const [collections, setCollections] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    date: "",
    image: null,
  });

  // Fetch collections on component mount
  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await axios.get(`${baseUrl}/collection/list`);
      console.log(response);
      if (response.status === 200) {
        setCollections(response.data.fetchData);
      }
    } catch (err) {
      console.error("Error fetching collections:", err);
      toast.error("Failed to fetch collections");
    }
  };

  const processImageFile = (file) => {
    return new Promise((resolve) => {
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file (JPEG, PNG, etc.)");
        resolve(false);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        resolve(false);
        return;
      }

      setError("");
      setUploadedImage(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImageBase64(e.target.result);
        resolve(true);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await processImageFile(files[0]);
    }
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await processImageFile(file);
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
    setError("");

    if (!collectionName) {
      setError("Collection name is required");
      return;
    }

    if (!createdDate) {
      setError("Created date is required");
      return;
    }

    setIsLoading(true);

    try {
      const collectionData = {
        name: collectionName,
        date: createdDate,
        image: imageBase64,
        imageName: uploadedImage?.name || "collection-image",
      };

      const response = await axios.post(
        `${baseUrl}/collection/create`,
        collectionData
      );
      if (response.status === 202) {
        toast.error(response.data.message);
      } else if (response.status === 200) {
        toast.success(response.data.message);
        // Reset form
        setCollectionName("");
        setCreatedDate("");
        setUploadedImage(null);
        setImageBase64(null);
        // Refresh collections
        fetchCollections();
      }
    } catch (err) {
      console.error("Error creating collection:", err);
      setError("Failed to create collection. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (collection) => {
    setEditingId(collection._id);
    setEditFormData({
      name: collection.name,
      date: collection.date, // Format date for input
      image: collection.image,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const result = await processImageFile(file);
      if (result) {
        setEditFormData((prev) => ({
          ...prev,
          image: imageBase64,
        }));
      }
    }
  };

  const handleSaveEdit = async (id) => {
    try {
      console.log(editFormData, id);
      const response = await axios.put(
        `${baseUrl}/collection/update/${id}`,
        editFormData
      );
      console.log(response);
      if (response.status === 200) {
        toast.success("Collection updated successfully");
        setEditingId(null);
        fetchCollections();
      }
    } catch (err) {
      console.error("Error updating collection:", err);
      toast.error("Failed to update collection");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this collection?")) {
      try {
        const response = await axios.delete(
          `${baseUrl}/collection/delete/${id}`
        );
        if (response.status === 200) {
          toast.success("Collection deleted successfully");
          fetchCollections();
        }
      } catch (err) {
        console.error("Error deleting collection:", err);
        toast.error("Failed to delete collection");
      }
    }
  };

  const isAdmin = JSON.parse(localStorage.getItem("adminCode"));
  if (!isAdmin && isAdmin !== "ADMRAYA1752604097026") {
    return (
      <div>
        <UnauthorizedPage />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div
            onClick={() => navigate(-1)}
            className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Go back</span>
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
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
                Create New Collection
              </h1>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              {/* Image Upload Section */}
              <div className="mb-8">
                <div
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                    isDragOver
                      ? "border-indigo-500 bg-indigo-50 scale-[1.02]"
                      : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
                  } ${error ? "border-red-300" : ""}`}
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

                  {imageBase64 ? (
                    <div className="space-y-4">
                      <img
                        src={imageBase64}
                        alt="Preview"
                        className="mx-auto max-h-48 rounded-lg shadow-lg object-cover"
                      />
                      <p className="text-sm text-gray-600">
                        {uploadedImage?.name} • Click or drag to replace
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Upload className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-700 mb-2">
                          Drag & drop your image here
                        </p>
                        <p className="text-sm text-gray-500">
                          or click to browse files (Max 5MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Collection Form */}
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 mb-12">
                <div className="space-y-6">
                  {/* Collection Name */}
                  <div>
                    <label
                      htmlFor="collectionName"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Collection Name *
                    </label>
                    <input
                      type="text"
                      id="collectionName"
                      value={collectionName}
                      onChange={(e) => setCollectionName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                      placeholder="My Awesome Collection"
                      required
                    />
                  </div>

                  {/* Created Date */}
                  <div>
                    <label
                      htmlFor="createdDate"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Creation Date *
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        id="createdDate"
                        value={createdDate}
                        onChange={(e) => setCreatedDate(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900 pr-10"
                        required
                      />
                      <Calendar className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading || !collectionName || !createdDate}
                    className={`w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ${
                      isLoading || !collectionName || !createdDate
                        ? "opacity-70 cursor-not-allowed"
                        : ""
                    } shadow-md hover:shadow-lg`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Creating Collection...</span>
                      </div>
                    ) : (
                      "Create Collection"
                    )}
                  </button>
                </div>
              </div>

              {/* Collections List */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  Your Collections
                </h2>

                {collections.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No collections found. Create one above!
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            SL No.
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Image
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Collection Name
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Created Date
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {collections.map((collection, index) => (
                          <tr key={collection._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <img
                                src={collection.File}
                                alt={collection.File}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {editingId === collection._id ? (
                                <input
                                  type="text"
                                  name="name"
                                  value={editFormData.CollectionName}
                                  onChange={handleEditChange}
                                  className="border border-gray-300 rounded px-2 py-1 w-full"
                                />
                              ) : (
                                <div className="text-sm font-medium text-gray-900">
                                  {collection.CollectionName}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {editingId === collection._id ? (
                                <input
                                  type="date"
                                  name="date"
                                  value={editFormData.CreatedData}
                                  onChange={handleEditChange}
                                  className="border border-gray-300 rounded px-2 py-1"
                                />
                              ) : (
                                <div className="text-sm text-gray-500">
                                  {new Date(
                                    collection.CreatedData
                                  ).toLocaleDateString()}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {editingId === collection._id ? (
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() =>
                                      handleSaveEdit(collection._id)
                                    }
                                    className="text-green-600 hover:text-green-900"
                                  >
                                    <Save className="w-5 h-5" />
                                  </button>
                                  <button
                                    onClick={handleCancelEdit}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    <X className="w-5 h-5" />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleEdit(collection)}
                                    className="text-indigo-600 hover:text-indigo-900"
                                  >
                                    <Edit className="w-5 h-5" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(collection._id)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    <Trash className="w-5 h-5" />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
