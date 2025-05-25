import React, { useState } from 'react';
import { ShoppingCart, Plus, Star, Heart, ShoppingBag } from 'lucide-react';
import NavBar from "../../components/navBar";
import Footer from "../../components/footer"

const RingCategoryList = () => {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState(new Set());

  const ringCategories = [
    {
      id: 1,
      name: 'Engagement Rings',
      originalPrice: 3200,
      price: 2500,
      rating: 4.8,
      reviews: 124,
      badge: 'Bestseller',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop'
    },
    {
      id: 2,
      name: 'Wedding Bands',
      originalPrice: 1000,
      price: 800,
      rating: 4.9,
      reviews: 89,
      badge: 'New',
      image: 'https://images.unsplash.com/photo-1544376664-80b17f09d399?w=400&h=400&fit=crop'
    },
    {
      id: 3,
      name: 'Promise Rings',
      originalPrice: 600,
      price: 450,
      rating: 4.6,
      reviews: 67,
      badge: 'Sale',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop'
    },
    {
      id: 4,
      name: 'Anniversary Rings',
      originalPrice: 1500,
      price: 1200,
      rating: 4.7,
      reviews: 156,
      badge: 'Premium',
      image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&h=400&fit=crop'
    },
    {
      id: 5,
      name: 'Cocktail Rings',
      originalPrice: 850,
      price: 680,
      rating: 4.4,
      reviews: 43,
      badge: 'Sale',
      image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop'
    },
    {
      id: 6,
      name: 'Signet Rings',
      originalPrice: 400,
      price: 320,
      rating: 4.3,
      reviews: 78,
      badge: 'New',
      image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=400&fit=crop'
    },
    {
      id: 7,
      name: 'Class Rings',
      originalPrice: 350,
      price: 280,
      rating: 4.2,
      reviews: 92,
      badge: 'Premium',
      image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=400&fit=crop'
    },
    {
      id: 8,
      name: 'Eternity Rings',
      originalPrice: 2250,
      price: 1800,
      rating: 4.9,
      reviews: 203,
      badge: 'Bestseller',
      image: 'https://images.unsplash.com/photo-1588444837495-c6c080130001?w=400&h=400&fit=crop'
    },
    {
      id: 9,
      name: 'Stackable Rings',
      originalPrice: 200,
      price: 150,
      rating: 4.5,
      reviews: 134,
      badge: 'New',
      image: 'https://images.unsplash.com/photo-1596944924617-727b2d6b6b39?w=400&h=400&fit=crop'
    },
    {
      id: 10,
      name: 'Statement Rings',
      originalPrice: 1200,
      price: 950,
      rating: 4.6,
      reviews: 87,
      badge: 'Sale',
      image: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=400&h=400&fit=crop'
    },
    {
      id: 11,
      name: 'Birthstone Rings',
      originalPrice: 480,
      price: 380,
      rating: 4.4,
      reviews: 112,
      badge: 'Premium',
      image: 'https://images.unsplash.com/photo-1583292650898-7d22cd27ca6b?w=400&h=400&fit=crop'
    },
    {
      id: 12,
      name: 'Fashion Rings',
      originalPrice: 160,
      price: 120,
      rating: 4.1,
      reviews: 65,
      badge: 'New',
      image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400&h=400&fit=crop'
    },
    {
      id: 13,
      name: 'Vintage Rings',
      originalPrice: 1900,
      price: 1500,
      rating: 4.8,
      reviews: 189,
      badge: 'Bestseller',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop'
    },
    {
      id: 14,
      name: 'Men\'s Rings',
      originalPrice: 550,
      price: 420,
      rating: 4.5,
      reviews: 145,
      badge: 'Sale',
      image: 'https://images.unsplash.com/photo-1614208259338-5fc30cc0e6b2?w=400&h=400&fit=crop'
    },
    {
      id: 15,
      name: 'Women\'s Rings',
      originalPrice: 800,
      price: 650,
      rating: 4.7,
      reviews: 167,
      badge: 'Premium',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop'
    },
    {
      id: 16,
      name: 'Couple Rings',
      originalPrice: 1100,
      price: 890,
      rating: 4.6,
      reviews: 98,
      badge: 'New',
      image: 'https://images.unsplash.com/photo-1544376664-80b17f09d399?w=400&h=400&fit=crop'
    }
  ];

  const addToCart = (ring) => {
    const existingItem = cart.find(item => item.id === ring.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === ring.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...ring, quantity: 1 }]);
    }
  };

  const toggleFavorite = (productId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div>
    <NavBar />
        <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Ring Category</h1>
        <div className="relative">
          {/* <ShoppingCart className="w-8 h-8 text-gray-600" /> */}
          {getTotalItems() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
              {getTotalItems()}
            </span>
          )}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {ringCategories.map((product) => (
          <a href="/view/product" key={product.id}>
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden w-72">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      product.badge === "Bestseller"
                        ? "bg-green-100 text-green-800"
                        : product.badge === "New"
                        ? "bg-blue-100 text-blue-800"
                        : product.badge === "Sale"
                        ? "bg-red-100 text-red-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {product.badge}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite(product.id);
                  }}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  <Heart
                    className={`h-5 w-5 ${
                      favorites.has(product.id)
                        ? "text-red-500 fill-current"
                        : "text-gray-400"
                    }`}
                  />
                </button>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {product.name}
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
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart(product);
                  }}
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border">
          <h3 className="font-semibold mb-2">Cart Summary</h3>
          <p className="text-sm text-gray-600">
            {getTotalItems()} item(s) in cart
          </p>
          <p className="font-bold text-green-600">
            Total: ${cart.reduce((total, item) => total + (item.price * item.quantity), 0).toLocaleString()}
          </p>
        </div>
      )}
    </div>
    <Footer />
    </div>
  );
};

export default RingCategoryList;