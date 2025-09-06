// src/components/UserProducts.jsx
import React from "react";
import { Eye, Heart, Info, Clock, Filter } from "lucide-react";
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
  },];

export default function UserProduct() {
  return (
    <div className="w-full max-w-full">
      {/* Filter Section */}
      <div className="mb-6 flex justify-end">
        <div className="inline-flex items-center bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm hover:shadow-md transition-all">
          <div className="p-2 rounded-full bg-gray-100 mr-2">
            <Filter className="w-5 h-5 text-gray-600" />
          </div>
          <span className="font-medium text-gray-800">Filters</span>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {products.map((a) => (
          <ProductCard key={a.id} product={a} />
        ))}
      </div>

      <div className="text-center mt-8">
        <button className="border border-gray-300 px-8 py-3 rounded-lg font-medium cursor-pointer hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-colors shadow-sm">
          See All
        </button>
      </div>

      <div className="mt-8 text-center text-gray-500">
        Do you like our profile experience?
        <button className="ml-2 hover:text-gray-700">👍</button>
        <button className="ml-1 hover:text-gray-700">👎</button>
      </div>
    </div>
  );
}
