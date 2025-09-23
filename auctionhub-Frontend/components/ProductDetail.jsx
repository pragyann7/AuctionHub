import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, Eye, AlertTriangle, ChevronRight, MessageSquareText, AlertCircle, ShieldCheck } from "lucide-react";
import ProductImagesSlider from "./ProductImageSlider";
import axiosInstance from "../API/axiosInstance";
import CountUp from "react-countup";

function ProductDetail() {
    const [product, setProduct] = useState(null);
    const [timeLeft, setTimeLeft] = useState("");
    const [wishlisted, setWishlisted] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchProduct() {
            try {
                const res = await axiosInstance.get(`/auctions/${id}/`);
                setProduct(res.data);
                setWishlisted(res.data.is_wishlisted);
            } catch (err) {
                console.error(err);
            }
        }
        fetchProduct();
    }, [id]);

    useEffect(() => {
        if (!product) return;

        const start = product.auction_start_datetime ? new Date(product.auction_start_datetime) : null;
        const end = product.auction_end_datetime ? new Date(product.auction_end_datetime) : null;
        const status = product.auction_status;

        function formatDiff(ms) {
            if (ms <= 0) return "0d 0h 0m 0s";
            const days = Math.floor(ms / (1000 * 60 * 60 * 24));
            const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((ms / (1000 * 60)) % 60);
            const seconds = Math.floor((ms / 1000) % 60);
            return `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }

        function updateCountdown() {
            const now = new Date();
            if (status === "upcoming" && start) {
                const diff = start - now;
                setTimeLeft(diff > 0 ? formatDiff(diff) : "Auction live");
            } else if (status === "live" && end) {
                const diff = end - now;
                setTimeLeft(diff > 0 ? formatDiff(diff) : "Auction ended");
            } else {
                setTimeLeft("Auction ended");
            }
        }

        updateCountdown();
        const timer = setInterval(updateCountdown, 1000);
        return () => clearInterval(timer);
    }, [product]);


    const toggleWishlist = async () => {
        try {
            if (wishlisted && product.wishlist_id) {
                await axiosInstance.delete(`/wishlist/${product.wishlist_id}/`);
                setProduct(prev => ({ ...prev, wishlist_id: null }));
            } else {
                const res = await axiosInstance.post("/wishlist/", { product: product.id });

                setProduct(prev => ({ ...prev, wishlist_id: res.data.id }));
            }
            setWishlisted(!wishlisted);
        } catch (err) {
            console.error(err);
        }
    };


    if (!product) return <p className="text-center mt-10">Loading product…</p>;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto lg:px-8">

                <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="absolute top-1 lg:top-5 lg:left-5 z-10 bg-red-400 px-4 rounded-2xl flex items-center text-white text-sm space-x-1">
                        <Eye className="w-4 h-4" />
                        <CountUp end={product.view_count} duration={5.5} separator="," />
                        <span>view</span>
                    </div>

                    <ProductImagesSlider images={product.images?.map(img => img.image)} name={product.name} />

                    <div className="lg:col-span-5 space-y-6 bg-white p-3 rounded-2xl">
                        <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>

                        <div className="cursor-pointer bg-white border-b border-gray-300/60 rounded-xl p-6 flex items-center justify-between" onClick={() => navigate(`/user/${product.seller_id}`)}>
                            <div className="flex items-center space-x-4 cursor-pointer">
                                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                                    {product.seller_profile_photo ? (
                                        <img src={product.seller_profile_photo} alt={product.seller_username} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-blue-300 flex items-center justify-center text-white font-bold">
                                            {product.seller_username?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 hover:underline">
                                        {product.seller_username ? product.seller_username.charAt(0).toUpperCase() + product.seller_username.slice(1) : 'User'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <MessageSquareText className="text-gray-600 hover:text-blue-500 cursor-pointer" />
                                <div className="hover:bg-gray-400/30 w-10 h-10 flex items-center justify-center rounded-3xl">
                                    <ChevronRight className="hidden lg:flex cursor-pointer" onClick={() => navigate(`/user/${product.seller_id}`)} />
                                </div>
                            </div>
                        </div>


                        <div className="bg-white rounded-xl shadow-lg p-6 pt-0 space-y-4">
                            <p className="text-gray-500 uppercase text-sm font-semibold">Current Bid</p>
                            <p className="text-4xl font-bold text-orange-500">${product.current_bid}</p>

                            {product.buy_now_price && (
                                <>
                                    <p className="text-gray-500 uppercase text-sm font-semibold">Buy it Now</p>
                                    <p className="text-4xl font-bold text-orange-500">${product.buy_now_price}</p>
                                </>
                            )}

                            <div className="flex justify-between">
                                <p className="underline underline-offset-3 text-gray-500">{product.bid_count || 0} bids till now</p>
                                <p className="text-sm text-gray-500 flex items-center justify-end gap-2">
                                    {product.auction_status === "upcoming" ? "Starts in" : "Ends in"}
                                    <span className="text-[18px] text-red-400">{timeLeft}</span>
                                </p>
                            </div>

                            <div className="flex items-center">
                                <p className="text-gray-500 text-[17px]">Condition:</p>
                                <p className="text-md text-gray-500 ml-7 lg:ml-10">{product.condition}</p>
                                <AlertCircle size={17} className="ml-1" />
                            </div>

                            <input
                                type="number"
                                placeholder="Place your bid"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                                disabled={product.auction_status === "ended"}
                            />
                            <button
                                className="w-full py-3 cursor-pointer bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={product.auction_status === "ended"}
                            >
                                Place Bid
                            </button>

                            <div className="flex space-x-2 mt-2">
                                <button
                                    className={`flex-1 py-2 cursor-pointer border border-gray-300 rounded-lg flex items-center justify-center ${wishlisted ? "text-red-500" : "hover:bg-gray-50"}`}
                                    onClick={toggleWishlist}
                                >
                                    <Heart
                                        className={`w-5 h-5 mr-2 ${wishlisted ? "text-red-500 fill-red-500" : "text-gray-600"}`}
                                    />
                                    {wishlisted ? "Watching" : "Watchlist"}
                                </button>

                                <button className="flex-1 py-2 cursor-pointer border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50">
                                    <AlertTriangle className="w-5 h-5 mr-2" /> Report
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg lg:flex lg:justify-between mt-6">
                    <div className="p-6 space-y-3 lg:w-1/2">
                        <div className="mb-9">
                            <h1 className="text-xl font-semibold">Description</h1>
                            <p className="text-gray-700">{product.description}</p>
                        </div>
                        <h2 className="text-2xl font-bold">About this item</h2>
                        <div className="flex justify-between">
                            <p className="text-md text-gray-500">Category:</p>
                            <p className="text-gray-700">{product.category}</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="text-md text-gray-500">Original Price:</p>
                            <p className="text-gray-700">${product.starting_price}</p>
                        </div> <div className="flex justify-between">
                            <p className="text-md text-gray-500">Condition:</p>
                            <p className="text-gray-700">{product.condition}</p>
                        </div>
                    </div>

                    <div className="p-6 space-y-4 lg:w-1/2">
                        <div className="flex justify-center mb-6">
                            <ShieldCheck size={39} className="text-green-500" />
                            <div className="flex flex-col ml-4">
                                <h1 className="text-2xl font-bold">Verified and Secure</h1>
                                <p className="text-sm">AuctionHub Money Back Guarantee</p>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold">Payment & Delivery</h2>
                        <div className="flex justify-between">
                            <p className="text-md text-gray-500">Shipping:</p>
                            <p className="text-gray-700">Available</p>
                        </div> <div className="flex justify-between">
                            <p className="text-md text-gray-500">Delivery:</p>
                            <p className="text-gray-700">{product.shipping_terms ?? '—'}</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="text-md text-gray-500">Returns:</p>
                            <p className="text-gray-700">{product.return_policy ?? '—'}</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="text-md text-gray-500">Payments:</p>
                            <p className="text-gray-700">{product.payment_terms ?? '—'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
