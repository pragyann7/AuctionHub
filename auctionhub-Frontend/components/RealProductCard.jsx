import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

export default function ProductCard({ product }) {
    const [timeLeft, setTimeLeft] = useState("");
    const [status, setStatus] = useState(product.auction_status);

    useEffect(() => {
        const start = product.auction_start_datetime
            ? new Date(product.auction_start_datetime)
            : null;
        const end = product.auction_end_datetime
            ? new Date(product.auction_end_datetime)
            : null;
        console.log('start:', product.auction_start_datetime, 'end:', product.auction_end_datetime);


        function formatDiff(ms) {
            const days = Math.floor(ms / (1000 * 60 * 60 * 24));
            const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((ms / (1000 * 60)) % 60);
            const seconds = Math.floor((ms / 1000) % 60);
            return `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }

        function updateCountdown() {
            const now = new Date();

            if (start && now < start) {
                setStatus("starts_in");
                setTimeLeft(formatDiff(start - now));
            } else if (end && now < end) {
                setStatus("ends_in");
                setTimeLeft(formatDiff(end - now));
            } else {
                setStatus("ended");
                setTimeLeft("Auction ended");
            }
        }

        updateCountdown();
        const timer = setInterval(updateCountdown, 1000);
        return () => clearInterval(timer);
    }, [product.auction_start_datetime, product.auction_end_datetime]);

    return (
        <div className="bg-white rounded-xl shadow hover:shadow-md transition p-4 flex flex-col">
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
            <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                {product.description}
            </p>

            <div className="flex justify-between items-center mb-4">
                <div>
                    <p className="text-md text-gray-500">Current Bid</p>
                    <p className="text-2xl font-bold">${product.current_bid}</p>
                </div>
                <div className="text-right">
                    {status !== "ended" ? (
                        <>
                            <p className="text-xs text-gray-500">
                                {status === "starts_in" ? "Starts in" : "Ends in"}
                            </p>
                            <p className="text-sm font-medium text-orange-600">{timeLeft}</p>
                        </>
                    ) : (
                        <p className="text-sm font-medium text-red-500">{timeLeft}</p>
                    )}
                </div>
            </div>

            <div className="flex justify-between items-center mt-auto">
                <button className="cursor-pointer bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                    Bid Now
                </button>
                <button className="flex items-center cursor-pointer gap-1 text-gray-600 hover:text-orange-500 transition text-sm">
                    <Heart size={16} /> Watchlist
                </button>
            </div>
        </div>
    );
}
