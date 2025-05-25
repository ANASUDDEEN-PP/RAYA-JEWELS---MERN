import React, { Component } from "react";
import { Search, User, Heart, ShoppingBag, X, Menu, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

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
        { id: 1, name: "Diamond Ring", price: 299, quantity: 1 },
        { id: 2, name: "Gold Necklace", price: 499, quantity: 1 },
        { id: 3, name: "Silver Necklace", price: 699, quantity: 2 }
      ],
      searchResults: [],
      userProfile: {
        name: "Alex Johnson",
        email: "alex.johnson@example.com",
        joinDate: "Joined March 2023",
        phone: "+1 (555) 123-4567",
        // Mock profile image - in a real app, this would come from your backend
        imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      }
    };
  }

  toggleMenu = () => {
    this.setState(prevState => ({ isMenuOpen: !prevState.isMenuOpen }));
  };

  toggleSearch = () => {
    this.setState(prevState => ({ 
      isSearchOpen: !prevState.isSearchOpen,
      isCartOpen: false, // Close cart if open
      isProfileOpen: false // Close profile if open
    }));
  };

  toggleCart = () => {
    this.setState(prevState => ({ 
      isCartOpen: !prevState.isCartOpen,
      isSearchOpen: false, // Close search if open
      isProfileOpen: false // Close profile if open
    }));
  };

  toggleProfile = () => {
    this.setState(prevState => ({ 
      isProfileOpen: !prevState.isProfileOpen,
      isSearchOpen: false, // Close search if open
      isCartOpen: false // Close cart if open
    }));
  };

  handleLogout = () => {
    // In a real app, this would handle the logout process
    console.log("User logged out");
    this.setState({ isProfileOpen: false });
    // You would typically redirect to login page here
  };

  handleSearchChange = (e) => {
    const query = e.target.value;
    this.setState({ searchQuery: query });
    
    // Simulate search results
    if (query.length > 2) {
      const mockResults = [
        { id: 1, name: "Diamond Ring", price: 299 },
        { id: 2, name: "Gold Necklace", price: 499 },
        { id: 3, name: "Silver Earrings", price: 199 }
      ].filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      this.setState({ searchResults: mockResults });
    } else {
      this.setState({ searchResults: [] });
    }
  };

  render() {
    const { 
      isMenuOpen, 
      isSearchOpen, 
      isCartOpen, 
      isProfileOpen,
      searchQuery, 
      searchResults, 
      cartItems,
      userProfile 
    } = this.state;

    return (
      <div>
        <header className="bg-white shadow-lg sticky top-0 z-50">
          {/* Top bar */}
          <div className="bg-black text-white text-center py-2 text-sm">
            Free shipping on orders over $500 | 30-day returns
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Link to="/">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  RAYA JEWELS
                </h1>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-8">
                <a
                  href="#"
                  className="text-gray-700 hover:text-yellow-600 font-medium transition-colors"
                >
                  Collections
                </a>
                <a
                  href="#"
                  className="text-gray-700 hover:text-yellow-600 font-medium transition-colors"
                >
                  Rings
                </a>
                <a
                  href="#"
                  className="text-gray-700 hover:text-yellow-600 font-medium transition-colors"
                >
                  Necklaces
                </a>
                <a
                  href="#"
                  className="text-gray-700 hover:text-yellow-600 font-medium transition-colors"
                >
                  Earrings
                </a>
                <a
                  href="#"
                  className="text-gray-700 hover:text-yellow-600 font-medium transition-colors"
                >
                  About
                </a>
              </nav>

              {/* Search and Icons */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2">
                    <Search className="h-4 w-4 text-gray-500 mr-2" />
                    <input
                      placeholder="Search jewelry..."
                      className="bg-transparent outline-none text-sm w-40"
                      value={searchQuery}
                      onChange={this.handleSearchChange}    
                      onFocus={this.toggleSearch}
                    />
                  </div>
                  
                  {/* Search dropdown */}
                  {isSearchOpen && searchResults.length > 0 && (
                    <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
                      {searchResults.map(item => (
                        <div key={item.id} className="p-3 border-b hover:bg-gray-50 cursor-pointer">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-yellow-600">${item.price}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <button onClick={this.toggleProfile}>
                  <User className="h-6 w-6 text-gray-700 hover:text-yellow-600 cursor-pointer transition-colors" />
                </button>
                
                {/* <Heart className="h-6 w-6 text-gray-700 hover:text-yellow-600 cursor-pointer transition-colors" /> */}
                
                <div className="relative">
                  <button onClick={this.toggleCart}>
                    <ShoppingBag className="h-6 w-6 text-gray-700 hover:text-yellow-600 cursor-pointer transition-colors" />
                    <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItems.reduce((total, item) => total + item.quantity, 0)}
                    </span>
                  </button>
                </div>

                {/* Mobile menu button */}
                <button
                  className="md:hidden"
                  onClick={this.toggleMenu}
                >
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
                <a href="#" className="block py-2 text-gray-700">
                  Collections
                </a>
                <a href="#" className="block py-2 text-gray-700">
                  Rings
                </a>
                <a href="#" className="block py-2 text-gray-700">
                  Necklaces
                </a>
                <a href="#" className="block py-2 text-gray-700">
                  Earrings
                </a>
                <a href="#" className="block py-2 text-gray-700">
                  About
                </a>
              </div>
            </div>
          )}
        </header>

        {/* Shopping Cart Sidebar */}
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div 
                className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
                onClick={this.toggleCart}
              ></div>
              <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
                <div className="w-screen max-w-md">
                  <div className="h-full flex flex-col bg-white shadow-xl">
                    <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <h2 className="text-lg font-medium text-gray-900">Shopping cart</h2>
                        <button
                          type="button"
                          className="-mr-2 p-2 text-gray-400 hover:text-gray-500"
                          onClick={this.toggleCart}
                        >
                          <X className="h-6 w-6" />
                        </button>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          <ul className="-my-6 divide-y divide-gray-200">
                            {cartItems.map((item) => (
                              <li key={item.id} className="py-6 flex">
                                <div className="ml-4 flex-1 flex flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <h3>{item.name}</h3>
                                      <p className="ml-4">${item.price}</p>
                                    </div>
                                  </div>
                                  <div className="flex-1 flex items-end justify-between text-sm">
                                    <p className="text-gray-500">Qty {item.quantity}</p>
                                    <button
                                      type="button"
                                      className="font-medium text-yellow-600 hover:text-yellow-500"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>${cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)}</p>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">
                        Shipping and taxes calculated at checkout.
                      </p>
                      <div className="mt-6">
                        <a
                          href="/checkout"
                          className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-yellow-600 hover:bg-yellow-700"
                        >
                          Checkout
                        </a>
                      </div>
                      <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                        <p>
                          or{' '}
                          <button
                            type="button"
                            className="text-yellow-600 font-medium hover:text-yellow-500"
                            onClick={this.toggleCart}
                          >
                            Continue Shopping<span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Sidebar */}
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
                        <h2 className="text-lg font-medium text-gray-900">My Profile</h2>
                        <button
                          type="button"
                          className="-mr-2 p-2 text-gray-400 hover:text-gray-500"
                          onClick={this.toggleProfile}
                        >
                          <X className="h-6 w-6" />
                        </button>
                      </div>

                      <div className="mt-8 flex flex-col items-center">
                        {/* Profile Image */}
                        <div className="mb-4">
                          <img
                            className="h-24 w-24 rounded-full object-cover"
                            src={userProfile.imageUrl}
                            alt="Profile"
                          />
                        </div>

                        {/* User Name */}
                        <h1 className="text-xl font-bold text-gray-900 mb-2">
                          {userProfile.name}
                        </h1>

                        {/* User Details */}
                        <div className="w-full mt-6 space-y-4">
                          <div className="border-b pb-4">
                            <h3 className="text-sm font-medium text-gray-500">Email</h3>
                            <p className="mt-1 text-sm text-gray-900">{userProfile.email}</p>
                          </div>
                          
                          <div className="border-b pb-4">
                            <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                            <p className="mt-1 text-sm text-gray-900">{userProfile.phone}</p>
                          </div>
                          
                          <div className="border-b pb-4">
                            <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
                            <p className="mt-1 text-sm text-gray-900">{userProfile.joinDate}</p>
                          </div>
                        </div>

                        {/* Logout Button */}
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