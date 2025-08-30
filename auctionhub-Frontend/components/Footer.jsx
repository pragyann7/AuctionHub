
import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#0b1620] text-white py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

        <div>
          <h2 className="text-2xl font-bold">
            <span className="text-orange-500">Auction</span>Hub
          </h2>
          <p className="mt-2 text-sm text-gray-300 max-w-[220px]">
            The finest things in life aren’t bought — they’re won.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-orange-500">Home</a></li>
            <li><a href="#" className="hover:text-orange-500">Auctions</a></li>
            <li><a href="#" className="hover:text-orange-500">Browse</a></li>
            <li><a href="#" className="hover:text-orange-500">About</a></li>
            <li><a href="#" className="hover:text-orange-500">Contact us</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Help</h3>
          <ul className="space-y-2 ">
            <li><a href="#" className="hover:text-orange-500">FAQ</a></li>
            <li><a href="#" className="hover:text-orange-500">Support</a></li>
            <li><a href="#" className="hover:text-orange-500">Terms</a></li>
            <li><a href="#" className="hover:text-orange-500">Privacy</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Follow Us</h3>
          <div className="flex space-x-4 text-xl mb-4">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaEnvelope /></a>
          </div>
          <p className="text-sm text-gray-300 mb-3">
            Get notified about exclusive deals and rare finds - right in your inbox.
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Email address"
              className="w-full px-3 py-2 rounded-l-md text-black focus:outline-none"
            />
            <button className="bg-orange-500 px-4 py-2 rounded-r-md hover:bg-orange-600">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="text-center text-gray-400 text-sm mt-10">
        © 2025 AuctionHub. All rights reserved.
      </div>
    </footer>
  );
}
