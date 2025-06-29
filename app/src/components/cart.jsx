import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

// Add this CSS for the animation (you can also add it to your global styles)
const cartStyles = `
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
  
  .animate-slideInFromRight { 
    animation: slideInFromRight 0.4s ease-out forwards; 
  }
`;

const Cart = ({ 
  isCartOpen, 
  toggleCart, 
  cartItems = [], 
  onIncreaseQuantity, 
  onDecreaseQuantity, 
  onRemoveItem 
}) => {
  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
  };

  const calculateTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div>
      {/* Inject the animation styles */}
      <style dangerouslySetInnerHTML={{ __html: cartStyles }} />
      
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            {/* Overlay with fade animation */}
            <div
              className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity animate-fadeIn"
              onClick={toggleCart}
              aria-hidden="true"
            ></div>
            
            {/* Cart Panel with right-to-left animation */}
            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
              <div className="w-screen max-w-md animate-slideInFromRight">
                <div className="h-full flex flex-col bg-white shadow-xl">
                  {/* Cart Header */}
                  <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <h2 className="text-lg font-medium text-gray-900">
                        Shopping Cart ({calculateTotalItems()})
                      </h2>
                      <button
                        type="button"
                        className="-mr-2 p-2 text-gray-400 hover:text-gray-500 transition-colors"
                        onClick={toggleCart}
                        aria-label="Close cart"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>

                    {/* Cart Items */}
                    <div className="mt-8">
                      <div className="flow-root">
                        {cartItems.length === 0 ? (
                          <div className="text-center py-12">
                            <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                              <ShoppingBag className="w-full h-full" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">Your cart is empty</h3>
                            <p className="text-gray-500 mb-6">Start adding some items to your cart</p>
                            <button
                              onClick={toggleCart}
                              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 transition-colors"
                            >
                              Continue Shopping
                            </button>
                          </div>
                        ) : (
                          <ul className="-my-6 divide-y divide-gray-200">
                            {cartItems.map((item) => (
                              <li key={`${item.id}-${item.size || ''}`} className="py-6 flex">
                                <div className="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden border border-gray-200">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-center object-cover"
                                    loading="lazy"
                                  />
                                </div>

                                <div className="ml-4 flex-1 flex flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <h3>
                                        <Link to={`/product/${item.id}`} onClick={toggleCart}>
                                          {item.name}
                                        </Link>
                                      </h3>
                                      <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                    {item.size && (
                                      <p className="mt-1 text-sm text-gray-500">Size: {item.size}</p>
                                    )}
                                    {item.color && (
                                      <p className="mt-1 text-sm text-gray-500">Color: {item.color}</p>
                                    )}
                                  </div>

                                  <div className="flex-1 flex items-end justify-between text-sm">
                                    <div className="flex items-center border border-gray-300 rounded-md">
                                      <button
                                        type="button"
                                        className="px-2 py-1 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                                        onClick={() => onDecreaseQuantity(item.id)}
                                        disabled={item.quantity <= 1}
                                        aria-label="Decrease quantity"
                                      >
                                        <Minus className="h-4 w-4" />
                                      </button>
                                      <span className="px-2 text-gray-700">{item.quantity}</span>
                                      <button
                                        type="button"
                                        className="px-2 py-1 text-gray-500 hover:text-gray-700 transition-colors"
                                        onClick={() => onIncreaseQuantity(item.id)}
                                        aria-label="Increase quantity"
                                      >
                                        <Plus className="h-4 w-4" />
                                      </button>
                                    </div>

                                    <button
                                      type="button"
                                      className="flex items-center font-medium text-red-600 hover:text-red-500 transition-colors"
                                      onClick={() => onRemoveItem(item.id)}
                                    >
                                      <Trash2 className="h-4 w-4 mr-1" />
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>

                  {cartItems.length > 0 && (
                    <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>${calculateSubtotal()}</p>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">
                        Shipping and taxes calculated at checkout.
                      </p>
                      <div className="mt-6">
                        <Link
                          to="/checkout"
                          onClick={toggleCart}
                          className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-yellow-600 hover:bg-yellow-700 transition-colors w-full"
                        >
                          Checkout
                        </Link>
                      </div>
                      <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                        <p>
                          or{' '}
                          <button
                            type="button"
                            className="text-yellow-600 font-medium hover:text-yellow-500 transition-colors"
                            onClick={toggleCart}
                          >
                            Continue Shopping<span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;