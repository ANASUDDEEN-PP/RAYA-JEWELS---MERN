import React, { Component } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import baseUrl from "../url";

export default class SearchOverlay extends Component {
  state = {
    allProducts: [],
    isLoading: false,
    error: null,
    searchHistory: [],
    selectedSuggestion: null,
  };

  componentDidMount() {
    this.fetchAllProducts();
    this.loadSearchHistory();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.searchQuery !== prevProps.searchQuery &&
      this.props.searchQuery.trim().length > 2
    ) {
      this.addToSearchHistory(this.props.searchQuery);
      this.setState({ selectedSuggestion: null });
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
      this.setState({
        allProducts: response.data.product || [],
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

    this.setState((prevState) => {
      const updatedHistory = [
        query,
        ...prevState.searchHistory.filter(
          (item) => item.toLowerCase() !== query.toLowerCase()
        ),
      ].slice(0, 5);

      localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
      return { searchHistory: updatedHistory };
    });
  };

  getSearchSuggestions = () => {
    const { searchQuery } = this.props;
    const { allProducts } = this.state;

    if (!searchQuery || searchQuery.trim().length < 2) return [];

    const lowerQuery = searchQuery.toLowerCase();

    // Get unique product names and collection names that match the query
    const suggestions = [];
    const seen = new Set();

    allProducts.forEach((product) => {
      if (product.ProductName.toLowerCase().includes(lowerQuery)) {
        if (!seen.has(product.ProductName)) {
          seen.add(product.ProductName);
          suggestions.push(product.ProductName);
        }
      }

      if (
        product.CollectionName &&
        product.CollectionName.toLowerCase().includes(lowerQuery)
      ) {
        if (!seen.has(product.CollectionName)) {
          seen.add(product.CollectionName);
          suggestions.push(product.CollectionName);
        }
      }
    });

    return suggestions.slice(0, 8);
  };

  getFilteredProducts = () => {
    const { selectedSuggestion } = this.state;
    const { allProducts } = this.state;

    if (!selectedSuggestion) return [];

    const lowerSuggestion = selectedSuggestion.toLowerCase();

    return allProducts.filter((product) => {
      return (
        product.ProductName.toLowerCase().includes(lowerSuggestion) ||
        (product.CollectionName &&
          product.CollectionName.toLowerCase().includes(lowerSuggestion))
      );
    });
  };

  handleSuggestionClick = (suggestion) => {
    this.setState({ selectedSuggestion: suggestion });
  };

  render() {
    const { isSearchOpen, searchQuery, handleSearchChange, closeSearch } =
      this.props;

    const { isLoading, error, searchHistory, selectedSuggestion } = this.state;

    if (!isSearchOpen) return null;

    const suggestions = this.getSearchSuggestions();
    const filteredProducts = this.getFilteredProducts();
    const showSuggestions = searchQuery && !selectedSuggestion;
    const showResults = selectedSuggestion || (searchQuery && !showSuggestions);

    return (
      <div className="fixed inset-0 z-50 animate-fadeIn overflow-hidden">
        {/* Background overlay that doesn't scroll */}
        <div
          className="absolute inset-0 bg-black/90 backdrop-blur-sm"
          onClick={closeSearch}
        />

        {/* Search container with scroll (but hidden scrollbar) */}
        <div className="relative h-full flex flex-col overflow-hidden">
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
                  placeholder="Search for products or collections..."
                  value={searchQuery}
                  onChange={(e) => {
                    handleSearchChange(e);
                    this.setState({ selectedSuggestion: null });
                  }}
                  className="w-full pl-16 pr-12 py-4 md:py-5 bg-white/5 backdrop-blur-sm rounded-xl shadow-lg border border-gray-600 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/30 text-white text-lg placeholder-gray-400 transition-all"
                  autoFocus
                />
              </div>
            </div>
          </div>

          {/* Scrollable content area with hidden scrollbar */}
          <div
            className="flex-1 px-4 md:px-6 pb-8 overflow-y-auto"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div
              className="max-w-4xl mx-auto"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-12 w-12 text-yellow-400 animate-spin mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Loading Products...
                  </h3>
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

                  {searchHistory.length > 0 && (
                    <div className="max-w-md mx-auto">
                      <h4 className="text-gray-400 text-sm font-medium mb-3">
                        RECENT SEARCHES
                      </h4>
                      <div className="flex flex-wrap justify-center gap-2">
                        {searchHistory.map((item, index) => (
                          <button
                            key={index}
                            onClick={() =>
                              handleSearchChange({ target: { value: item } })
                            }
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

              {!isLoading &&
                !error &&
                showSuggestions &&
                suggestions.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Suggestions
                    </h3>
                    <div className="space-y-3">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => this.handleSuggestionClick(suggestion)}
                          className="w-full text-left py-2 text-yellow-400 hover:text-yellow-300 text-xl transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              {!isLoading && !error && showResults && (
                <div>
                  {filteredProducts.length > 0 ? (
                    <>
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {filteredProducts.length} Product
                          {filteredProducts.length !== 1 ? "s" : ""} Found
                          {selectedSuggestion && ` for "${selectedSuggestion}"`}
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredProducts.map((product, index) => (
                          <Link
                            key={product._id || index}
                            to={`/view/product/${product._id}`}
                            onClick={closeSearch}
                            className="group bg-white/5 hover:bg-white/10 rounded-lg p-4 border border-white/10 hover:border-yellow-400/30 transition-all"
                          >
                            <div className="aspect-square w-full bg-gray-800 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
                              {product.imageUrl ? (
                                <img
                                  src={product.imageUrl}
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
                            {product.CollectionName && (
                              <p className="text-sm text-gray-400 mt-1 truncate">
                                {product.CollectionName}
                              </p>
                            )}
                            <div className="flex items-center justify-between mt-3">
                              <span className="text-yellow-400 font-medium">
                                ₹
                                {(
                                  product.OfferPrice ||
                                  product.ActualPrice ||
                                  product.NormalPrice ||
                                  0
                                ).toLocaleString()}
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
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 mx-auto mb-6 bg-gray-800/50 rounded-full flex items-center justify-center border border-gray-700">
                        <Search className="h-12 w-12 text-gray-500" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        No products found
                      </h3>
                      <p className="text-gray-400 mb-4">
                        {selectedSuggestion
                          ? `No products match "${selectedSuggestion}"`
                          : `No products match "${searchQuery}"`}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
