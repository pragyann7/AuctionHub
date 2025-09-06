// src/components/UserProducts.jsx
import React from "react";
import { Eye, Heart, Info, Clock, Filter } from "lucide-react";
import CountUp from "react-countup";
import { motion } from "framer-motion";

const products = [
  { id: 1, name: "GTA VI Exclusive & Limited Edition", price: 1700, time: "7hr : 22m : 45s", views: 999000, description: "Product is good, like new only" },
  { id: 2, name: "GTA VI Exclusive & Limited Edition", price: 1700, time: "7hr : 22m : 45s", views: 999000, description: "Product is good, like new only" },
  { id: 3, name: "GTA VI Exclusive & Limited Edition", price: 1700, time: "7hr : 22m : 45s", views: 999000, description: "Product is good, like new only" },
  { id: 4, name: "GTA VI Exclusive & Limited Edition", price: 1700, time: "7hr : 22m : 45s", views: 999000, description: "Product is good, like new only" },
  { id: 5, name: "GTA VI Exclusive & Limited Edition", price: 1700, time: "7hr : 22m : 45s", views: 999000, description: "Product is good, like new only" },
  { id: 6, name: "GTA VI Exclusive & Limited Edition", price: 1700, time: "7hr : 22m : 45s", views: 999000, description: "Product is good, like new only" },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 15, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeInOut" } },
};

export default function UserProduct() {
  return (
    <motion.div className="w-full max-w-full" initial="hidden" animate="visible" variants={container}>
      {/* Filter Section */}
      <motion.div variants={item} className="mb-6 flex justify-end">
        <div className="inline-flex items-center bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm hover:shadow-md transition-all">
          <div className="p-2 rounded-full bg-gray-100 mr-2">
            <Filter className="w-5 h-5 text-gray-600" />
          </div>
          <span className="font-medium text-gray-800">Filters</span>
        </div>
      </motion.div>

      {/* Products Grid */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {products.map((product) => (
          <motion.div
            key={product.id}
            variants={item}
            className="border border-gray-200 rounded-[20px] bg-white shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
          >
            {/* Product image */}
            <div className="h-48 bg-gray-100 flex items-center justify-center relative">
              <span className="text-gray-400">Image</span>

              {/* Heart icon */}
              <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors">
                <Heart className="w-5 h-5 text-gray-600" />
              </button>

              {/* Info icon */}
              <button className="absolute bottom-4 right-4 p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors">
                <Info className="w-5 h-5 text-gray-600" />
              </button>

              {/* Eye icon with view count */}
              <div className="absolute bottom-4 left-4 flex items-center space-x-1 bg-white rounded-full px-3 py-1.5 shadow-sm">
                <Eye className="w-4 h-4 text-gray-600" />
                <span className="text-xs font-medium text-gray-700">
                  <CountUp end={product.views} duration={1.5} separator="," />
                </span>
              </div>
            </div>

            {/* Product details */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 text-lg mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-3">
                {product.description} <span className="text-blue-600">Read more...</span>
              </p>

              <div className="flex justify-between items-center">
                <span className="font-bold text-xl text-gray-800">
                  $<CountUp end={product.price} duration={1.5} separator="," />
                </span>
                <div className="flex items-center text-gray-600 text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{product.time}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* See All */}
      <motion.div variants={item} className="text-center mt-8">
        <button className="border border-gray-300 px-8 py-3 rounded-lg font-medium hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-colors shadow-sm">
          See All
        </button>
      </motion.div>

      <motion.div variants={item} className="mt-8 text-center text-gray-500">
        Do you like our profile experience?
        <button className="ml-2 hover:text-gray-700">👍</button>
        <button className="ml-1 hover:text-gray-700">👎</button>
      </motion.div>
    </motion.div>
  );
}
