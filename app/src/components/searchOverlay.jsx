import React, { Component } from "react";
import { Search, X, TrendingUp, Filter, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import baseUrl from "../url";

export default class SearchOverlay extends Component {
  state = {
    allProducts: [],
    isLoading: false,
    error: null,
    priceRange: [0, 100000],
    activeFilter: null,
    searchHistory: []
  };

  componentDidMount() {
    this.fetchAllProducts();
    this.loadSearchHistory();
  }

  componentDidUpdate(prevProps) {
    // Only add to history when search query changes and is valid
    if (this.props.searchQuery !== prevProps.searchQuery && 
        this.props.searchQuery.trim().length > 2) {
      this.addToSearchHistory(this.props.searchQuery);
    }
  }

  loadSearchHistory = () => {
    const savedHistory = localStorage.getItem("searchHistory");
    if (savedHistory) {
      this.setState({ searchHistory: JSON.parse(savedHistory) });
    }
  };

  fetchAllProducts = async () => {
    this.setState({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${baseUrl}/get/search/elements`);
      // console.log(response)
      const products = response.data;
      
      const maxPrice = Math.max(
        ...products.map(p => 
          Math.max(
            parseInt(p.OfferPrice || 0),
            parseInt(p.ActualPrice || 0),
            parseInt(p.NormalPrice || 0)
          )
        )
      );

      this.setState({ 
        allProducts: products,
        priceRange: [0, maxPrice]
      });
    } catch (err) {
      this.setState({ error: err.message });
      console.error("Error fetching products:", err);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  addToSearchHistory = (query) => {
    if (!query.trim()) return;
    
    this.setState(prevState => {
      const updatedHistory = [
        query,
        ...prevState.searchHistory.filter(item => 
          item.toLowerCase() !== query.toLowerCase()
        )
      ].slice(0, 5);
      
      localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
      return { searchHistory: updatedHistory };
    });
  };

  getSearchSuggestions = (query) => {
    const { allProducts, searchHistory } = this.state;
    const lowerQuery = query.toLowerCase();

    const staticSuggestions = {
      'ri': ['Golden Ring', 'Silver Ring', 'Diamond Ring', 'Platinum Ring', 'Wedding Ring'],
      'ne': ['Golden Necklace', 'Silver Necklace', 'Diamond Necklace', 'Pearl Necklace', 'Chain Necklace'],
      'ea': ['Golden Earrings', 'Silver Earrings', 'Diamond Earrings', 'Pearl Earrings', 'Stud Earrings'],
      'br': ['Golden Bracelet', 'Silver Bracelet', 'Diamond Bracelet', 'Tennis Bracelet', 'Chain Bracelet'],
      'pe': ['Golden Pendant', 'Silver Pendant', 'Diamond Pendant', 'Heart Pendant', 'Cross Pendant'],
      'go': ['Golden Ring', 'Golden Necklace', 'Golden Earrings', 'Golden Bracelet', 'Golden Chain'],
      'si': ['Silver Ring', 'Silver Necklace', 'Silver Earrings', 'Silver Bracelet', 'Silver Chain'],
      'di': ['Diamond Ring', 'Diamond Necklace', 'Diamond Earrings', 'Diamond Bracelet', 'Diamond Pendant'],
      'hp': ['HP Laptop', 'HP Printer', 'HP Accessories'],
      'la': ['Laptops', 'Laptop Bags', 'Laptop Accessories'],
      'un': ['Under 10000', 'Under 20000', 'Under 50000'],
      'ra': ['Range 10000-20000', 'Range 20000-50000', 'Range 50000-100000']
    };

    const productSuggestions = allProducts
      .filter(product => 
        product.ProductName.toLowerCase().includes(lowerQuery) ||
        product.CollectionName.toLowerCase().includes(lowerQuery)
      )
      .map(product => product.ProductName)
      .slice(0, 5);

    const historySuggestions = searchHistory
      .filter(item => item.toLowerCase().includes(lowerQuery))
      .slice(0, 3);

    for (const [key, values] of Object.entries(staticSuggestions)) {
      if (lowerQuery.startsWith(key)) {
        return [...values, ...productSuggestions].slice(0, 8);
      }
    }

    return [...new Set([
      ...historySuggestions,
      ...productSuggestions,
      ...(lowerQuery.length > 2 ? [] : staticSuggestions['un'] || [])
    ])].slice(0, 8);
  };

  filterProducts = () => {
    const { searchQuery } = this.props;
    const { allProducts, priceRange } = this.state;
    
    if (!searchQuery) return [];

    const lowerQuery = searchQuery.toLowerCase();

    let [minPrice, maxPrice] = priceRange;
    const priceRangeMatch = lowerQuery.match(/(\d+)\s*(to|-|and)\s*(\d+)|under\s*(\d+)|over\s*(\d+)/);
    
    if (priceRangeMatch) {
      if (priceRangeMatch[1] && priceRangeMatch[3]) {
        minPrice = parseInt(priceRangeMatch[1]);
        maxPrice = parseInt(priceRangeMatch[3]);
      } else if (priceRangeMatch[4]) {
        maxPrice = parseInt(priceRangeMatch[4]);
        minPrice = 0;
      } else if (priceRangeMatch[5]) {
        minPrice = parseInt(priceRangeMatch[5]);
        maxPrice = Infinity;
      }
    }

    return allProducts.filter(product => {
      const productPrice = parseInt(
        product.OfferPrice || product.ActualPrice || product.NormalPrice || 0
      );
      
      if (productPrice < minPrice || productPrice > maxPrice) return false;
      
      const searchFields = [
        product.ProductName,
        product.CollectionName,
        product.Description,
        product.Material,
        product.Size
      ].join(' ').toLowerCase();
      
      return searchFields.includes(lowerQuery);
    });
  };

  getCategoryProducts = (query) => {
    const { allProducts } = this.state;
    const lowerQuery = query.toLowerCase();
    
    const categoryMap = {
      'ri': ['ring', 'wedding', 'engagement'],
      'ne': ['necklace', 'pendant', 'chain'],
      'ea': ['earring', 'stud', 'hoop'],
      'br': ['bracelet', 'bangle'],
      'pe': ['pendant', 'locket'],
      'hp': ['hp', 'laptop', 'computer'],
      'la': ['laptop', 'notebook', 'ultrabook']
    };

    const relevantCategories = [];
    for (const [key, categories] of Object.entries(categoryMap)) {
      if (lowerQuery.startsWith(key)) {
        relevantCategories.push(...categories);
        break;
      }
    }

    if (relevantCategories.length === 0) {
      for (const [_, categories] of Object.entries(categoryMap)) {
        if (categories.some(cat => lowerQuery.includes(cat))) {
          relevantCategories.push(...categories);
          break;
        }
      }
    }

    if (relevantCategories.length === 0) return [];

    return allProducts
      .filter(product => {
        const productText = [
          product.ProductName,
          product.CollectionName,
          product.Description
        ].join(' ').toLowerCase();
        
        return relevantCategories.some(cat => productText.includes(cat));
      })
      .sort((a, b) => {
        const priceA = parseInt(a.OfferPrice || a.ActualPrice || a.NormalPrice || 0);
        const priceB = parseInt(b.OfferPrice || b.ActualPrice || b.NormalPrice || 0);
        return priceB - priceA;
      })
      .slice(0, 3);
  };

  handleSuggestionClick = (suggestion) => {
    this.props.closeSearch();
    
    if (suggestion.match(/under|over|range|to/)) {
      this.props.handleSearchChange({ target: { value: suggestion } });
      return;
    }
    
    window.location.href = `/search?q=${encodeURIComponent(suggestion)}`;
  };

  render() {
    const { 
      isSearchOpen, 
      searchQuery, 
      handleSearchChange, 
      closeSearch 
    } = this.props;

    const { 
      isLoading, 
      error, 
      priceRange,
      activeFilter,
      searchHistory
    } = this.state;
    
    if (!isSearchOpen) return null;

    const suggestions = this.getSearchSuggestions(searchQuery);
    const categoryProducts = this.getCategoryProducts(searchQuery);
    const searchResults = this.filterProducts();

    return (
      <div className="fixed inset-0 z-50 animate-fadeIn">
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm">
          <div className="absolute inset-0 overflow-hidden opacity-50">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full bg-yellow-400/30"
                style={{
                  width: `${Math.random() * 6 + 2}px`,
                  height: `${Math.random() * 6 + 2}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                  animationDelay: `${Math.random() * 5}s`
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative h-full flex flex-col">
          <div className="flex items-center justify-between p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              RAYA JEWELS
            </h2>
            <button
              onClick={closeSearch}
              className="p-2 rounded-full hover:bg-white/10 transition-all duration-300 text-white hover:text-yellow-400"
              aria-label="Close search"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="px-4 md:px-6 mb-6">
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <Search className="h-6 w-6 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search for products, collections, or try 'under 50000'..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-16 pr-12 py-4 md:py-5 bg-white/5 backdrop-blur-sm rounded-xl shadow-lg border border-gray-600 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/30 text-white text-lg placeholder-gray-400 transition-all"
                  autoFocus
                />
                {searchQuery && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center space-x-1">
                    <button 
                      onClick={() => this.setState({ activeFilter: activeFilter === 'price' ? null : 'price' })}
                      className="p-2 rounded-full hover:bg-white/10 transition-all"
                      aria-label="Filter by price"
                    >
                      <Filter className="h-5 w-5 text-yellow-400" />
                    </button>
                  </div>
                )}
              </div>
              
              {activeFilter === 'price' && (
                <div className="mt-4 bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-gray-700 animate-fadeIn">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-medium flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      Price Range
                    </h4>
                    <span className="text-yellow-400 text-sm">
                      ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0]}
                      onChange={(e) => this.setState({ 
                        priceRange: [parseInt(e.target.value) || 0, priceRange[1]] 
                      })}
                      className="flex-1 px-3 py-2 bg-white/10 text-white rounded border border-gray-600 focus:border-yellow-400 focus:outline-none"
                      min="0"
                    />
                    <span className="text-gray-400">to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={(e) => this.setState({ 
                        priceRange: [priceRange[0], parseInt(e.target.value) || 0] 
                      })}
                      className="flex-1 px-3 py-2 bg-white/10 text-white rounded border border-gray-600 focus:border-yellow-400 focus:outline-none"
                      min={priceRange[0]}
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={this.state.priceRange[1] * 1.5}
                    value={priceRange[1]}
                    onChange={(e) => this.setState({ 
                      priceRange: [priceRange[0], parseInt(e.target.value)] 
                    })}
                    className="w-full mt-3 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 px-4 md:px-6 overflow-y-auto pb-8">
            <div className="max-w-4xl mx-auto">
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-12 w-12 text-yellow-400 animate-spin mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Loading Products...
                  </h3>
                  <p className="text-gray-400">Fetching the latest inventory</p>
                </div>
              )}

              {error && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-6 bg-red-900/20 rounded-full flex items-center justify-center border border-red-400/30">
                    <X className="h-12 w-12 text-red-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Error loading products
                  </h3>
                  <p className="text-red-400 mb-4">{error}</p>
                  <button
                    onClick={this.fetchAllProducts}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              )}

              {!isLoading && !error && searchQuery.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-full flex items-center justify-center border border-yellow-400/30">
                    <Search className="h-12 w-12 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    What are you looking for?
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Search for products, collections, or try price ranges
                  </p>
                  
                  {searchHistory.length > 0 && (
                    <div className="max-w-md mx-auto">
                      <h4 className="text-gray-400 text-sm font-medium mb-3">RECENT SEARCHES</h4>
                      <div className="flex flex-wrap justify-center gap-2">
                        {searchHistory.map((item, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              handleSearchChange({ target: { value: item } });
                            }}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-full border border-white/10 text-sm transition-colors"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!isLoading && !error && searchQuery.length > 0 && suggestions.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Suggestions
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => this.handleSuggestionClick(suggestion)}
                        className="text-left px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 transition-colors flex items-center"
                      >
                        <Search className="h-4 w-4 mr-3 text-gray-400" />
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!isLoading && !error && searchQuery.length > 0 && categoryProducts.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-yellow-400" />
                    Popular in this Category
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {categoryProducts.map((product, index) => (
                      <Link
                        key={product._id || index}
                        to={`/product/${product.ProductId}`}
                        onClick={closeSearch}
                        className="group bg-white/5 hover:bg-white/10 rounded-lg p-4 border border-white/10 hover:border-yellow-400/30 transition-all"
                      >
                        <div className="aspect-square w-full bg-gray-800 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
                          {product.image ? (
                            <img 
                              src={product.image} 
                              alt={product.ProductName}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <span className="text-2xl text-gray-500">
                              {product.ProductName.charAt(0)}
                            </span>
                          )}
                        </div>
                        <h4 className="font-medium text-white group-hover:text-yellow-400 truncate">
                          {product.ProductName}
                        </h4>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-yellow-400 font-medium">
                            ₹{(product.OfferPrice || product.ActualPrice || product.NormalPrice).toLocaleString()}
                          </span>
                          {product.OfferPrice && product.ActualPrice && (
                            <span className="text-xs text-gray-400 line-through">
                              ₹{product.ActualPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {!isLoading && !error && searchQuery.length > 0 && searchResults.length > 0 && (
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                      <Search className="h-5 w-5 mr-2 text-yellow-400" />
                      {searchResults.length} Result{searchResults.length !== 1 ? 's' : ''} Found
                    </h3>
                    <p className="text-gray-400">
                      Showing results for "<span className="text-yellow-400">{searchQuery}</span>"
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {searchResults.map((product, index) => (
                      <Link
                        key={product._id || index}
                        to={`/product/${product.ProductId}`}
                        onClick={closeSearch}
                        className="group bg-white/5 hover:bg-white/10 rounded-lg p-4 border border-white/10 hover:border-yellow-400/30 transition-all"
                      >
                        <div className="aspect-square w-full bg-gray-800 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
                          {product.image ? (
                            <img 
                              src={product.image} 
                              alt={product.ProductName}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <span className="text-2xl text-gray-500">
                              {product.ProductName.charAt(0)}
                            </span>
                          )}
                        </div>
                        <h4 className="font-medium text-white group-hover:text-yellow-400 truncate">
                          {product.ProductName}
                        </h4>
                        <p className="text-sm text-gray-400 mt-1 truncate">
                          {product.CollectionName}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-yellow-400 font-medium">
                            ₹{(product.OfferPrice || product.ActualPrice || product.NormalPrice).toLocaleString()}
                          </span>
                          {product.OfferPrice && product.ActualPrice && (
                            <span className="text-xs text-gray-400 line-through">
                              ₹{product.ActualPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {!isLoading && !error && searchQuery.length > 0 && 
                searchResults.length === 0 && 
                suggestions.length === 0 && 
                categoryProducts.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gray-800/50 rounded-full flex items-center justify-center border border-gray-700">
                    <Search className="h-12 w-12 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No results found
                  </h3>
                  <p className="text-gray-400 mb-4">
                    We couldn't find any matches for "<span className="text-white">{searchQuery}</span>"
                  </p>
                  <button
                    onClick={() => handleSearchChange({ target: { value: '' } })}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-colors"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}