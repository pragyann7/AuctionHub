// src/components/UserProducts.jsx
import React from "react";
import { Eye, Heart, Info, Clock, Filter } from "lucide-react";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";

const products = [
  {
    "id": 1,
    "title": "Nike Air Jordan Sneakers",
    "description": "Product is good, like new only",
    "condition": "Like New",
    "currentBid": 10710,
    "timeLeft": "2d 10h",
    "image": "https://picsum.photos/400/300?random=1",
    "status": "upcoming"
  },
  {
    "id": 2,
    "title": "EcoFlow\u2122 Reusable Water Bottle",
    "description": "Brand new, unopened box",
    "condition": "Used",
    "currentBid": 1783,
    "timeLeft": "4d 8h",
    "image": "https://picsum.photos/400/300?random=2",
    "status": "closed"
  },
  {
    "id": 3,
    "title": "GTA VI Exclusive & Limited Edition",
    "description": "Authentic product, warranty included",
    "condition": "Used",
    "currentBid": 17500,
    "timeLeft": "3d 10h",
    "image": "https://picsum.photos/400/300?random=3",
    "status": "closed"
  },
  {
    "id": 4,
    "title": "MacBook Pro 16-inch",
    "description": "Authentic product, warranty included",
    "condition": "Like New",
    "currentBid": 7403,
    "timeLeft": "1d 21h",
    "image": "https://picsum.photos/400/300?random=4",
    "status": "upcoming"
  },
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
          <div className="bg-white rounded-xl shadow hover:shadow-md transition p-4 flex flex-col" >
            {/* Product Image */}
            <div div className="relative w-full h-48 mb-4" >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover rounded-lg"
              />
              {/* Condition Badge */}
              <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                {product.condition}
              </span>
            </div >

            {/* Title */}
            <h3 h3 className="text-lg font-semibold mb-1" > {product.title}</h3 >
            <p className="text-sm text-gray-500 mb-2">{product.description}</p>

            {/* Current Bid + Timer */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-xs text-gray-500">Current Bid</p>
                {/* <p className="text-lg font-bold">${product.currentBid}</p> */}$
                <CountUp end={product.currentBid} duration={1.5} separator="," />
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Ends in</p>
                <p className="text-sm font-medium text-orange-600">{product.timeLeft}</p>

              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center mt-auto">
              <button className="cursor-pointer bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                Bid Now
              </button>
              <button className="flex items-center gap-1 text-gray-600 hover:text-orange-500 transition text-sm">
                <Heart size={16} /> Watchlist
              </button>
            </div>
          </div >
        ))}
      </motion.div>

      {/* See All */}
      <motion.div variants={item} className="text-center mt-8">
        <button className="border border-gray-300 px-8 py-3 rounded-lg font-medium hover:bg-orange-600 hover:text-white hover:orange-indigo-600 transition-colors shadow-sm">
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
