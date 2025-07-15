import React, { useState, useEffect, useRef } from "react";
import { Heart, Star, ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import Footer from "../../components/footer";
import NavBar from "../../components/navBar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import baseUrl from "../../url";
import LoginWarning from "../../components/Alert/pleaseLoginWarning";

const JewelryEcommerce = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [categories, setCategories] = useState([]);
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const [showLoginWarning, setShowLoginWarning] = useState(false);
  const [featuredProducts, setFeaturedProduct] = useState([]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  const heroSlides = [
    {
      image:
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&h=600&fit=crop",
      title: "Timeless Elegance",
      subtitle: "Discover our signature diamond collection",
      cta: "Shop Now",
    },
    {
      image:
        "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=1200&h=600&fit=crop",
      title: "Luxury Redefined",
      subtitle: "Handcrafted pieces for special moments",
      cta: "Explore",
    },
    {
      image:
        "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=1200&h=600&fit=crop",
      title: "Modern Classics",
      subtitle: "Contemporary designs, eternal beauty",
      cta: "Discover",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/collection/home/get/collection`
        );
        // console.log(response)
        setCategories(response.data.collections);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    const fetchGetSixProducts = async () => {
      try {
        const res = await axios.get(`${baseUrl}/product/get/random/product`);
        console.log(res);
        setFeaturedProduct(res.data.products);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
    fetchGetSixProducts();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const toggleFavorite = (productId, e) => {
    e.preventDefault();
    e.stopPropagation();
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
  };

  const handleClick = (name, category) => (e) => {
    e.preventDefault();
    if (localStorage.getItem("isLoggedIn") === "true") {
      if (category === "category") {
        navigate(`/view/categories/${name}`);
        window.scrollTo(0, 0);
      } else if (category === "product") {
        navigate(`/view/product/${name}`);
      } else if (category === "btnClick"){
        navigate("/all/product");
        window.scrollTo(0, 0);
      }
    } else {
      setShowLoginWarning(true);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <NavBar />

      {/* Hero Section with Carousel */}
      <section className="relative h-96 md:h-[600px] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="w-full h-full bg-cover bg-center bg-black bg-opacity-40 bg-blend-overlay"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="flex items-center justify-center h-full text-center text-white px-4">
                <div className="max-w-2xl">
                  <h2 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
                    {slide.title}
                  </h2>
                  <p className="text-xl md:text-2xl mb-8 animate-fade-in-delay">
                    {slide.subtitle}
                  </p>
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 animate-fade-in-delay-2">
                    {slide.cta}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Slide indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? "bg-white" : "bg-white bg-opacity-50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-gray-600 text-lg">
              Discover our curated collections of fine jewelry
            </p>
          </div>

          {/* Arrow buttons */}
          {categories.length > 4 && (
            <>
              <button
                onClick={() => scroll("left")}
                className="absolute mt-12 left-4 md:left-8 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
                style={{
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                }}
                aria-label="Scroll categories left"
              >
                <div className="relative h-8 w-8 flex items-center justify-center">
                  <ChevronLeft className="w-6 h-6 text-gray-700 group-hover:text-black transition-colors" />
                </div>
              </button>
              <button
                onClick={() => scroll("right")}
                className="absolute mt-12 right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
                style={{
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                }}
                aria-label="Scroll categories right"
              >
                <div className="relative h-8 w-8 flex items-center justify-center">
                  <ChevronRight className="w-6 h-6 text-gray-700 group-hover:text-black transition-colors" />
                </div>
              </button>
            </>
          )}

          {/* Scrollable container */}
          <div
            ref={scrollRef}
            className="flex space-x-6 overflow-x-auto scrollbar-hide scroll-smooth px-4 md:px-8"
            aria-label="Categories list"
          >
            {categories.map((category, index) => (
              <Link
                to="#"
                onClick={handleClick(category.id, "category")}
                key={index}
                className="flex-shrink-0 w-60 group cursor-pointer"
                aria-label={`View ${category.name} collection`}
              >
                <div className="relative overflow-hidden rounded-2xl mb-4">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {category.name}
                </h3>
                <p className="text-gray-600">{category.count}+ pieces</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {showLoginWarning && (
        <LoginWarning onClose={() => setShowLoginWarning(false)} />
      )}

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Collection
            </h2>
            <p className="text-gray-600 text-lg">
              Handpicked pieces that define luxury and elegance
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8 mb-8">
            {featuredProducts.map((product) => (
              <Link
                onClick={handleClick(product._id, "product")}
                // to={`/view/product/${product._id}`}
                key={product.id}
                className="group"
                aria-label={`View ${product.ProductName} details`}
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden w-72">
                  <div className="relative">
                    <img
                      src={product.imageUrl}
                      alt={product.ProductName}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
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

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-gray-900">
                          ₹{product.OfferPrice}
                        </span>
                        {product.NormalPrice && (
                          <span className="text-lg text-gray-500 line-through">
                            ₹{product.NormalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={handleClick("", "btnClick")}
              className="bg-black hover:bg-gray-800 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
              aria-label="View all products"
            >
              View All Products
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-yellow-400 to-yellow-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            Stay in the Loop
          </h2>
          <p className="text-black text-lg mb-8">
            Get exclusive access to new collections, special offers, and jewelry
            care tips
          </p>

          <div className="flex flex-col md:flex-row max-w-md mx-auto gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-full text-gray-900 outline-none focus:ring-4 focus:ring-yellow-300"
              aria-label="Email for newsletter subscription"
            />
            <button
              className="bg-black hover:bg-gray-800 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
              aria-label="Subscribe to newsletter"
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in 1s ease-out 0.3s both;
        }

        .animate-fade-in-delay-2 {
          animation: fade-in 1s ease-out 0.6s both;
        }
      `}</style>
    </div>
  );
};

export default JewelryEcommerce;
