import React, { Component } from 'react'
import {X} from "lucide-react";

const cart = () => {
    return (
      <div>
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
      </div>
    )
  }

  export default cart;