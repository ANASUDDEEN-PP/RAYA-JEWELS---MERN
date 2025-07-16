import React, { Component } from "react";
import { Search, User, ShoppingBag, X, Menu, Fingerprint } from "lucide-react";
import { Link } from "react-router-dom";
import Cart from "./cart";
import SearchOverlay from "./searchOverlay";
import LoginWarning from "./Alert/pleaseLoginWarning";
import ProfilePanel from "./profilePanel/profilePanel";
import axios from "axios";
import baseUrl from "../url";
import { useNavigate } from "react-router-dom";

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
      isLoading: false,
      searchQuery: "",
      cartItems: [],
      searchResults: [],
      qtyLoadingId: null,
      userProfile: JSON.parse(localStorage.getItem("userProfile")) || null,
      isLoggedIn: JSON.parse(localStorage.getItem("isLoggedIn")) || false,
      showDeleteAlert: false,
      itemToDelete: null
    };
  }

  handleRedirect = () => {
    this.props.navigate('/some-page'); // ✅ Use navigate from props
  };

  componentDidMount() {
    const { userProfile } = this.state;
    if (userProfile && userProfile._id) {
      this.setState({ isLoading: true });
      axios.get(`${baseUrl}/cart/get/${userProfile._id}`)
        .then((response) => {
          this.setState({
            cartItems: response.data.cartItems || [],
            isLoading: false,
          });
        })
        .catch((err) => {
          console.error(err);
          this.setState({ isLoading: false });
        });
    }
  }


  toggleMenu = () => {
    this.setState((prevState) => ({ isMenuOpen: !prevState.isMenuOpen }));
  };

  toggleSearch = () => {
    const { isLoggedIn } = this.state;
    if (isLoggedIn) {
      this.setState({
        isSearchOpen: true,
        isCartOpen: false,
        isProfileOpen: false,
        showLoginWarning: false,
      });
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

  handleQuantity = async (itemId, status) => {
    try {
      const { userProfile } = this.state;

      this.setState({ qtyLoadingId: itemId }); // Show loading on this item

      const updatedCart = {
        UserId: userProfile._id,
        Quantity: 1,
        itemsData: itemId,
        status,
      };

      const response = await axios.post(`${baseUrl}/cart/add/item`, updatedCart);

      // Optional: fetch updated cart from server
      const updatedCartItems = await axios.get(`${baseUrl}/cart/get/${userProfile._id}`);

      this.setState({
        cartItems: updatedCartItems.data.cartItems || [],
        qtyLoadingId: null, // Reset loading state
      });
    } catch (err) {
      console.log(err);
      this.setState({ qtyLoadingId: null }); // Reset even if error
    }
  };


  handleRemoveItem = async (itemId) => {
    
  };

  showDeleteConfirmation = (itemId) => {
    this.setState({
      showDeleteAlert: true,
      itemToDelete: itemId
    });
  };

  cancelDelete = () => {
    this.setState({
      showDeleteAlert: false,
      itemToDelete: null
    });
  };


  handleLogout = () => {
    const logoutMsg = window.confirm("Are you sure you want to logout?");
    if (logoutMsg) {
      localStorage.clear();
      window.location.reload();
    }
  };

  handleSearchChange = (e) => {
    const query = e.target.value;
    this.setState({ searchQuery: query });

    if (query.length > 2) {
      const mockResults = []; // Replace with real data or API call
      this.setState({
        searchResults: mockResults.filter(
          (item) =>
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase())
        ),
      });
    } else {
      this.setState({ searchResults: [] });
    }
  };

  closeLoginWarning = () => {
    this.setState({ showLoginWarning: false });
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
      userProfile,
      isLoggedIn,
      showLoginWarning,
    } = this.state;

    return (
      <div>
        <style dangerouslySetInnerHTML={{ __html: customStyles }} />

        <header className="bg-white shadow-lg sticky top-0 z-40">
          <div className="bg-black text-white text-center py-2 text-sm">
            Free shipping on orders over $500 | 30-day returns
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link to="/">
                <div className="flex-shrink-0">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                    RAYA JEWELS
                  </h1>
                </div>
              </Link>

              <nav className="hidden md:flex space-x-8">
                {["collections", "rings", "necklaces", "earrings", "about"].map((route) => (
                  <Link
                    key={route}
                    to={`/${route}`}
                    className="text-gray-700 hover:text-yellow-600 font-medium transition-colors"
                  >
                    {route.charAt(0).toUpperCase() + route.slice(1)}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center space-x-4">
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

                  <button className="md:hidden p-2" onClick={this.toggleSearch}>
                    <Search className="h-5 w-5 text-gray-700 hover:text-yellow-600 transition-colors" />
                  </button>
                </div>

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

                {isLoggedIn && (
                  <div className="relative">
                    <button onClick={this.toggleCart}>
                      <ShoppingBag className="h-6 w-6 text-gray-700 hover:text-yellow-600 cursor-pointer transition-colors ml-3" />

                      <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {this.state.isLoading ? (
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          cartItems.reduce((total, item) => total + parseInt(item.Qty), 0)
                        )}
                      </span>
                    </button>
                  </div>
                )}

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

          {isMenuOpen && (
            <div className="md:hidden bg-white border-t animate-slideDown px-4 py-2 space-y-2">
              {["collections", "rings", "necklaces", "earrings", "about"].map((route) => (
                <Link
                  key={route}
                  to={`/${route}`}
                  className="block py-2 text-gray-700"
                  onClick={this.toggleMenu}
                >
                  {route.charAt(0).toUpperCase() + route.slice(1)}
                </Link>
              ))}
            </div>
          )}
        </header>

        {isSearchOpen && (
          <SearchOverlay
            isSearchOpen={isSearchOpen}
            searchQuery={searchQuery}
            searchResults={searchResults}
            handleSearchChange={this.handleSearchChange}
            closeSearch={this.closeSearch}
          />
        )}

        {isLoggedIn && isCartOpen && (
          <Cart
            isCartOpen={this.state.isCartOpen}
            toggleCart={this.toggleCart}
            cartItems={this.state.cartItems}
            loading={this.state.isLoading}
            onHandleQty={this.handleQuantity}
            qtyLoadingId={this.state.qtyLoadingId}
            showDeleteAlert={this.state.showDeleteAlert}
            itemToDelete={this.state.itemToDelete}
            onConfirmDelete={this.handleRemoveItem} // This will actually delete the item
            onCancelDelete={this.cancelDelete}
          />

        )}

        {showLoginWarning && <LoginWarning onClose={this.closeLoginWarning} />}

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
