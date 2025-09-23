import { useEffect, useState, useContext } from "react";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import axiosInstance from "../API/axiosInstance";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function ProductCard({ product }) {
    const [timeLeft, setTimeLeft] = useState("");
    const status = product.auction_status;
    const [wishlisted, setWishlisted] = useState(product.is_wishlisted);
    const [wishlistId, setWishlistId] = useState(product.wishlist_id || null);
    const navigate = useNavigate();
    const { currentUser, refreshUser } = useContext(AuthContext);

    useEffect(() => {
        const start = product.auction_start_datetime ? new Date(product.auction_start_datetime) : null;
        const end = product.auction_end_datetime ? new Date(product.auction_end_datetime) : null;

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
    }, [product, status]);

    const handleWishlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            if (wishlisted && wishlistId) {
                await axiosInstance.delete(`/wishlist/${wishlistId}/`);
                setWishlistId(null);
            } else {
                const res = await axiosInstance.post("/wishlist/", { product: product.id });
                setWishlistId(res.data.id);
            }
            setWishlisted(!wishlisted);

            if (refreshUser) refreshUser();
        } catch (err) {
            console.error(err);
        }
    };

    const handleLink = () => {
        navigate(`/products/${product.id}`);
    }

    return (
        <div className="bg-white rounded-xl shadow hover:shadow-md transition p-4 flex flex-col">
            <Link to={`/products/${product.id}`} className="block mb-2">
                <div className="relative w-full h-48 mb-4">
                    <img
                        src={
                            product.images?.length > 0
                                ? product.images[0].image
                                : product.default_image_url || "/default-product.png"
                        }
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                    />
                    {product.condition && (
                        <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                            {product.condition}
                        </span>
                    )}
                </div>

                <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>

                <div className="flex justify-between items-center mb-4">
                    <div>
                        <p className="text-md text-gray-500">Current Bid</p>
                        <p className="text-2xl font-bold">${product.current_bid}</p>
                    </div>
                    <div className="text-right">
                        {status !== "ended" ? (
                            <>
                                <p className="text-xs text-gray-500">{status === "upcoming" ? "Starts in" : "Ends in"}</p>
                                <p className="text-sm font-medium text-orange-600">{timeLeft}</p>
                            </>
                        ) : (
                            <p className="text-sm font-medium text-red-500">{timeLeft}</p>
                        )}
                    </div>
                </div>
            </Link>

            <div className="flex justify-between items-center mt-auto">
                <button className="cursor-pointer bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                    onClick={handleLink}>
                    Bid Now
                </button>

                <button
                    onClick={handleWishlist}
                    className={`flex items-center cursor-pointer gap-1 text-sm ${wishlisted ? "text-red-500" : "text-gray-600 hover:text-orange-500"}`}
                >
                    <Heart
                        size={16}
                        fill={wishlisted ? "red" : "none"}
                        className={wishlisted ? "text-red-500" : "text-gray-600"}
                    />
                    {wishlisted ? "Watching" : "Watchlist"}
                </button>

            </div>
        </div>
    );
}
