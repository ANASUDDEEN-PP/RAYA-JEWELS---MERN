import React, { useState, useEffect } from "react";
import { Heart, Star, ShoppingCart } from "lucide-react";
import NavBar from "../../components/navBar";
import axios from "axios";
import baseUrl from "../../url";
import Footer from "../../components/footer";
import UnauthorizedPage from "../../components/unauthorized Alert/unAuth";
import { Link } from "react-router-dom";

const ProductsShowcase = () => {
  const [products, setProducts] = useState([]);
  const [likedProducts, setLikedProducts] = useState(new Set());
  const [cartItems, setCartItems] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const localUser = JSON.parse(localStorage.getItem("userProfile")) || null;
  console.log(localUser);

  // Shuffle array function
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseUrl}/product/get/all`);
        console.log(response);
        const shuffledProducts = shuffleArray(response.data.products || []);
        setProducts(shuffledProducts);
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  // Toggle like function
  const toggleLike = (productId) => {
    setLikedProducts((prev) => {
      const newLiked = new Set(prev);
      if (newLiked.has(productId)) {
        newLiked.delete(productId);
      } else {
        newLiked.add(productId);
      }
      return newLiked;
    });
  };

  // Add to cart function
  const addToCart = (productId) => {
    setCartItems((prev) => {
      const newCart = new Set(prev);
      newCart.add(productId);
      return newCart;
    });
  };

  // Render stars
  const renderStars = (rating) => {
    const safeRating = rating || 0;
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-3 h-3 ${index < safeRating
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
          }`}
      />
    ));
  };

  if (loading) {
    return (
      <div>
        <NavBar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <NavBar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!localUser) {
    return (
      <div>
        <NavBar />
        <UnauthorizedPage />
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <div className="min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <h1 className="text-xl sm:text-3xl font-bold text-gray-900">
              Our Products
            </h1>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
              Discover our exquisite collection
            </p>
          </div>
        </div>

        {/* Products Grid - 2 columns on mobile */}
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-8">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p>No products available</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6">
              {products.map((product) => {
                const price = product.price || 0;
                const originalPrice = product.originalPrice || 0;
                const reviews = product.reviews || 0;
                const rating = product.rating || 0;

                return (
                  <div
                    key={product.id || Math.random()}
                    className="bg-white rounded-lg shadow-sm sm:shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    {/* Image Container */}
                    <Link
                      to={`/view/product/${product._id}`}
                    >
                      <div className="relative aspect-square bg-gray-100">
                        {product.imageUrl && (
                          <img
                            src={product.imageUrl}
                            alt={product.name || "Product image"}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-2 sm:p-4">
                        <h3 className="text-xs sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2 line-clamp-2">
                          {product.ProductName || "Unnamed Product"}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-0.5 sm:gap-1 mb-1 sm:mb-3">
                          <div className="flex">{renderStars(rating)}</div>
                          <span className="text-[10px] sm:text-sm text-gray-500 ml-0.5 sm:ml-1">
                            ({reviews})
                          </span>
                        </div>

                        {/* Price and Add to Cart */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <span className="text-xs sm:text-xl font-bold text-gray-900">
                              ₹{product.OfferPrice}
                            </span>
                            {product.NormalPrice > product.OfferPrice && (
                              <span className="text-[10px] sm:text-sm text-gray-500 line-through">
                                ₹{product.NormalPrice}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Load More Button */}
        {products.length > 0 && (
          <div className="text-center pb-8 sm:pb-12">
            <button className="bg-black text-white px-6 py-2 sm:px-8 sm:py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium text-sm sm:text-base">
              Load More Products
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProductsShowcase;
