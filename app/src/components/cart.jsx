import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import axios from 'axios';
import baseUrl from '../url';

// CSS for animation and loader
const cartStyles = `
  @keyframes slideInFromRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  .animate-slideInFromRight { animation: slideInFromRight 0.4s ease-out forwards; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loader {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left-color: #facc15;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }
`;

const Cart = ({
  isCartOpen,
  toggleCart,
  cartItems = [],
  loading = false,
  onHandleQty,
  qtyLoadingId
}) => {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDeleteClick = (cartId) => {
    setItemToDelete(cartId);
    setShowDeleteAlert(true);
  };

const confirmDelete = async () => {
  setDeleteLoading(true);
  try {
    await axios.delete(`${baseUrl}/cart/delete/${itemToDelete}`);
    setShowDeleteAlert(false);
    window.location.reload();
  } catch (err) {
    console.log(err);
  } finally {
    setDeleteLoading(false);
    setItemToDelete(null);
  }
};


  const cancelDelete = () => {
    setShowDeleteAlert(false);
    setItemToDelete(null);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.Qty, 0).toFixed(2);
  };

  const calculateTotalItems = () => {
    return cartItems.reduce((total, item) => total + parseInt(item.Qty), 0);
  };

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: cartStyles }} />

      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity animate-fadeIn"
              onClick={toggleCart}
              aria-hidden="true"
            ></div>

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
                        className="-mr-2 p-2 text-gray-400 hover:text-gray-500"
                        onClick={toggleCart}
                        aria-label="Close cart"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>

                    {/* Loader */}
                    {loading ? (
                      <div className="flex flex-col items-center justify-center h-full py-16">
                        <div className="loader mb-4"></div>
                        <p className="text-gray-500">Loading cart items...</p>
                      </div>
                    ) : (
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
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700"
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
                                      src={item.prdImg}
                                      alt={item.prdName}
                                      className="w-full h-full object-center object-cover"
                                      loading="lazy"
                                    />
                                  </div>
                                  <div className="ml-4 flex-1 flex flex-col">
                                    <div>
                                      <div className="flex justify-between text-base font-medium text-gray-900">
                                        <h3>
                                          <Link to={`/view/product/${item.prdId}`} onClick={toggleCart}>
                                            {item.prdName}
                                          </Link>
                                        </h3>
                                        <p className="ml-4">${(item.price * item.Qty).toFixed(2)}</p>
                                      </div>
                                    </div>
                                    <div className="flex-1 flex items-end justify-between text-sm">
                                      <div className="flex items-center border border-gray-300 rounded-md px-2 py-1">
                                        {qtyLoadingId === item.prdId ? (
                                          <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                          <>
                                            <button
                                              type="button"
                                              className="px-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                                              onClick={() => onHandleQty(item.prdId, "decrease")}
                                              disabled={item.Qty <= 1}
                                            >
                                              <Minus className="h-4 w-4" />
                                            </button>
                                            <span className="px-2 text-gray-700">{item.Qty}</span>
                                            <button
                                              type="button"
                                              className="px-2 text-gray-500 hover:text-gray-700"
                                              onClick={() => onHandleQty(item.prdId, "increase")}
                                            >
                                              <Plus className="h-4 w-4" />
                                            </button>
                                          </>
                                        )}
                                      </div>
                                      <button
                                        type="button"
                                        className="flex items-center font-medium text-red-600 hover:text-red-500"
                                        onClick={() => handleDeleteClick(item.cartId)}
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
                    )}
                  </div>

                  {/* Cart Footer */}
                  {!loading && cartItems.length > 0 && (
                    <div className="border-t mb-[30px] border-gray-200 py-6 px-4 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>${calculateSubtotal()}</p>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">
                        Shipping and taxes calculated at checkout.
                      </p>
                      {/* <div className="mt-6">
                        <Link
                          to="/checkout"
                          onClick={toggleCart}
                          className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-yellow-600 hover:bg-yellow-700 w-full"
                        >
                          Checkout
                        </Link>
                      </div> */}
                      <div className="mt-6 flex justify-center text-sm text-gray-500">
                        <p>
                          or{' '}
                          <button
                            type="button"
                            className="text-yellow-600 font-medium hover:text-yellow-500"
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

          {/* Delete Confirmation Alert */}
          {showDeleteAlert && (
            <div className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-6 sm:p-0 sm:items-center sm:justify-center">
              <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <Trash2 className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Remove item
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to remove this item from your cart?
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
  onClick={confirmDelete}
  type="button"
  disabled={deleteLoading}
  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${
    deleteLoading ? "bg-red-400" : "bg-red-600 hover:bg-red-700"
  } text-base font-medium text-white focus:outline-none sm:ml-3 sm:w-auto sm:text-sm`}
>
  {deleteLoading ? (
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  ) : (
    "Remove"
  )}
</button>

                  <button
                    onClick={cancelDelete}
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;