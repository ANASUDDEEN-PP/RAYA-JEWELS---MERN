import { Link } from "react-router-dom";
import React, { Component } from "react";

export default class footer extends Component {
  render() {
    return (
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-4">
                RAYA JEWELS
              </h3>
              <p className="text-gray-400 mb-4">
                Crafting timeless jewelry pieces that celebrate life's precious
                moments.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-yellow-600 transition-colors">
                  f
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-yellow-600 transition-colors">
                  t
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-yellow-600 transition-colors">
                  i
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    All Jewelry
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Rings
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Necklaces
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Earrings
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Bracelets
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Customer Care</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Size Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Care Instructions
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Returns
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Warranty
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">About</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Our Story
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Craftsmanship
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Sustainability
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Press
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 RAYA JEWELS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  }
}
