import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Star, Facebook, Instagram, Twitter, Mail, MapPin, Package, Share2, MessageCircle, UserPlus, Search, User, Edit2, Heart, X, } from "lucide-react";
import RealProductCard from "./RealProductCard";
import UserAbout from "./UserAbout";
import UserFeedback from "./UserFeedback";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../API/axiosInstance";

export default function UserProfile() {
    const { user, loading, currentUser } = useContext(AuthContext);
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState(user?.is_seller ? "Products" : "About");
    const [profileUser, setProfileUser] = useState(null);
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            if (!id || id === currentUser?.id) {
                // Own profile
                setProfileUser(currentUser);
                if (currentUser?.is_seller) {
                    const res = await axiosInstance.get(`/AFauctions/?seller_id=${currentUser.id}`);
                    setProducts(res.data);
                }
            } else {
                // Other user's profile
                try {
                    const resUser = await axiosInstance.get(`/users/${id}/`);
                    setProfileUser(resUser.data);

                    if (resUser.data?.is_seller) {
                        const resProducts = await axiosInstance.get(`/AFauctions/?seller_id=${resUser.data.id}`);
                        setProducts(resProducts.data);
                    }
                } catch (err) {
                    console.error(err);
                }
            }
        };

        fetchProfile();
    }, [id, currentUser]);

    useEffect(() => {
        if (profileUser) {
            setActiveTab(profileUser.is_seller ? "Products" : "About");
        }
    }, [profileUser]);

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
                    <div className="flex flex-col sm:flex-row items-start sm:space-x-6 space-y-4 sm:space-y-0">

                        <div className="relative w-36 h-36 md:w-48 md:h-48 group">
                            {/* Profile Circle */}
                            <div
                                className="absolute inset-0 rounded-full flex items-center justify-center border-4 border-white shadow-lg bg-gradient-to-br from-pink-300 to-pink-400 text-white font-bold overflow-hidden"
                            >
                                {profileUser?.profile_photo ? (
                                    <img
                                        src={profileUser.profile_photo}
                                        alt="Profile"
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                ) : (
                                    <User size={100} />
                                )}
                            </div>

                            {/* Status Badge */}
                            <span
                                className={`absolute top-1 right-1 px-2 py-1 cursor-default text-xs font-semibold rounded-full text-white shadow-md ${profileUser?.is_seller ? 'bg-blue-500' : 'bg-green-500'
                                    }`}
                            >
                                {profileUser?.is_seller ? 'Seller' : 'Buyer'}
                            </span>

                            {/* Tooltip on Hover (Above Badge) */}
                            <div className="absolute bottom-full right-0 mb-1 w-max px-2 py-1 text-xs rounded bg-gray-800 text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                {profileUser?.is_seller ? 'Can bid and sell products' : 'Can only bid'}
                            </div>
                        </div>





                        {/* User Info */}
                        <div className="flex-grow">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 space-y-4 sm:space-y-0">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 font-serif">
                                        {profileUser?.username || "Unnamed User"}
                                    </h1>
                                    <div className="flex mb-3">
                                        <div className="flex flex-col">
                                            <label className="hover:text-orange-300 cursor-pointer">Followers</label>
                                            <label>0</label>
                                        </div>
                                        {/* <label className="ml-1 mr-1">/</label> */}
                                        <div className="w-0 h-7 border border-gray-500/70 mx-3"></div>
                                        <div className="flex flex-col">
                                            <label className="hover:text-orange-300 cursor-pointer">Following</label>
                                            <label>0</label>
                                        </div>
                                    </div>
                                    {profileUser?.is_seller && (<div className="flex items-center flex-wrap space-x-2 mb-3">
                                        <div className="flex items-center">
                                            {[1, 2, 3, 4].map((star) => (
                                                <Star
                                                    key={star}
                                                    className="w-5 h-5 text-yellow-400 fill-current"
                                                />
                                            ))}
                                            <Star className="w-5 h-5 text-gray-300" />
                                        </div>
                                        <span className="text-lg sm:text-xl font-semibold text-gray-800">4.5</span>
                                        <span className="text-gray-500">/5</span>
                                        <span className="text-gray-400 text-sm ml-2">
                                            (14 Ratings)
                                        </span>
                                    </div>)}
                                </div>

                                <div className="flex space-x-3 flex-wrap">
                                    <div className="w-10 h-10 bg-blue-600 rounded-[7px] flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                                        <Facebook className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-[7px] flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
                                        <Instagram className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="w-10 h-10 bg-black rounded-[7px] flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors">
                                        <X className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="w-10 h-10 bg-blue-500 rounded-[7px] flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">
                                        <Mail className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                <div>
                                    <div className="text-gray-500 font-medium text-sm mb-1">
                                        Location
                                    </div>
                                    <div className="flex items-start space-x-2">
                                        <MapPin className="w-4 h-4 text-red-500 mt-1" />
                                        <span className="text-gray-800 font-medium break-words max-w-xs sm:max-w-full">
                                            {profileUser?.profile_address || "Unknown"}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <div className="text-gray-500 font-medium text-sm mb-1">
                                        Joined
                                    </div>
                                    <div className="text-gray-800 font-medium">
                                        {profileUser?.date_joined
                                            ? new Date(profileUser.date_joined).toLocaleDateString("en-CA")
                                            : "-"}
                                    </div>
                                </div>

                                {profileUser?.is_seller && (<div>
                                    <div className="text-gray-500 font-medium text-sm mb-1">
                                        Total Product
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Package className="w-4 h-4 text-gray-600" />
                                        <span className="text-gray-800 font-medium">
                                            {profileUser?.total_products || 0}
                                        </span>
                                    </div>
                                </div>)}
                                {!profileUser?.is_seller && (<div>
                                    <div className="text-gray-500 font-medium text-sm mb-1">
                                        Total Orders
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Package className="w-4 h-4 text-gray-600" />
                                        <span className="text-gray-800 font-medium">
                                            {profileUser?.total_products || 0}
                                        </span>
                                    </div>
                                </div>)}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-2">
                                {profileUser?.id !== currentUser?.id && (
                                    <button className="w-full sm:flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 shadow-sm">
                                        <UserPlus className="w-4 h-4" />
                                        <span>Follow</span>
                                    </button>
                                )}
                                {profileUser?.id !== currentUser?.id && (
                                    <button className="w-full sm:flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 shadow-sm">
                                        <MessageCircle className="w-4 h-4" />
                                        <span>Contact</span>
                                    </button>
                                )}
                                <button className="w-full sm:flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-2 py-2 rounded-lg flex items-center justify-center shadow-sm">
                                    <label>View Orders</label>
                                </button>
                                <button className="w-full sm:flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-2 py-2 rounded-lg flex items-center justify-center shadow-sm">
                                    <Heart className="w-4 h-4 mr-2" />
                                    WishList
                                </button>
                                {profileUser?.id == currentUser?.id && (
                                    <button
                                        onClick={() => navigate("/editprofile")}
                                        className="w-full sm:flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-2 py-2 rounded-lg flex items-center justify-center shadow-sm"
                                    >
                                        <Edit2 className="w-4 h-4 mr-2" />
                                        Edit Profile
                                    </button>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white shadow-sm mt-[-20px] mx-4 sm:mx-6 rounded-xl">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                        <div className="flex flex-wrap justify-start gap-2">
                            {/* Conditionally render Products tab */}
                            {profileUser?.is_seller && (
                                <div
                                    onClick={() => setActiveTab("Products")}
                                    className={`pb-3 px-4 sm:px-6 border-b-2 font-medium text-sm text-center cursor-pointer w-24 sm:w-auto ${activeTab === "Products"
                                        ? "border-orange-400 text-orange-400"
                                        : "border-transparent text-gray-500 hover:text-orange-200 "
                                        }`}
                                >
                                    Products
                                </div>
                            )}

                            <div
                                onClick={() => setActiveTab("About")}
                                className={`pb-3 px-4 sm:px-6 border-b-2 font-medium text-sm text-center cursor-pointer w-24 sm:w-auto ${activeTab === "About"
                                    ? "border-orange-400 text-orange-400"
                                    : "border-transparent text-gray-500 hover:text-orange-200 "
                                    }`}
                            >
                                About
                            </div>

                            <div
                                onClick={() => setActiveTab("Feedback")}
                                className={`pb-3 px-4 sm:px-6 border-b-2 font-medium text-sm text-center cursor-pointer w-24 sm:w-auto ${activeTab === "Feedback"
                                    ? "border-orange-400 text-orange-400"
                                    : "border-transparent text-gray-500 hover:text-orange-200 "
                                    }`}
                            >
                                Feedback
                            </div>
                        </div>

                        {activeTab === "Products" && (
                            <div className="relative ml-2 md:ml-0 w-full md:w-1/3">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-orange-400 focus:ring focus:ring-orange-400 shadow-sm placeholder-gray-400 text-sm transition"
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
                {activeTab === "Products" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-items-center">
                        {products.map(product => (
                            <RealProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
                {activeTab === "About" && <UserAbout />}
                {activeTab === "Feedback" && <UserFeedback />}
            </div>

        </div>
    );
}
