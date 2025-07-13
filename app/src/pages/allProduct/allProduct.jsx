import React, { useState, useEffect } from 'react';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import NavBar from '../../components/navBar';
import axios from 'axios';
import baseUrl from '../../url';
import Footer from "../../components/footer"

const ProductsShowcase = () => {
    const [products, setProducts] = useState([]);
    const [likedProducts, setLikedProducts] = useState(new Set());
    const [cartItems, setCartItems] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
        const fetchAllProducts = async() => {
            try {
                setLoading(true);
                const response = await axios.get(`${baseUrl}/product/get/all`);
                console.log(response)
                const shuffledProducts = shuffleArray(response.data.products || []);
                setProducts(shuffledProducts);
            } catch (err) {
                console.error(err);
                setError('Failed to load products');
            } finally {
                setLoading(false);
            }
        };
        fetchAllProducts();
    }, []);

    // Toggle like function
    const toggleLike = (productId) => {
        setLikedProducts(prev => {
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
        setCartItems(prev => {
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
                className={`w-3 h-3 ${index < safeRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
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

    return (
        <div>
            <NavBar />
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                        <h1 className="text-xl sm:text-3xl font-bold text-gray-900">Our Products</h1>
                        <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">Discover our exquisite collection</p>
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
                                        <div className="relative aspect-square bg-gray-100">
                                            {product.imageUrl && (
                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.name || 'Product image'}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}

                                            {/* Badges */}
                                            <div className="absolute top-1 left-1 sm:top-3 sm:left-3">
                                                {product.bestseller && (
                                                    <span className="bg-green-500 text-white text-[10px] sm:text-xs font-medium px-1 py-0.5 sm:px-2 sm:py-1 rounded-full">
                                                        Bestseller
                                                    </span>
                                                )}
                                            </div>

                                            {/* Heart Icon */}
                                            <button
                                                onClick={() => toggleLike(product.id)}
                                                className="absolute top-1 right-1 sm:top-3 sm:right-3 p-1 sm:p-2 bg-white rounded-full shadow-sm sm:shadow-md hover:bg-gray-50 transition-colors duration-200"
                                            >
                                                <Heart
                                                    className={`w-3 h-3 sm:w-5 sm:h-5 ${
                                                        likedProducts.has(product.id)
                                                            ? 'fill-red-500 text-red-500'
                                                            : 'text-gray-400'
                                                    }`}
                                                />
                                            </button>
                                        </div>

                                        {/* Product Info */}
                                        <div className="p-2 sm:p-4">
                                            <h3 className="text-xs sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2 line-clamp-2">
                                                {product.ProductName || 'Unnamed Product'}
                                            </h3>

                                            {/* Rating */}
                                            <div className="flex items-center gap-0.5 sm:gap-1 mb-1 sm:mb-3">
                                                <div className="flex">
                                                    {renderStars(rating)}
                                                </div>
                                                <span className="text-[10px] sm:text-sm text-gray-500 ml-0.5 sm:ml-1">
                                                    ({reviews})
                                                </span>
                                            </div>

                                            {/* Price and Add to Cart */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1 sm:gap-2">
                                                    <span className="text-xs sm:text-xl font-bold text-gray-900">
                                                        ${product.OfferPrice}
                                                    </span>
                                                    {product.NormalPrice > product.OfferPrice && (
                                                        <span className="text-[10px] sm:text-sm text-gray-500 line-through">
                                                            ${product.NormalPrice}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Add to Cart Button */}
                                                <button
                                                    onClick={() => addToCart(product.id)}
                                                    className={`p-1 sm:px-3 sm:py-2 rounded-md sm:rounded-lg font-medium transition-all duration-200 flex items-center gap-1 ${
                                                        cartItems.has(product.id)
                                                            ? 'bg-green-600 text-white'
                                                            : 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white hover:from-yellow-500 hover:to-yellow-700'
                                                    }`}
                                                >
                                                    <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                                                    <span className="hidden xs:inline text-[10px] sm:text-base">
                                                        {cartItems.has(product.id) ? 'Added' : 'Add'}
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
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