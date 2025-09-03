// src/components/UserProfile.jsx
import React, { useState } from "react";
import { Star, Facebook, Instagram, Twitter, Mail, MapPin, Package, Share2, MessageCircle, UserPlus, ThumbsUp, Search } from "lucide-react";
import UserProduct from "./UserProducts";
import UserAbout from "./UserAbout";
import UserFeedback from "./UserFeedback";

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("Products");

  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-indigo-100 via-purple-50 to-indigo-100 px-6 py-8 rounded-b-[36px]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start space-x-6">
            {/* Profile Avatar */}
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-300 to-pink-400 flex items-center justify-center text-white text-4xl font-bold shadow-lg flex-shrink-0 border-4 border-white">
              <div className="w-24 h-24 rounded-full bg-white bg-opacity-30 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white bg-opacity-50 flex items-center justify-center">
                  K
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-grow">
              {/* Name and Social Icons */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">Kavreli Samdhi Suppliers</h1>

                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center">
                      {[1, 2, 3, 4].map((star) => (
                        <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                      <Star className="w-5 h-5 text-gray-300" />
                    </div>
                    <span className="text-xl font-semibold text-gray-800">4.5</span>
                    <span className="text-gray-500">/5</span>
                    <span className="text-gray-400 text-sm ml-2">(14 Ratings)</span>
                  </div>
                </div>

                {/* Social Icons */}
                <div className="flex space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                    <Facebook className="w-5 h-5 text-white" />
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
                    <Instagram className="w-5 h-5 text-white" />
                  </div>
                  <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors">
                    <Twitter className="w-5 h-5 text-white" />
                  </div>
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              {/* Info Labels */}
              <div className="grid grid-cols-3 gap-6 mb-2">
                <div className="text-gray-500 font-medium text-sm">Location</div>
                <div className="text-gray-500 font-medium text-sm">Joined</div>
                <div className="text-gray-500 font-medium text-sm">Total Product</div>
              </div>

              {/* Info Values */}
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span className="text-gray-800 font-medium">Tokyo, Nepal</span>
                </div>
                <div className="text-gray-800 font-medium">7 february 2020</div>
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-800 font-medium">9</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-4">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center space-x-2 shadow-sm">
                  <UserPlus className="w-4 h-4" />
                  <span>Follow</span>
                </button>
                <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center space-x-2 shadow-sm">
                  <MessageCircle className="w-4 h-4" />
                  <span>Contact</span>
                </button>
                <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 p-2.5 rounded-lg transition-colors shadow-sm">
                  <Share2 className="w-4 h-4" />
                </button>
                <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 p-2.5 rounded-lg transition-colors shadow-sm">
                  <ThumbsUp className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs + Search */}
      <div className="bg-white shadow-sm mt-[-20px] mx-6 rounded-xl">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Tabs */}
            <div className="flex space-x-8">
              <div
                onClick={() => setActiveTab("Products")}
                className={`pb-3 px-6 border-b-2 font-medium text-sm transition-colors cursor-pointer w-24 text-center ${
                  activeTab === "Products"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Products
              </div>
              <div
                onClick={() => setActiveTab("About")}
                className={`pb-3 px-6 border-b-2 font-medium text-sm transition-colors cursor-pointer w-24 text-center ${
                  activeTab === "About"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                About
              </div>
              <div
                onClick={() => setActiveTab("Feedback")}
                className={`pb-3 px-6 border-b-2 font-medium text-sm transition-colors cursor-pointer w-24 text-center ${
                  activeTab === "Feedback"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Feedback
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search"
                className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent w-64 bg-gray-50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="w-full max-w-4xl mx-auto">
          {activeTab === "Products" && <UserProduct />}
          {activeTab === "About" && <UserAbout />}
          {activeTab === "Feedback" && <UserFeedback />}
        </div>
      </div>
    </div>
  );
}