import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Star,
    Facebook,
    Instagram,
    Mail,
    MapPin,
    Package,
    MessageCircle,
    UserPlus,
    User,
    Edit2,
    X,
} from "lucide-react";
import RealProductCard from "./RealProductCard";
import UserAbout from "./UserAbout";
import UserFeedback from "./UserFeedback";
import AuthContext from "../context/AuthContext";
import axiosInstance from "../API/axiosInstance";
import { MdOutlineReportGmailerrorred } from "react-icons/md";

export default function UserProfile() {
    const { currentUser, loading, refreshUser } = useContext(AuthContext);
    const { id } = useParams();
    const [profileUser, setProfileUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [activeTab, setActiveTab] = useState("About");
    const [isFollowing, setIsFollowing] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) return;

        const fetchProfile = async () => {
            try {
                let userData;
                let productsData = [];

                if (id && id !== currentUser.id) {
                    const resUser = await axiosInstance.get(`/users/${id}/`);
                    userData = resUser.data;

                    if (resUser.data.is_seller) {
                        const resProducts = await axiosInstance.get(
                            `/AFauctions/?seller_id=${resUser.data.id}`
                        );
                        productsData = resProducts.data;
                    }
                } else {
                    userData = currentUser;
                    if (currentUser.is_seller) {
                        const resProducts = await axiosInstance.get(
                            `/AFauctions/?seller_id=${currentUser.id}`
                        );
                        productsData = resProducts.data;
                    }
                }

                setProfileUser(userData);
                setProducts(productsData);
                setActiveTab(userData.is_seller ? "Products" : "About");

                setIsFollowing(userData.following || false);
                setFollowersCount(userData.followers_count || 0);

            } catch (err) {
                console.error(err);
            }
        };

        fetchProfile();
    }, [currentUser, id]);

    const toggleFollow = async () => {
        if (!currentUser || !profileUser) return;

        try {
            const res = await axiosInstance.post(`/follow/`, { following: profileUser.id });

            if (res.data.followed) {
                setIsFollowing(true);
                setFollowersCount(prev => prev + 1);
            } else {
                setIsFollowing(false);
                setFollowersCount(prev => Math.max(prev - 1, 0));
            }

            await refreshUser();

        } catch (err) {
            console.error("Follow/unfollow error:", err);
        }
    };

    if (loading || !profileUser) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-600">
                Loading profile...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-gradient-to-r from-indigo-100 via-purple-50 to-indigo-100 px-4 sm:px-6 py-8 rounded-b-[36px]">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:space-x-6 space-y-4 sm:space-y-0">
                    <div className="relative w-36 h-36 md:w-48 md:h-48 group">
                        <div className="absolute inset-0 rounded-full text-white flex items-center justify-center border-4 border-white shadow-lg bg-gradient-to-br from-pink-300 to-pink-400 overflow-hidden">
                            {profileUser.profile_photo ? (
                                <img
                                    src={profileUser.profile_photo}
                                    alt="Profile"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            ) : (
                                <User size={100} />
                            )}
                        </div>
                        <span
                            className={`absolute top-1 right-1 px-2 py-1 text-xs font-semibold rounded-full text-white shadow-md ${profileUser.is_seller ? "bg-blue-500" : "bg-green-500"
                                }`}
                        >
                            {profileUser.is_seller ? "Seller" : "Buyer"}
                        </span>
                        <div className="absolute bottom-full right-0 mb-1 w-max px-2 py-1 text-xs rounded bg-gray-800 text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                            {profileUser.is_seller ? "Can bid and sell products" : "Can only bid"}
                        </div>
                    </div>

                    <div className="flex-grow">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 space-y-4 sm:space-y-0">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 font-serif">
                                    {profileUser.username || "Unnamed User"}
                                </h1>

                                <div className="flex mb-3">
                                    <div className="flex flex-col">
                                        <label className="hover:text-orange-300 cursor-pointer">Followers</label>
                                        <label>{followersCount}</label>
                                    </div>
                                    <div className="w-0 h-7 border border-gray-500/70 mx-3"></div>
                                    <div className="flex flex-col">
                                        <label className="hover:text-orange-300 cursor-pointer">Following</label>
                                        <label>{profileUser.following_count || 0}</label>
                                    </div>
                                </div>

                                {profileUser.is_seller && (
                                    <div className="flex items-center flex-wrap space-x-2 mb-3">
                                        <div className="flex items-center">
                                            {[1, 2, 3, 4].map(star => (
                                                <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                                            ))}
                                            <Star className="w-5 h-5 text-gray-300" />
                                        </div>
                                        <span className="text-lg sm:text-xl font-semibold text-gray-800">4.5</span>
                                        <span className="text-gray-500">/5</span>
                                        <span className="text-gray-400 text-sm ml-2">(14 Ratings)</span>
                                    </div>
                                )}
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

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                            <div>
                                <div className="text-gray-500 font-medium text-sm mb-1">Location</div>
                                <div className="flex items-start space-x-2">
                                    <MapPin className="w-4 h-4 text-red-500 mt-1" />
                                    <span className="text-gray-800 font-medium break-words max-w-xs sm:max-w-full">
                                        {profileUser.profile_address || "Unknown"}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <div className="text-gray-500 font-medium text-sm mb-1">Joined</div>
                                <div className="text-gray-800 font-medium">
                                    {profileUser.date_joined
                                        ? new Date(profileUser.date_joined).toLocaleDateString("en-CA")
                                        : "-"}
                                </div>
                            </div>
                            <div>
                                <div className="text-gray-500 font-medium text-sm mb-1">
                                    {profileUser.is_seller ? "Total Products" : "Total Orders"}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Package className="w-4 h-4 text-gray-600" />
                                    <span className="text-gray-800 font-medium">
                                        {profileUser.is_seller ? profileUser.total_products : profileUser.total_orders || 0}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {profileUser.id !== currentUser.id && (
                                <>
                                    <button
                                        onClick={toggleFollow}
                                        className={`w-full sm:flex-1 px-4 py-2 rounded-lg font-medium flex items-center justify-center shadow-sm ${isFollowing ? "bg-gray-300 text-gray-700" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}
                                    >
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        {isFollowing ? "Following" : "Follow"}
                                    </button>

                                    <button className="w-full sm:flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 shadow-sm">
                                        <MessageCircle className="w-4 h-4" />
                                        <span>Contact</span>
                                    </button>

                                    <button className="w-full sm:flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 shadow-sm">
                                        <MdOutlineReportGmailerrorred className="w-6 h-6" />
                                        <span>Report</span>
                                    </button>
                                </>
                            )}

                            {profileUser.id === currentUser.id && (
                                <>
                                    <button
                                        onClick={() => navigate("/editprofile")}
                                        className="w-full sm:flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-2 py-2 rounded-lg flex items-center justify-center shadow-sm"
                                    >
                                        <Edit2 className="w-4 h-4 mr-2" />
                                        Edit Profile
                                    </button>
                                    <button className="w-full sm:flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-2 py-2 rounded-lg flex items-center justify-center shadow-sm">
                                        Watchlist items <span className="ml-1">{currentUser.watchlist_count || 0}</span>
                                    </button>
                                    <button className="w-full sm:flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-2 py-2 rounded-lg flex items-center justify-center shadow-sm">
                                        <label>View Orders</label>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow-sm mt-[-20px] mx-4 sm:mx-6 rounded-xl">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap gap-2">
                    {profileUser.is_seller && (
                        <div
                            onClick={() => setActiveTab("Products")}
                            className={`pb-3 px-4 sm:px-6 border-b-2 font-medium text-sm cursor-pointer ${activeTab === "Products" ? "border-orange-400 text-orange-400" : "border-transparent text-gray-500 hover:text-orange-200"
                                }`}
                        >
                            Products
                        </div>
                    )}
                    <div
                        onClick={() => setActiveTab("About")}
                        className={`pb-3 px-4 sm:px-6 border-b-2 font-medium text-sm cursor-pointer ${activeTab === "About" ? "border-orange-400 text-orange-400" : "border-transparent text-gray-500 hover:text-orange-200"
                            }`}
                    >
                        About
                    </div>
                    <div
                        onClick={() => setActiveTab("Feedback")}
                        className={`pb-3 px-4 sm:px-6 border-b-2 font-medium text-sm cursor-pointer ${activeTab === "Feedback" ? "border-orange-400 text-orange-400" : "border-transparent text-gray-500 hover:text-orange-200"
                            }`}
                    >
                        Feedback
                    </div>
                </div>
            </div>

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
