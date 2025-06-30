import React, { Component } from "react";
import { Search, User, ShoppingBag, X, Menu, Fingerprint } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Cart from "./cart";
import SearchOverlay from "./searchOverlay";
import LoginWarning from "./Alert/pleaseLoginWarning";
import ProfilePanel from "./profilePanel";

const customStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
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
  
  @keyframes slideInFromRight {
    from { 
      transform: translateX(100%);
      opacity: 0;
    }
    to { 
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
  .animate-slideDown { animation: slideDown 0.5s ease-out; }
  .animate-slideInFromRight { animation: slideInFromRight 0.5s ease-out forwards; }
`;

export default class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMenuOpen: false,
      isSearchOpen: false,
      isCartOpen: false,
      showLoginWarning: false,
      isProfileOpen: false,
      searchQuery: "",
      cartItems: [
        {
          id: 1,
          name: "Diamond Ring",
          price: 299,
          quantity: 1,
          image:
            "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        },
        {
          id: 2,
          name: "Gold Necklace",
          price: 499,
          quantity: 1,
          image:
            "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        },
      ],
      searchResults: [],
      userProfile: JSON.parse(localStorage.getItem("userProfile")) || null,
      isLoggedIn: JSON.parse(localStorage.getItem("isLoggedIn")) || false,
    };
  }

  toggleMenu = () => {
    this.setState((prevState) => ({ isMenuOpen: !prevState.isMenuOpen }));
  };

  toggleSearch = () => {
    if (this.state.isLoggedIn) {
      this.setState((prevState) => ({
        isSearchOpen: !prevState.isSearchOpen,
        isCartOpen: false,
        isProfileOpen: false,
        showLoginWarning: false,
      }));
    } else {
      this.setState({
        showLoginWarning: true,
        isSearchOpen: false,
        isCartOpen: false,
        isProfileOpen: false,
      });
    }
  };

  closeSearch = () => {
    this.setState({
      isSearchOpen: false,
      searchQuery: "",
      searchResults: [],
    });
  };

  toggleCart = () => {
    this.setState((prevState) => ({
      isCartOpen: !prevState.isCartOpen,
      isSearchOpen: false,
      isProfileOpen: false,
    }));
  };

  toggleProfile = () => {
    this.setState((prevState) => ({
      isProfileOpen: !prevState.isProfileOpen,
      isSearchOpen: false,
      isCartOpen: false,
    }));
  };

  handleIncreaseQuantity = (itemId) => {
    this.setState((prevState) => ({
      cartItems: prevState.cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      ),
    }));
  };

  handleDecreaseQuantity = (itemId) => {
    this.setState((prevState) => ({
      cartItems: prevState.cartItems.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      ),
    }));
  };

  handleRemoveItem = (itemId) => {
    this.setState((prevState) => ({
      cartItems: prevState.cartItems.filter((item) => item.id !== itemId),
    }));
  };

  handleLogout = () => {
    const logoutMsg = confirm("Are you sure you want to logout?");
    if (logoutMsg === true) {
      localStorage.clear();
      window.location.reload();
    }
  };

  handleSearchChange = (e) => {
    const query = e.target.value;
    this.setState({ searchQuery: query });

    if (query.length > 2) {
      const mockResults = [
        // ... (same mock results as before)
      ].filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      );
      this.setState({ searchResults: mockResults });
    } else {
      this.setState({ searchResults: [] });
    }
  };

  closeLoginWarning = () => {
    this.setState({ showLoginWarning: false });
  };

  nav = () => {
    console.log("Clicked")
  }

  render() {
    const {
      isMenuOpen,
      isSearchOpen,
      isCartOpen,
      isProfileOpen,
      searchQuery,
      searchResults,
      cartItems,
      userProfile,
      isLoggedIn,
      showLoginWarning,
    } = this.state;

    return (
      <div>
        <style dangerouslySetInnerHTML={{ __html: customStyles }} />

        <header className="bg-white shadow-lg sticky top-0 z-40">
          {/* Top bar */}
          <div className="bg-black text-white text-center py-2 text-sm">
            Free shipping on orders over $500 | 30-day returns
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link to="/">
                <div className="flex-shrink-0">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                    RAYA JEWELS
                  </h1>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-8">
                <Link
                  to="/collections"
                  className="text-gray-700 hover:text-yellow-600 font-medium transition-colors"
                >
                  Collections
                </Link>
                <Link
                  to="/rings"
                  className="text-gray-700 hover:text-yellow-600 font-medium transition-colors"
                >
                  Rings
                </Link>
                <Link
                  to="/necklaces"
                  className="text-gray-700 hover:text-yellow-600 font-medium transition-colors"
                >
                  Necklaces
                </Link>
                <Link
                  to="/earrings"
                  className="text-gray-700 hover:text-yellow-600 font-medium transition-colors"
                >
                  Earrings
                </Link>
                <Link
                  to="/about"
                  className="text-gray-700 hover:text-yellow-600 font-medium transition-colors"
                >
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
                      value={searchQuery}
                      onClick={this.toggleSearch}
                      readOnly
                    />
                  </div>

                  {/* Mobile Search Button */}
                  <button className="md:hidden p-2" onClick={this.toggleSearch}>
                    <Search className="h-5 w-5 text-gray-700 hover:text-yellow-600 transition-colors" />
                  </button>
                </div>

                {/* Profile */}
                <button
                  className="flex justify-center gap-2"
                  onClick={this.toggleProfile}
                >
                  {userProfile ? (
                    <User className="h-5 w-5 text-gray-700 hover:text-yellow-600 cursor-pointer transition-colors" />
                  ) : (
                    <Fingerprint className="mt-[2px] h-5 w-5 text-gray-700 hover:text-yellow-600 cursor-pointer transition-colors" />
                  )}
                  <p className="hidden sm:block hover:text-yellow-600">
                    {userProfile ? userProfile.Name : "Sign In"}
                  </p>
                </button>

                {/* Cart */}
                {isLoggedIn && (
                  <div className="relative">
                    <button onClick={this.toggleCart}>
                      <ShoppingBag className="h-6 w-6 text-gray-700 hover:text-yellow-600 cursor-pointer transition-colors ml-3" />
                      <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItems.reduce(
                          (total, item) => total + item.quantity,
                          0
                        )}
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
            <div className="md:hidden bg-white border-t animate-slideDown">
              <div className="px-4 py-2 space-y-2">
                <Link
                  to="/collections"
                  className="block py-2 text-gray-700"
                  onClick={this.toggleMenu}
                >
                  Collections
                </Link>
                <Link
                  to="/rings"
                  className="block py-2 text-gray-700"
                  onClick={this.toggleMenu}
                >
                  Rings
                </Link>
                <Link
                  to="/necklaces"
                  className="block py-2 text-gray-700"
                  onClick={this.toggleMenu}
                >
                  Necklaces
                </Link>
                <Link
                  to="/earrings"
                  className="block py-2 text-gray-700"
                  onClick={this.toggleMenu}
                >
                  Earrings
                </Link>
                <Link
                  to="/about"
                  className="block py-2 text-gray-700"
                  onClick={this.toggleMenu}
                >
                  About
                </Link>
              </div>
            </div>
          )}
        </header>

        {/* Search Overlay */}
        {isSearchOpen && (
          <SearchOverlay
            isSearchOpen={isSearchOpen}
            searchQuery={searchQuery}
            searchResults={searchResults}
            handleSearchChange={this.handleSearchChange}
            closeSearch={this.closeSearch}
          />
        )}

        {/* Shopping Cart */}
        {isLoggedIn && isCartOpen && (
          <Cart
            isCartOpen={isCartOpen}
            toggleCart={this.toggleCart}
            cartItems={cartItems}
            onIncreaseQuantity={this.handleIncreaseQuantity}
            onDecreaseQuantity={this.handleDecreaseQuantity}
            onRemoveItem={this.handleRemoveItem}
          />
        )}

        {/* Login Warning */}
        {showLoginWarning && <LoginWarning onClose={this.closeLoginWarning} />}

        {/* Profile Panel */}
        {isProfileOpen && (
          <ProfilePanel
            userProfile={userProfile}
            onClose={this.toggleProfile}
            onLogout={this.handleLogout}
          />
        )}
      </div>
    );
  }
}
