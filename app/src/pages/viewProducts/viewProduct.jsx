import React, { useEffect, useState } from "react";
import {
  Star,
  Heart,
  ShoppingBag,
  Share2,
  MessageCircle,
  Send,
  ThumbsUp,
  Package,
  User,
} from "lucide-react";
import NavBar from "../../components/navBar";
import Footer from "../../components/footer";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import baseUrl from "../../url";
import CommentsSection from "./CommentSection";
import toast, { Toaster } from "react-hot-toast";

const ProductView = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [newComment, setNewComment] = useState("");
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [comments, setComments] = useState([]);
  const [likedComments, setLikedComments] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();
  const { id } = useParams();

  const localUser = JSON.parse(localStorage.getItem('userProfile'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/product/get/${id}`);
        setProduct(response.data.product);
        setImages(response.data.images);

        // Fetch comments
        const commentsResponse = await axios.get(`${baseUrl}/product/get/product/comments/${id}`);
        setComments(commentsResponse.data.comments || []);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [id]);

  const handleAddComment = async () => {
  if (!newComment.trim()) return;
  setLoading(true);
  try {
    // Format date as "26 June 25 | 02:00 pm"
    const formatDate = (date) => {
      const d = new Date(date);
      const day = d.getDate();
      const month = d.toLocaleString('default', { month: 'long' });
      const year = d.getFullYear().toString().slice(-2);
      
      let hours = d.getHours();
      const minutes = d.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'pm' : 'am';
      
      hours = hours % 12;
      hours = hours ? hours : 12; // Convert 0 to 12
      
      return `${day} ${month} ${year} | ${hours}:${minutes} ${ampm}`;
    };

    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);

    const comment = {
      ProductId: id,
      UserId: localUser.Name,
      Rating: rating || 5, // Use the selected rating or default to 5
      Comment: newComment,
      Date: formattedDate, // Using formatted date string
      Likes: 0,
      Avatar: localUser.ProfilePicture || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
    };
    console.log(comment)

    const response = await axios.post(`${baseUrl}/product/post/product`, comment);
    console.log(response)
    if (response.status === 200) {
      toast.success(response.data.message);
      setComments(prev => [response.data.comment, ...prev]);
      setNewComment("");
      setRating(0);
    } else if (response.status === 201){
      toast.error(response.data.message)
    }
  } catch (error) {
    console.error("Error adding comment:", error);
    toast.error("Something went wrong");
  } finally {
    setLoading(false);
  }
};
  const getBadgeStyle = (category) => {
    switch (category?.toLowerCase()) {
      case "bestseller": return "bg-green-100 text-green-800";
      case "premium": return "bg-purple-100 text-purple-800";
      case "special offer": return "bg-red-100 text-red-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  // Calculate average rating
  const averageRating = comments.length > 0 
    ? (comments.reduce((sum, comment) => sum + (comment.Rating || 0), 0) / comments.length)
    : 4.9; // Default if no comments

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const specifications = [
    { label: "Collection", value: product.CollectionName },
    { label: "Material", value: product.Material },
    { label: "Sizes Available", value: product.Size },
    { label: "Quantity Available", value: product.Quantity },
  ];

  return (
    <div>
      <NavBar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Product Images */}
              <div className="space-y-4">
                <div className="aspect-square overflow-hidden rounded-xl bg-gray-100">
                  <img
                    src={images[selectedImage]?.ImageUrl || "https://via.placeholder.com/600"}
                    alt={product.ProductName}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Thumbnail Images */}
                <div className="grid grid-cols-4 gap-3">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index ? "border-yellow-500" : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={image.ImageUrl || "https://via.placeholder.com/150"}
                        alt={`${product.ProductName} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-6">
                {/* Category Badge */}
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getBadgeStyle(product.CollectionName)}`}>
                    {product.CollectionName}
                  </span>
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Heart className={`h-6 w-6 ${isFavorite ? "text-red-500 fill-current" : "text-gray-400"}`} />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <Share2 className="h-6 w-6 text-gray-400" />
                  </button>
                </div>

                {/* Product Name */}
                <h1 className="text-3xl font-bold text-gray-900">{product.ProductName}</h1>

                {/* Rating */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.round(averageRating) 
                            ? "text-yellow-400 fill-current" 
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-medium">{averageRating.toFixed(1)}</span>
                  <span className="text-gray-500">({comments.length} reviews)</span>
                </div>

                {/* Pricing */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-500 line-through text-xl">${product.NormalPrice}</span>
                    <span className="text-green-600 font-bold text-3xl">${product.OfferPrice}</span>
                  </div>
                  <p className="text-sm text-green-600 font-medium">
                    Save ${(parseFloat(product.NormalPrice) - parseFloat(product.OfferPrice)).toFixed(2)} (
                    {Math.round((1 - parseFloat(product.OfferPrice) / parseFloat(product.NormalPrice)) * 100) + "% off"}
                    )
                  </p>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {product.ProductName} is a premium piece from our {product.CollectionName} collection. 
                    Crafted with high-quality {product.Material}, this item is designed for elegance and durability.
                  </p>
                </div>

                {/* Specifications */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Specifications</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {specifications.map((spec, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">{spec.label}</p>
                        <p className="font-medium">{spec.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quantity and Add to Cart */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <label className="text-sm font-medium">Quantity:</label>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-2 hover:bg-gray-100 transition-colors"
                        disabled={parseInt(product.Quantity) === 0}
                      >
                        -
                      </button>
                      <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 py-2 hover:bg-gray-100 transition-colors"
                        disabled={
                          parseInt(product.Quantity) === 0 ||
                          quantity >= parseInt(product.Quantity)
                        }
                      >
                        +
                      </button>
                    </div>
                    {parseInt(product.Quantity) > 0 && parseInt(product.Quantity) < 5 && (
                      <span className="text-red-600 text-sm font-medium">Limited Stock Available!</span>
                    )}
                    {parseInt(product.Quantity) === 0 && (
                      <span className="text-red-600 text-sm font-medium">Out of Stock</span>
                    )}
                  </div>

                  {parseInt(product.Quantity) > 0 ? (
                    <>
                      <button
                        onClick={() => navigate("/checkout")}
                        className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                      >
                        <Package className="h-5 w-5" />
                        <span>
                          Check Out - ${(parseFloat(product.OfferPrice) * quantity).toFixed(2)}
                        </span>
                      </button>
                      <button className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
                        <ShoppingBag className="h-5 w-5" />
                        <span>
                          Add to Cart - ${(parseFloat(product.OfferPrice) * quantity).toFixed(2)}
                        </span>
                      </button>
                    </>
                  ) : (
                    <button
                      className="w-full bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg cursor-not-allowed flex items-center justify-center space-x-2"
                      disabled
                    >
                      <Package className="h-5 w-5" />
                      <span>Out of Stock</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Comments Section */}
            <CommentsSection
              comments={comments}
              newComment={newComment}
              setNewComment={setNewComment}
              handleAddComment={handleAddComment}
              likedComments={likedComments}
              isLoading={loading}
              rating={rating}
              setRating={setRating}
              hoverRating={hoverRating}
              setHoverRating={setHoverRating}
            />
          </div>
        </div>
      </div>
      <Footer />
      <Toaster />
    </div>
  );
};

export default ProductView;