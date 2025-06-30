import React, { useState, useEffect } from 'react';
import { Heart, Star } from 'lucide-react';
import NavBar from '../../components/navBar';

const ProductsShowcase = () => {
    const [products, setProducts] = useState([]);
    const [likedProducts, setLikedProducts] = useState(new Set());

    // Sample product data
    const sampleProducts = [
        {
            id: 1,
            name: "Diamond Eternity Ring",
            price: 2899,
            originalPrice: 3299,
            rating: 4,
            reviews: 124,
            image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&h=300&fit=crop",
            bestseller: true
        },
        {
            id: 2,
            name: "Gold Wedding Band",
            price: 1599,
            originalPrice: 1899,
            rating: 5,
            reviews: 89,
            image: "https://images.unsplash.com/photo-1544376664-80b17f09d399?w=300&h=300&fit=crop",
            bestseller: false
        },
        {
            id: 3,
            name: "Sapphire Engagement Ring",
            price: 3499,
            originalPrice: 4199,
            rating: 4,
            reviews: 67,
            image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop",
            bestseller: true
        },
        {
            id: 4,
            name: "Pearl Necklace Set",
            price: 899,
            originalPrice: 1299,
            rating: 4,
            reviews: 156,
            image: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=300&h=300&fit=crop",
            bestseller: false
        },
        {
            id: 5,
            name: "Tennis Bracelet",
            price: 2199,
            originalPrice: 2699,
            rating: 5,
            reviews: 203,
            image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=300&h=300&fit=crop",
            bestseller: true
        },
        {
            id: 6,
            name: "Emerald Drop Earrings",
            price: 1899,
            originalPrice: 2399,
            rating: 4,
            reviews: 78,
            image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&h=300&fit=crop",
            bestseller: false
        },
        {
            id: 7,
            name: "Vintage Pocket Watch",
            price: 799,
            originalPrice: 999,
            rating: 4,
            reviews: 45,
            image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=300&h=300&fit=crop",
            bestseller: false
        },
        {
            id: 8,
            name: "Ruby Heart Pendant",
            price: 1299,
            originalPrice: 1599,
            rating: 5,
            reviews: 134,
            image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=300&fit=crop",
            bestseller: true
        },
        {
            id: 9,
            name: "Platinum Cufflinks",
            price: 699,
            originalPrice: 899,
            rating: 4,
            reviews: 92,
            image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=300&h=300&fit=crop",
            bestseller: false
        },
        {
            id: 10,
            name: "Crystal Chandelier Earrings",
            price: 599,
            originalPrice: 799,
            rating: 4,
            reviews: 167,
            image: "https://images.unsplash.com/photo-1535556116002-6281ff3e9f36?w=300&h=300&fit=crop",
            bestseller: false
        },
        {
            id: 11,
            name: "Diamond Solitaire Ring",
            price: 4999,
            originalPrice: 5999,
            rating: 5,
            reviews: 289,
            image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&h=300&fit=crop",
            bestseller: true
        },
        {
            id: 12,
            name: "Rose Gold Chain",
            price: 399,
            originalPrice: 499,
            rating: 4,
            reviews: 112,
            image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop",
            bestseller: false
        }
    ];

    // Shuffle array function
    const shuffleArray = (array) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    // Initialize products with random sort
    useEffect(() => {
        setProducts(shuffleArray(sampleProducts));
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

    // Render stars
    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <Star
                key={index}
                className={`w-4 h-4 ${index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
            />
        ));
    };

    return (
        <div>
            <NavBar />
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <h1 className="text-3xl font-bold text-gray-900">Our Products</h1>
                        <p className="mt-2 text-gray-600">Discover our exquisite collection of jewelry and accessories</p>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
                            >
                                {/* Image Container */}
                                <div className="relative aspect-square bg-gray-100">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />

                                    {/* Badges */}
                                    <div className="absolute top-3 left-3">
                                        {product.bestseller && (
                                            <span className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                                                Bestseller
                                            </span>
                                        )}
                                    </div>

                                    {/* Heart Icon */}
                                    <button
                                        onClick={() => toggleLike(product.id)}
                                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        <Heart
                                            className={`w-5 h-5 ${likedProducts.has(product.id)
                                                    ? 'fill-red-500 text-red-500'
                                                    : 'text-gray-400'
                                                }`}
                                        />
                                    </button>
                                </div>

                                {/* Product Info */}
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                        {product.name}
                                    </h3>

                                    {/* Rating */}
                                    <div className="flex items-center gap-1 mb-3">
                                        <div className="flex">
                                            {renderStars(product.rating)}
                                        </div>
                                        <span className="text-sm text-gray-500 ml-1">({product.reviews})</span>
                                    </div>

                                    {/* Price */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl font-bold text-gray-900">
                                            ${product.price.toLocaleString()}
                                        </span>
                                        {product.originalPrice > product.price && (
                                            <span className="text-sm text-gray-500 line-through">
                                                ${product.originalPrice.toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Load More Button */}
                <div className="text-center pb-12">
                    <button className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium">
                        Load More Products
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductsShowcase;