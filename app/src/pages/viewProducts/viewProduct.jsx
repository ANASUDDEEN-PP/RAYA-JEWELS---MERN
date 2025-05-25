import React, { useState } from "react";
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
import Footer from '../../components/footer'
import { useNavigate } from "react-router-dom";

const ProductView = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [newComment, setNewComment] = useState("");
  const navigate = useNavigate();
  const [comments, setComments] = useState([
    {
      id: 1,
      user: "Sarah Johnson",
      rating: 5,
      comment:
        "Absolutely stunning! The craftsmanship is incredible and it looks even better in person.",
      date: "2 days ago",
      likes: 12,
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b567?w=40&h=40&fit=crop&crop=face",
    },
    {
      id: 2,
      user: "Michael Chen",
      rating: 4,
      comment:
        "Great quality diamond ring. My fiancée loves it! Shipping was fast and packaging was beautiful.",
      date: "1 week ago",
      likes: 8,
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    },
    {
      id: 3,
      user: "Emma Wilson",
      rating: 5,
      comment:
        "Perfect for special occasions. The sparkle is amazing and it feels very premium.",
      date: "2 weeks ago",
      likes: 15,
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
    },
  ]);
  const [likedComments, setLikedComments] = useState(new Set());

  const product = {
    id: 1,
    name: "Diamond Eternity Ring",
    description:
      "Exquisite 18k white gold eternity ring featuring premium round-cut diamonds. Each diamond is carefully selected for maximum brilliance and fire. The ring showcases exceptional craftsmanship with a comfortable fit design that makes it perfect for everyday wear or special occasions. This timeless piece represents eternal love and commitment.",
    originalPrice: 3299,
    discountPrice: 2899,
    rating: 4.9,
    reviews: 124,
    category: "Bestseller",
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&h=600&fit=crop",
    ],
    specifications: [
      { label: "Metal", value: "18k White Gold" },
      { label: "Stone", value: "Diamond" },
      { label: "Carat Weight", value: "2.5 ct" },
      { label: "Ring Size", value: "Adjustable" },
    ],
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        user: "You",
        rating: 5,
        comment: newComment,
        date: "Just now",
        likes: 0,
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      };
      setComments([comment, ...comments]);
      setNewComment("");
    }
  };

  const toggleLike = (commentId) => {
    const newLikedComments = new Set(likedComments);
    if (newLikedComments.has(commentId)) {
      newLikedComments.delete(commentId);
    } else {
      newLikedComments.add(commentId);
    }
    setLikedComments(newLikedComments);
  };

  const getBadgeStyle = (category) => {
    switch (category.toLowerCase()) {
      case "bestseller":
        return "bg-green-100 text-green-800";
      case "premium":
        return "bg-purple-100 text-purple-800";
      case "special offer":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

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
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Thumbnail Images */}
                <div className="grid grid-cols-4 gap-3">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? "border-yellow-500"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
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
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${getBadgeStyle(
                      product.category
                    )}`}
                  >
                    {product.category}
                  </span>
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Heart
                      className={`h-6 w-6 ${
                        isFavorite
                          ? "text-red-500 fill-current"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <Share2 className="h-6 w-6 text-gray-400" />
                  </button>
                </div>

                {/* Product Name */}
                <h1
                  className="text-3xl font-bold text-gray-900"
                  style={{ fontSize: "30px" }}
                >
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-medium">{product.rating}</span>
                  <span className="text-gray-500">
                    ({product.reviews} reviews)
                  </span>
                </div>

                {/* Pricing */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-4">
                    <span
                      className="text-gray-500 line-through"
                      style={{ fontSize: "20px" }}
                    >
                      ${product.originalPrice}
                    </span>
                    <span
                      className="text-green-600 font-bold"
                      style={{ fontSize: "35px" }}
                    >
                      ${product.discountPrice}
                    </span>
                  </div>
                  <p className="text-sm text-green-600 font-medium">
                    Save ${product.originalPrice - product.discountPrice} (12%
                    off)
                  </p>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p
                    className="text-gray-700 leading-relaxed"
                    style={{ fontSize: "20px" }}
                  >
                    {product.description}
                  </p>
                </div>

                {/* Specifications */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Specifications</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {product.specifications.map((spec, index) => (
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
                      >
                        -
                      </button>
                      <span className="px-4 py-2 border-x border-gray-300">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 py-2 hover:bg-gray-100 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button onClick={() => {navigate('/checkout')}} className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
                    <Package className="h-5 w-5" />
                    <span>
                      Check Out - ${product.discountPrice * quantity}
                    </span>
                  </button>
                  <button className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
                    <ShoppingBag className="h-5 w-5" />
                    <span>
                      Add to Cart - ${product.discountPrice * quantity}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="border-t border-gray-200 p-8">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <MessageCircle className="h-6 w-6 mr-2" />
                  Customer Reviews ({comments.length})
                </h2>

                {/* Add Comment */}
                <div className="bg-gray-50 rounded-xl p-6 mb-8">
                  <h3 className="font-semibold mb-4">Write a Review</h3>
                  <div className="space-y-4">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your experience with this product..."
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none h-24 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
                    />
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">
                          Rate this product:
                        </span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="h-5 w-5 text-yellow-400 fill-current cursor-pointer hover:scale-110 transition-transform"
                            />
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={handleAddComment}
                        className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-6 rounded-lg transition-colors flex items-center space-x-2"
                      >
                        <Send className="h-4 w-4" />
                        <span>Post Review</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start space-x-4">
                        <img
                          src={comment.avatar}
                          alt={comment.user}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {comment.user}
                              </h4>
                              <div className="flex items-center space-x-2">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < comment.rating
                                          ? "text-yellow-400 fill-current"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500">
                                  {comment.date}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-3 leading-relaxed">
                            {comment.comment}
                          </p>
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={() => toggleLike(comment.id)}
                              className={`flex items-center space-x-1 text-sm transition-colors ${
                                likedComments.has(comment.id)
                                  ? "text-blue-600"
                                  : "text-gray-500 hover:text-blue-600"
                              }`}
                            >
                              <ThumbsUp
                                className={`h-4 w-4 ${
                                  likedComments.has(comment.id)
                                    ? "fill-current"
                                    : ""
                                }`}
                              />
                              <span>
                                {comment.likes +
                                  (likedComments.has(comment.id) ? 1 : 0)}
                              </span>
                            </button>
                            <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductView;
