// src/components/UserAbout.jsx
import React from "react";
import { MapPin } from "lucide-react";

export default function UserAbout() {
  return (
    <div className="w-full max-w-full">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">About</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-md font-medium text-gray-700 mb-2">Description</h3>
          <p className="text-gray-600 text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>

        <div>
          <h3 className="text-md font-medium text-gray-700 mb-2">Location</h3>
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-red-500" />
            <span className="text-gray-600 text-sm">Tokyo, Nepal</span>
          </div>
        </div>

        <div>
          <h3 className="text-md font-medium text-gray-700 mb-2">Contact Information</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Email</span>
              <span className="text-gray-800 text-sm font-medium">kavreli@example.com</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Phone</span>
              <span className="text-gray-800 text-sm font-medium">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Website</span>
              <span className="text-blue-600 text-sm font-medium hover:underline cursor-pointer">www.kavrelisuppliers.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}