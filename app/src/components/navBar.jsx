import React, { Component } from "react";
import { Search, User, Heart, ShoppingBag, X, Menu, LogOut, UserX, Fingerprint } from "lucide-react";
import { Link } from "react-router-dom";
import ProfileIcon from "../assets/images/profile.png";
import Cart from "./cart";

// Add custom CSS animations
const customStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes bgFadeIn {
    from { 
      opacity: 0;
      background: rgb(255, 255, 255);
    }
    to { 
      opacity: 1;
      background: linear-gradient(to bottom right, rgb(17, 24, 39), rgb(31, 41, 55), rgb(0, 0, 0));
    }
  }
  
  @keyframes slideUp {
    from { 
      transform: translateY(30px);
      opacity: 0;
    }
    to { 
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  @keyframes slideDown {
    from { 
      transform: translateY(-20px);
      opacity: 0;
    }
    to { 
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  @keyframes scaleIn {
    from { 
      transform: scale(0.95);
      opacity: 0;
    }
    to { 
      transform: scale(1);
      opacity: 1;
    }
  }
  
  @keyframes fadeInUp {
    from { 
      transform: translateY(20px);
      opacity: 0;
    }
    to { 
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(180deg); }
  }
  
  @keyframes float-delayed {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-15px) rotate(-180deg); }
  }
  
  @keyframes float-slow {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-8px) rotate(90deg); }
  }
  
  .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
  .animate-bgFadeIn { animation: bgFadeIn 0.8s ease-out; }
  .animate-slideUp { animation: slideUp 0.7s ease-out; }
  .animate-slideDown { animation: slideDown 0.5s ease-out; }
  .animate-scaleIn { animation: scaleIn 0.6s ease-out 0.2s both; }
  .animate-fadeInUp { animation: fadeInUp 0.8s ease-out 0.3s both; }
  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite 2s; }
  .animate-float-slow { animation: float-slow 10s ease-in-out infinite 1s; }
`;

export default class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMenuOpen: false,
      isSearchOpen: false,
      isCartOpen: false,
      isProfileOpen: false,
      searchQuery: "",
      cartItems: [
        { 
          id: 1, 
          name: "Diamond Ring", 
          price: 299, 
          quantity: 1, 
          image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
        },
        { 
          id: 2, 
          name: "Gold Necklace", 
          price: 499, 
          quantity: 1, 
          image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
        }
      ],
      searchResults: [],
      userProfile: null, // Remove localStorage usage
      isLoggedIn: true // Set to true for demo
    };
  }

  toggleMenu = () => {
    this.setState(prevState => ({ isMenuOpen: !prevState.isMenuOpen }));
  };

  toggleSearch = () => {
    this.setState(prevState => ({
      isSearchOpen: !prevState.isSearchOpen,
      isCartOpen: false,
      isProfileOpen: false
    }));
  };

  closeSearch = () => {
    this.setState({
      isSearchOpen: false,
      searchQuery: "",
      searchResults: []
    });
  };

  toggleCart = () => {
    this.setState(prevState => ({
      isCartOpen: !prevState.isCartOpen,
      isSearchOpen: false,
      isProfileOpen: false
    }));
  };

  toggleProfile = () => {
    this.setState(prevState => ({
      isProfileOpen: !prevState.isProfileOpen,
      isSearchOpen: false,
      isCartOpen: false
    }));
  };

  handleIncreaseQuantity = (itemId) => {
    this.setState(prevState => ({
      cartItems: prevState.cartItems.map(item =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    }));
  };

  handleDecreaseQuantity = (itemId) => {
    this.setState(prevState => ({
      cartItems: prevState.cartItems.map(item =>
        item.id === itemId ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
      )
    }));
  };

  handleRemoveItem = (itemId) => {
    this.setState(prevState => ({
      cartItems: prevState.cartItems.filter(item => item.id !== itemId)
    }));
  };

  handleLogout = () => {
    const logoutMsg = confirm("Are you sure you want to logout?");
    if (logoutMsg === true) {
      this.setState({
        isProfileOpen: false,
        userProfile: null,
        isLoggedIn: false
      });
    }
  };

  handleSearchChange = (e) => {
    const query = e.target.value;
    this.setState({ searchQuery: query });

    if (query.length > 2) {
      const mockResults = [
        { id: 1, name: "Diamond Ring", price: 299, category: "Rings", image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=100&h=100&fit=crop" },
        { id: 2, name: "Gold Necklace", price: 499, category: "Necklaces", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=100&h=100&fit=crop" },
        { id: 3, name: "Silver Earrings", price: 199, category: "Earrings", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=100&h=100&fit=crop" },
        { id: 4, name: "Pearl Bracelet", price: 299, category: "Bracelets", image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=100&h=100&fit=crop" },
        { id: 5, name: "Ruby Ring", price: 799, category: "Rings", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=100&h=100&fit=crop" },
        { id: 6, name: "Emerald Pendant", price: 649, category: "Necklaces", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=100&h=100&fit=crop" }
      ].filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );
      this.setState({ searchResults: mockResults });
    } else {
      this.setState({ searchResults: [] });
    }
  };

  // Full-Screen Search Component
  renderFullScreenSearch = () => {
    const { isSearchOpen, searchQuery, searchResults } = this.state;

    if (!isSearchOpen) return null;

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
              onClick={this.closeSearch}
              className="p-2 rounded-full hover:bg-white/10 transition-all duration-300 text-white hover:text-yellow-400"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="px-4 md:px-6 mb-8 animate-scaleIn">
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <Search className="h-6 w-6 text-gray-400 animate-pulse" />
                </div>
                <input
                  type="text"
                  placeholder="Search for rings, necklaces, earrings..."
                  value={searchQuery}
                  onChange={this.handleSearchChange}
                  className="w-full pl-16 pr-6 py-4 md:py-6 text-lg text-yellow-300 md:text-xl bg-transparent/95 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-yellow/20 focus:border-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-400/30 focus:bg-transparent transition-all duration-500 placeholder-gray-500"
                  autoFocus
                />
              </div>
            </div>
          </div>

          {/* Search Results */}
          <div className="flex-1 px-4 md:px-6 overflow-y-auto animate-fadeInUp">
            <div className="max-w-4xl mx-auto">
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

              {searchQuery.length > 0 && searchResults.length === 0 && (
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

              {searchResults.length > 0 && (
                <div className="animate-fadeInUp">
                  <div className="mb-6">
                    <p className="text-gray-300">
                      Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "<span className="text-yellow-400">{searchQuery}</span>"
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-8">
                    {searchResults.map((item, index) => (
                      <Link
                        key={item.id}
                        to={`/product/${item.id}`}
                        onClick={this.closeSearch}
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
            </div>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const {
      isMenuOpen,
      isSearchOpen,
      isCartOpen,
      isProfileOpen,
      searchQuery,
      cartItems,
      userProfile,
      isLoggedIn
    } = this.state;

    return (
      <div>
        {/* Inject custom CSS animations */}
        <style dangerouslySetInnerHTML={{ __html: customStyles }} />
        
        <header className="bg-white shadow-lg sticky top-0 z-40">
          {/* Top bar */}
          <div className="bg-black text-white text-center py-2 text-sm">
            Free shipping on orders over $500 | 30-day returns
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link to='/'>
                <div className="flex-shrink-0">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                    RAYA JEWELS
                  </h1>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-8">
                <Link to="/collections" className="text-gray-700 hover:text-yellow-600 font-medium transition-colors">
                  Collections
                </Link>
                <Link to="/rings" className="text-gray-700 hover:text-yellow-600 font-medium transition-colors">
                  Rings
                </Link>
                <Link to="/necklaces" className="text-gray-700 hover:text-yellow-600 font-medium transition-colors">
                  Necklaces
                </Link>
                <Link to="/earrings" className="text-gray-700 hover:text-yellow-600 font-medium transition-colors">
                  Earrings
                </Link>
                <Link to="/about" className="text-gray-700 hover:text-yellow-600 font-medium transition-colors">
                  About
                </Link>
              </nav>

              {/* Icons */}
              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="relative">
                  <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2">
                    <Search className="h-4 w-4 text-gray-500 mr-2" />
                    <input
                      placeholder="Search jewelry..."
                      className="bg-transparent outline-none text-sm w-40 cursor-pointer"
                      value=""
                      onClick={this.toggleSearch}
                      readOnly
                    />
                  </div>

                  {/* Mobile Search Button */}
                  <button 
                    className="md:hidden p-2"
                    onClick={this.toggleSearch}
                  >
                    <Search className="h-5 w-5 text-gray-700 hover:text-yellow-600 transition-colors" />
                  </button>
                </div>

                {/* Profile */}
                <button className="flex justify-center gap-2" onClick={this.toggleProfile}>
                  {userProfile ? (
                    <User className="h-5 w-5 text-gray-700 hover:text-yellow-600 cursor-pointer transition-colors" />
                  ) : (
                    <Fingerprint className="mt-[2px] h-5 w-5 text-gray-700 hover:text-yellow-600 cursor-pointer transition-colors" />
                  )}
                  <p className="hidden sm:block hover:text-yellow-600">{userProfile ? userProfile.name : "Sign In"}</p>
                </button>

                {/* Cart */}
                {isLoggedIn && (
                  <div className="relative">
                    <button onClick={this.toggleCart}>
                      <ShoppingBag className="h-6 w-6 text-gray-700 hover:text-yellow-600 cursor-pointer transition-colors ml-3" />
                      <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItems.reduce((total, item) => total + item.quantity, 0)}
                      </span>
                    </button>
                  </div>
                )}

                {/* Mobile menu button */}
                <button className="md:hidden" onClick={this.toggleMenu}>
                  {isMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t">
              <div className="px-4 py-2 space-y-2">
                <Link to="/collections" className="block py-2 text-gray-700" onClick={this.toggleMenu}>Collections</Link>
                <Link to="/rings" className="block py-2 text-gray-700" onClick={this.toggleMenu}>Rings</Link>
                <Link to="/necklaces" className="block py-2 text-gray-700" onClick={this.toggleMenu}>Necklaces</Link>
                <Link to="/earrings" className="block py-2 text-gray-700" onClick={this.toggleMenu}>Earrings</Link>
                <Link to="/about" className="block py-2 text-gray-700" onClick={this.toggleMenu}>About</Link>
              </div>
            </div>
          )}
        </header>

        {/* Full-Screen Search Overlay */}
        {this.renderFullScreenSearch()}

        {/* Shopping Cart */}
        {isLoggedIn && (
          <Cart 
            isCartOpen={isCartOpen} 
            toggleCart={this.toggleCart} 
            cartItems={cartItems}
            onIncreaseQuantity={this.handleIncreaseQuantity}
            onDecreaseQuantity={this.handleDecreaseQuantity}
            onRemoveItem={this.handleRemoveItem}
          />
        )}

        {/* Profile/Login Panel */}
        {isProfileOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                onClick={this.toggleProfile}
              ></div>
              <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
                <div className="w-screen max-w-md">
                  <div className="h-full flex flex-col bg-white shadow-xl">
                    <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <h2 className="text-lg font-medium text-gray-900">
                          {userProfile ? "My Profile" : "Welcome"}
                        </h2>
                        <button
                          type="button"
                          className="-mr-2 p-2 text-gray-400 hover:text-gray-500"
                          onClick={this.toggleProfile}
                        >
                          <X className="h-6 w-6" />
                        </button>
                      </div>

                      {userProfile ? (
                        <div className="mt-8 flex flex-col items-center">
                          <div className="mb-4">
                            <img
                              className="h-24 w-24 rounded-full object-cover"
                              src={userProfile.imageUrl || ProfileIcon}
                              alt="Profile"
                            />
                          </div>
                          <h1 className="text-xl font-bold text-gray-900 mb-2">
                            {userProfile.name}
                          </h1>
                          <p className="mt-1 text-sm text-gray-900">{userProfile.email}</p>
                          <p className="mt-1 text-sm text-gray-900">{userProfile.phone}</p>
                          <p className="mt-1 text-sm text-gray-900">{userProfile.joinDate}</p>
                          <div className="mt-8 w-full">
                            <button
                              onClick={this.handleLogout}
                              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                            >
                              <LogOut className="h-4 w-4 mr-2" />
                              Sign out
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-8 flex flex-col items-center">
                          <div className="mb-6">
                            <div className="h-32 w-32 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                              <UserX className="h-16 w-16 text-gray-400" />
                            </div>
                          </div>
                          <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                              Welcome!
                            </h1>
                            <p className="text-lg text-gray-600 mb-1">
                              Please sign in to your account
                            </p>
                          </div>
                          <div className="w-full">
                            <Link to='/auth'
                              className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-yellow-600 hover:bg-yellow-700 transition-colors"
                            >
                              <User className="h-5 w-5 mr-2" />
                              Sign In
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}