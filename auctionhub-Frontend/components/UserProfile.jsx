// src/components/UserProfile.jsx
import React, { useState, useContext } from "react";
import {
  Star,
  Facebook,
  Instagram,
  Twitter,
  Mail,
  MapPin,
  Package,
  Share2,
  MessageCircle,
  UserPlus,
  Search,
  User,
  Edit2,
} from "lucide-react";
import UserProduct from "./UserProducts";
import UserAbout from "./UserAbout";
import UserFeedback from "./UserFeedback";
import CountUp from "react-countup";
import { motion, AnimatePresence } from "framer-motion";
import AuthContext from "../context/authContext";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  const { user, loading } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("Products");
  const navigate = useNavigate();

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };

  const item = {
    hidden: { opacity: 0, y: 15, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };

  const tabContentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading user profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-indigo-100 via-purple-50 to-indigo-100 px-4 sm:px-6 py-8 rounded-b-[36px]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="flex flex-col sm:flex-row items-start sm:space-x-6 space-y-4 sm:space-y-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={container}
          >
            {/* Profile Picture */}
            <motion.div
              variants={item}
              className="w-32 h-32 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-pink-300 to-pink-400 flex items-center justify-center text-white text-4xl font-bold shadow-lg flex-shrink-0 border-4 border-white"
            >
              <div className="w-28 h-28 sm:w-30 sm:h-30 rounded-full bg-orange-500 bg-opacity-50 flex items-center justify-center">
                {user?.profile_photo ? (
                  <img
                    src={user.profile_photo}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User size={80} />
                )}
              </div>
            </motion.div>

            {/* User Info */}
            <motion.div variants={item} className="flex-grow">
              <motion.div
                variants={container}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 space-y-4 sm:space-y-0"
              >
                <motion.div variants={item}>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 font-serif">
                    {user?.username || "Unnamed User"}
                  </h1>

                  <div className="flex items-center flex-wrap space-x-2 mb-3">
                    <div className="flex items-center">
                      {[1, 2, 3, 4].map((star) => (
                        <Star
                          key={star}
                          className="w-5 h-5 text-yellow-400 fill-current"
                        />
                      ))}
                      <Star className="w-5 h-5 text-gray-300" />
                    </div>
                    <span className="text-lg sm:text-xl font-semibold text-gray-800">
                      <CountUp end={4.5} decimals={1} duration={1.5} />
                    </span>
                    <span className="text-gray-500">/5</span>
                    <span className="text-gray-400 text-sm ml-2">
                      (14 Ratings)
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  variants={item}
                  className="flex space-x-3 flex-wrap"
                >
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
                </motion.div>
              </motion.div>

              {/* Stats */}
              <motion.div
                variants={container}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
              >
                <motion.div variants={item}>
                  <div className="text-gray-500 font-medium text-sm mb-1">
                    Location
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span className="text-gray-800 font-medium">
                      {user?.location || "Unknown"}
                    </span>
                  </div>
                </motion.div>

                <motion.div variants={item}>
                  <div className="text-gray-500 font-medium text-sm mb-1">
                    Joined
                  </div>
                  <div className="text-gray-800 font-medium">
                    {user?.date_joined
                      ? new Date(user.date_joined).toLocaleDateString("en-CA")
                      : "-"}
                  </div>
                </motion.div>

                <motion.div variants={item}>
                  <div className="text-gray-500 font-medium text-sm mb-1">
                    Total Product
                  </div>
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-800 font-medium">
                      {user?.total_products || 0}
                    </span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div variants={container} className="flex flex-wrap gap-2">
                <motion.button
                  variants={item}
                  className="flex-1 min-w-[120px] bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 shadow-sm"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Follow</span>
                </motion.button>
                <motion.button
                  variants={item}
                  className="flex-1 min-w-[120px] bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Contact</span>
                </motion.button>
                <motion.button
                  variants={item}
                  className="flex-1 min-w-[50px] bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-2 py-2 rounded-lg flex items-center justify-center shadow-sm"
                >
                  <Share2 className="w-4 h-4" />
                </motion.button>
                <motion.button
                  variants={item}
                  onClick={() => navigate("/editprofile")}
                  className="flex-1 min-w-[50px] bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-2 py-2 rounded-lg flex items-center justify-center shadow-sm"
                >
                  <Edit2 className="w-4 h-4" />
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow-sm mt-[-20px] mx-4 sm:mx-6 rounded-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex flex-wrap justify-start gap-2"
            >
              {["Products", "About", "Feedback"].map((tab) => (
                <div
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 px-4 sm:px-6 border-b-2 font-medium text-sm text-center cursor-pointer w-24 sm:w-auto ${
                    activeTab === tab
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab}
                </div>
              ))}
            </motion.div>

            {activeTab === "Products" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full sm:w-64"
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search"
                  className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent w-full sm:w-64 bg-gray-50"
                />
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <AnimatePresence mode="wait">
          {activeTab === "Products" && (
            <motion.div
              key="Products"
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <UserProduct />
            </motion.div>
          )}
          {activeTab === "About" && (
            <motion.div
              key="About"
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <UserAbout />
            </motion.div>
          )}
          {activeTab === "Feedback" && (
            <motion.div
              key="Feedback"
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <UserFeedback />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
