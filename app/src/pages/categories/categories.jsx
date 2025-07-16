import React, { useState } from "react";
import { ShoppingCart, Plus, Star, Heart, ShoppingBag } from "lucide-react";
import NavBar from "../../components/navBar";
import Footer from "../../components/footer";
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import baseUrl from "../../url";
import toast, { Toaster } from "react-hot-toast";
import UnauthorizedPage from "../../components/unauthorized Alert/unAuth";

const RingCategoryList = () => {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const { id } = useParams();
  const [ringCategories, setCategories] = useState([]);
  const [categoryName, setCategorieName] = useState("");
  const [loading, setLoading] = useState(true);
  const [addToCartLoading, setAddToCartLoading] = useState(false);

  const localUser = JSON.parse(localStorage.getItem("userProfile")) || null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const responce = await axios.get(
          `${baseUrl}/product/get/collection/product/${id}`
        );
        setCategories(responce.data.products);
        setCategorieName(responce.data.collection);
      } catch (err) {
        console.log(err);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const addToCart = async (prd) => {
    try {
      const items = {
        UserId: localUser._id,
        Quantity: 1,
        itemsData: prd._id,
      };
      setAddToCartLoading(true);
      const responce = await axios.post(`${baseUrl}/cart/add/item`, items);
      if (responce.status == 200) {
        toast.success(responce.data.message);
        window.location.reload();
      } else toast.error(responce.data.message);
    } catch (err) {
      console.log(err);
    } finally {
      setAddToCartLoading(false);
    }
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Shimmer loading component
  const ShimmerLoader = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden w-72">
            <div className="relative">
              <div className="w-full h-64 bg-gray-200 animate-pulse"></div>
            </div>
            <div className="p-6">
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-4 w-3/4"></div>
              <div className="flex items-center mb-4">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-4 w-4 bg-gray-200 rounded-full animate-pulse"></div>
                  ))}
                </div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-8 ml-2"></div>
              </div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex space-x-2">
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-12"></div>
                </div>
              </div>
              <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

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
      <div className="max-w-7xl mx-auto p-6 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            {loading ? (
              <div className="h-10 bg-gray-200 rounded animate-pulse w-64"></div>
            ) : (
              `${categoryName} Category`
            )}
          </h1>
          <div className="relative">
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                {getTotalItems()}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <ShimmerLoader />
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {ringCategories.length > 0 ? (
              ringCategories.map((product) => (
                <Link to={`/view/product/${product._id}`} key={product.id}>
                  <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden w-72">
                    <div className="relative">
                      <img
                        src={product.images[0]?.ImageUrl}
                        alt={product.ProductName}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {product.ProductName}
                      </h3>

                      <div className="flex items-center mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(product.rating)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-2">
                          ({product.reviews})
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-gray-900">
                            ${product.OfferPrice}
                          </span>
                          {product.OfferPrice && (
                            <span className="text-lg text-gray-500 line-through">
                              ${product.NormalPrice}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart(product);
                        }}
                        className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>
                          {addToCartLoading ? "Adding to Cart..." : `Add to Cart`}
                        </span>
                      </button>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">
                  No products found in this category
                </p>
              </div>
            )}
          </div>
        )}

        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border">
            <h3 className="font-semibold mb-2">Cart Summary</h3>
            <p className="text-sm text-gray-600">
              {getTotalItems()} item(s) in cart
            </p>
            <p className="font-bold text-green-600">
              Total: $
              {cart
                .reduce((total, item) => total + item.price * item.quantity, 0)
                .toLocaleString()}
            </p>
          </div>
        )}
      </div>
      <Footer />
      <Toaster />
    </div>
  );
};

export default RingCategoryList;