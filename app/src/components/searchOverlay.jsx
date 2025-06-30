import React, { Component } from "react";
import { Search, X, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

export default class SearchOverlay extends Component {
  // Get search suggestions based on query
  getSearchSuggestions = (query) => {
    const suggestions = {
      'ri': ['Golden Ring', 'Silver Ring', 'Diamond Ring', 'Platinum Ring', 'Wedding Ring'],
      'ne': ['Golden Necklace', 'Silver Necklace', 'Diamond Necklace', 'Pearl Necklace', 'Chain Necklace'],
      'ea': ['Golden Earrings', 'Silver Earrings', 'Diamond Earrings', 'Pearl Earrings', 'Stud Earrings'],
      'br': ['Golden Bracelet', 'Silver Bracelet', 'Diamond Bracelet', 'Tennis Bracelet', 'Chain Bracelet'],
      'pe': ['Golden Pendant', 'Silver Pendant', 'Diamond Pendant', 'Heart Pendant', 'Cross Pendant'],
      'go': ['Golden Ring', 'Golden Necklace', 'Golden Earrings', 'Golden Bracelet', 'Golden Chain'],
      'si': ['Silver Ring', 'Silver Necklace', 'Silver Earrings', 'Silver Bracelet', 'Silver Chain'],
      'di': ['Diamond Ring', 'Diamond Necklace', 'Diamond Earrings', 'Diamond Bracelet', 'Diamond Pendant']
    };

    const lowerQuery = query.toLowerCase();
    for (const [key, values] of Object.entries(suggestions)) {
      if (lowerQuery.startsWith(key)) {
        return values;
      }
    }
    return [];
  };

  // Get category-based high-rated products
  getCategoryProducts = (query) => {
    const lowerQuery = query.toLowerCase();
    
    // Mock high-rated products by category
    const categoryProducts = {
      rings: [
        { id: 1, name: "Diamond Solitaire Ring", price: 1299, rating: 4.9, image: "/api/placeholder/200/200", category: "Rings" },
        { id: 2, name: "Gold Wedding Band", price: 899, rating: 4.8, image: "/api/placeholder/200/200", category: "Rings" },
        { id: 3, name: "Emerald Gold Ring", price: 1599, rating: 4.7, image: "/api/placeholder/200/200", category: "Rings" }
      ],
      necklaces: [
        { id: 4, name: "Pearl Statement Necklace", price: 799, rating: 4.9, image: "/api/placeholder/200/200", category: "Necklaces" },
        { id: 5, name: "Diamond Tennis Necklace", price: 2299, rating: 4.8, image: "/api/placeholder/200/200", category: "Necklaces" },
        { id: 6, name: "Gold Chain Necklace", price: 699, rating: 4.7, image: "/api/placeholder/200/200", category: "Necklaces" }
      ],
      earrings: [
        { id: 7, name: "Diamond Stud Earrings", price: 999, rating: 4.9, image: "/api/placeholder/200/200", category: "Earrings" },
        { id: 8, name: "Pearl Drop Earrings", price: 499, rating: 4.8, image: "/api/placeholder/200/200", category: "Earrings" },
        { id: 9, name: "Gold Hoop Earrings", price: 399, rating: 4.7, image: "/api/placeholder/200/200", category: "Earrings" }
      ]
    };

    if (lowerQuery.includes('ri') || lowerQuery.includes('ring')) {
      return categoryProducts.rings;
    } else if (lowerQuery.includes('ne') || lowerQuery.includes('necklace')) {
      return categoryProducts.necklaces;
    } else if (lowerQuery.includes('ea') || lowerQuery.includes('earring')) {
      return categoryProducts.earrings;
    }
    
    return [];
  };

  handleSuggestionClick = (suggestion) => {
    // Close search overlay first
    this.props.closeSearch();
    // You can customize these routes based on your routing structure
    // This is just an example - adjust the paths according to your app
    window.location.href = `/category/${suggestion.toLowerCase().replace(' ', '-')}`;
  };

  render() {
    const { 
      isSearchOpen, 
      searchQuery, 
      searchResults, 
      handleSearchChange, 
      closeSearch 
    } = this.props;

    if (!isSearchOpen) return null;

    const suggestions = this.getSearchSuggestions(searchQuery);
    const categoryProducts = this.getCategoryProducts(searchQuery);

    return (
      <div className="fixed inset-0 z-50 animate-fadeIn">
        {/* Animated Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black animate-bgFadeIn">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="h-full w-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 animate-pulse"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 32 32%22 width=%2232%22 height=%2232%22 fill=%22none%22 stroke=%22rgb(255 255 255 / 0.1)%22%3e%3cpath d=%22m0 .5 32 32M32 .5 0 32%22/%3e%3c/svg%3e')] bg-[length:32px_32px]"></div>
          </div>
          
          {/* Floating particles effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full opacity-30 animate-float"></div>
            <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-yellow-500 rounded-full opacity-40 animate-float-delayed"></div>
            <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-yellow-300 rounded-full opacity-20 animate-float-slow"></div>
            <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-yellow-600 rounded-full opacity-35 animate-float-delayed"></div>
          </div>
        </div>

        {/* Search Container */}
        <div className="relative h-full flex flex-col animate-slideUp">
          {/* Header */}
          <div className="flex items-center justify-between p-4 md:p-6 animate-slideDown">
            <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              RAYA JEWELS
            </h2>
            <button
              onClick={closeSearch}
              className="p-2 rounded-full hover:bg-white/10 transition-all duration-300 text-white hover:text-yellow-400"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="px-4 md:px-6 mb-6 animate-scaleIn">
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <Search className="h-6 w-6 text-gray-400 animate-pulse" />
                </div>
                <input
                  type="text"
                  placeholder="Search for rings, necklaces, earrings..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-16 pr-6 py-4 md:py-6 bg-transparent backdrop-blur-sm rounded-2xl shadow-2xl border-b border-gray-400/50 focus:border-b-yellow-400 focus:outline-none focus:ring-0 text-yellow-300 text-[20px] focus:text-[25px] focus:font-bold transition-all duration-500 placeholder-gray-500"
                  autoFocus
                />
              </div>
            </div>
          </div>

          {/* Search Content */}
          <div className="flex-1 px-4 md:px-6 overflow-y-auto animate-fadeInUp">
            <div className="max-w-4xl mx-auto">
              
              {/* Empty State */}
              {searchQuery.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-yellow-400/30 animate-bounce">
                    <Search className="h-12 w-12 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Start typing to search
                  </h3>
                  <p className="text-gray-300">
                    Find rings, necklaces, earrings, and more...
                  </p>
                </div>
              )}

              {/* Search Suggestions */}
              {searchQuery.length > 0 && suggestions.length > 0 && (
                <div className="mb-8 animate-fadeIn">
                  <div className="space-y-2">
                    {suggestions.map((suggestion, index) => (
                      <Link
                        key={index}
                        to={`/all/product`}
                        onClick={closeSearch}
                        className="block w-full text-left px-4 py-3 text-white hover:bg-white/10 hover:text-yellow-400 transition-all duration-300 text-[30px] font-medium animate-fadeInUp border-b border-gray-600/30 hover:border-yellow-400/50"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {suggestion}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* High-Rated Category Products */}
              {searchQuery.length > 0 && categoryProducts.length > 0 && (
                <div className="mb-8 animate-fadeInUp">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-yellow-400" />
                    Top Rated in Category
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {categoryProducts.map((item, index) => (
                      <Link
                        key={item.id}
                        to={`/product/${item.id}`}
                        onClick={closeSearch}
                        className="group bg-white/10 backdrop-blur-sm rounded-xl p-4 shadow-2xl hover:shadow-yellow-400/20 transition-all duration-300 border border-white/20 hover:border-yellow-400/50 hover:bg-white/20 animate-fadeInUp"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-lg overflow-hidden flex-shrink-0 border border-white/30 relative">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute top-1 right-1 bg-yellow-400 text-black text-xs px-1.5 py-0.5 rounded-full font-semibold">
                              ★{item.rating}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-white truncate group-hover:text-yellow-400 transition-colors">
                              {item.name}
                            </h4>
                            <p className="text-sm text-gray-300 mb-1">{item.category}</p>
                            <p className="text-lg font-bold text-yellow-400">${item.price}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Regular Search Results */}
              {searchQuery.length > 0 && searchResults.length > 0 && (
                <div className="animate-fadeInUp">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                      <Search className="h-5 w-5 mr-2 text-yellow-400" />
                      Search Results
                    </h3>
                    <p className="text-gray-300">
                      Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "<span className="text-yellow-400">{searchQuery}</span>"
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-8">
                    {searchResults.map((item, index) => (
                      <Link
                        key={item.id}
                        to={`/product/${item.id}`}
                        onClick={closeSearch}
                        className="group bg-white/10 backdrop-blur-sm rounded-xl p-4 shadow-2xl hover:shadow-yellow-400/20 transition-all duration-300 border border-white/20 hover:border-yellow-400/50 hover:bg-white/20 animate-fadeInUp"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-lg overflow-hidden flex-shrink-0 border border-white/30">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-white truncate group-hover:text-yellow-400 transition-colors">
                              {item.name}
                            </h4>
                            <p className="text-sm text-gray-300 mb-1">{item.category}</p>
                            <p className="text-lg font-bold text-yellow-400">${item.price}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results State */}
              {searchQuery.length > 0 && searchResults.length === 0 && suggestions.length === 0 && categoryProducts.length === 0 && (
                <div className="text-center py-12 animate-fadeIn">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-600/20 to-gray-700/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-gray-500/30">
                    <Search className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No results found
                  </h3>
                  <p className="text-gray-300">
                    Try different keywords or browse our collections
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}