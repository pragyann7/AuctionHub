import React, {useState, useEffect, useRef} from "react";
import {useParams} from "react-router-dom";
import {Heart, Eye, AlertTriangle, ChevronRight, MessageSquareText, AlertCircle, ShieldCheck} from "lucide-react";
import ProductImagesSlider from "./ProductImageSlider";
import axiosInstance from "../API/axiosInstance";

function ProductDetail() {
    const {id} = useParams();
    const [product, setProduct] = useState(null);
    const [bidAmount, setBidAmount] = useState("");
    const [error, setError] = useState(null);
    const ws = useRef(null);
    const reconnectTimeout = useRef(null);
    const [isAuctionEnded, setIsAuctionEnded] = useState(false);
    useEffect(() => {
        if (isAuctionEnded && product?.winner_name) {
            alert(`Auction ended! Winner: ${product.winner_name}, Price: $${product.winner_final_price}`);
        }
    }, [isAuctionEnded, product?.winner_name]);

    // Fetch product data initially
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axiosInstance.get(`/auctions/${id}/`);
                setProduct({
                    ...response.data,
                    bids: (response.data.bids ?? []).slice().reverse(),
                    current_bid: response.data.current_bid ?? response.data.starting_price,
                    bid_increment: response.data.bid_increment ?? 0,
                    winner_name: response.data.winner_name ?? null,
                    winner_final_price: response.data.winner_final_price ?? null,
                });
                setIsAuctionEnded(response.data.auction_ended);
                setBidAmount(response.data.bid_increment?.toString() ?? "0");
            } catch (err) {
                console.error("Failed to fetch product:", err);
                setError("Failed to load product");
            }
        };
        fetchProduct();
    }, [id]);

    // WebSocket connection
    useEffect(() => {
        let isMounted = true;          // Track if component is mounted
        let manuallyClosed = false;    // Track if we closed WS intentionally
        const reconnectDelay = 3000;   // 3 seconds

        const connectWebSocket = () => {
            const token = localStorage.getItem("access");
            const protocol = window.location.protocol === "https:" ? "wss" : "ws";
            const backendHost = "localhost:8000"; // change if backend is hosted elsewhere
            const wsUrl = `${protocol}://${backendHost}/ws/auctions/${id}/?token=${encodeURIComponent(token)}`;

            ws.current = new WebSocket(wsUrl);

            ws.current.onopen = () => {
                console.log("WebSocket connected");
                if (reconnectTimeout.current) {
                    clearTimeout(reconnectTimeout.current);
                    reconnectTimeout.current = null;
                }
            };

            ws.current.onclose = () => {
                console.log("WebSocket disconnected");
                // Reconnect only if the component is still mounted and we didn't close manually
                if (isMounted && !manuallyClosed) {
                    reconnectTimeout.current = setTimeout(connectWebSocket, reconnectDelay);
                }
            };

            ws.current.onerror = (err) => {
                console.error("WebSocket error:", err);
                if (ws.current) ws.current.close();
                // Quick retry on error (avoid waiting full 3s if first connect fails)
                if (isMounted && !manuallyClosed && !reconnectTimeout.current) {
                    reconnectTimeout.current = setTimeout(connectWebSocket, 1000);
                }
            };

            ws.current.onmessage = (event) => {
                const data = JSON.parse(event.data);

                switch (data.type) {
                    case "state":
                        setProduct(prev => ({
                            ...prev,
                            current_bid: parseFloat(data.current_bid),
                            bids: data.bids.map(b => ({
                                user: b.user,
                                amount: parseFloat(b.amount),
                                total: parseFloat(b.total)
                            })),
                            winner_name: data.winner ?? prev.winner_name,
                            winner_final_price: data.winner_final_price ?? prev.current_bid,
                        }));
                        if (data.auction_ended) setIsAuctionEnded(true);
                        break;

                    case "update":
                        setProduct(prev => ({
                            ...prev,
                            current_bid: parseFloat(data.total_amount),
                            bids: [...(prev.bids || []), {
                                user: data.user,
                                amount: parseFloat(data.amount),
                                total: parseFloat(data.total_amount)
                            }]
                        }));
                        setError(null);
                        break;

                    case "end":
                        setIsAuctionEnded(true);
                        setProduct(prev => ({
                            ...prev,
                            winner_name: data.winner ?? prev.winner_name,
                            winner_final_price: data.final_price ?? prev.current_bid,
                        }));
                        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                            ws.current.close();
                            console.log("WebSocket closed for ended auction");
                        }
                        break;

                    case "error":
                        setError(data.message);
                        break;

                    default:
                        console.warn("Unknown WS message type:", data.type);
                }
            };
        };

        // Delay first connect a bit to avoid "interrupted while loading" error
        reconnectTimeout.current = setTimeout(connectWebSocket, 500);

        return () => {
            // Clean up on unmount
            isMounted = false;
            manuallyClosed = true;
            if (ws.current) ws.current.close();
            if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
        };
    }, [id]);


    const placeBid = () => {
        if (!product) return;

        if (isAuctionEnded) {
            setError("Auction has ended, you cannot bid anymore.");
            return;
        }

        const maxIncrement = parseFloat(product.bid_increment);
        const bid = parseFloat(bidAmount);

        if (isNaN(bid) || bid <= 0 || bid > maxIncrement) {
            setError(`Bid must be greater than 0 and less than or equal to $${maxIncrement}`);
            return;
        }

        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({action: "bid", amount: bid}));
            setBidAmount("");
            setError(null);
        } else {
            setError("WebSocket not connected. Retrying...");
        }
    };


    if (!product) return <p className="text-center mt-10">Loading product…</p>;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto lg:px-8">
                <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Views */}
                    <div
                        className="absolute top-1 lg:top-5 lg:left-5 z-10 bg-red-400 px-4 rounded-2xl flex items-center text-white text-sm space-x-1">
                        <Eye className="w-4 h-4"/>
                        <span>{product.views ?? 0} views</span>
                    </div>

                    <ProductImagesSlider
                        images={product.images?.map(img => img.image)}
                        name={product.name}
                    />

                    <div className="lg:col-span-5 space-y-6 bg-white p-3 rounded-2xl">
                        <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>

                        {/* Seller info */}
                        <div
                            className="cursor-pointer bg-white border-b border-gray-300/60 rounded-xl p-6 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div
                                    className="w-12 h-12 bg-blue-300 text-white rounded-full flex items-center justify-center">P
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">Hero</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <MessageSquareText className="text-gray-600 hover:text-blue-500 cursor-pointer"/>
                                <div
                                    className="hover:bg-gray-400/30 w-10 h-10 flex items-center justify-center rounded-3xl">
                                    <ChevronRight className="hidden lg:flex cursor-pointer"/>
                                </div>
                            </div>
                        </div>

                        {/* Bid section */}
                        <div className="bg-white rounded-xl shadow-lg p-6 pt-0 space-y-4">
                            <p className="text-gray-500 uppercase text-sm font-semibold">Current Bid</p>
                            <p className="text-4xl font-bold text-orange-500">
                                {/*${isAuctionEnded ? isWinningBid?.final_price : product.current_bid ?? product.starting_price}*/}
                                ${isAuctionEnded
                                ? (product.winner_final_price ?? product.current_bid)
                                : (product.current_bid ?? product.starting_price)}
                            </p>

                            {product.buy_now_price && (
                                <>
                                    <p className="text-gray-500 uppercase text-sm font-semibold">Buy it Now</p>
                                    <p className="text-4xl font-bold text-orange-500">${product.buy_now_price}</p>
                                </>
                            )}

                            {/* Bids count and time left */}
                            <div className="flex justify-between mt-2">
                                <p className="underline underline-offset-3 text-gray-500">{product.bids.length} bids
                                    till now</p>
                                <p className="text-sm text-gray-500 flex items-center justify-end gap-2">
                                    Ends in <span className="text-[18px] text-red-400">{product.time_left}</span>
                                </p>
                            </div>

                            <div className="flex items-center mt-1">
                                <p className="text-gray-500 text-[17px]">Condition:</p>
                                <p className="text-md text-gray-500 ml-7 lg:ml-10">{product.condition}</p>
                                <AlertCircle size={17} className="ml-1"/>
                            </div>

                            {!isAuctionEnded && (
                                <>
                                    <input
                                        type="number"
                                        placeholder={`Enter Bid (Max: $${product.bid_increment})`}
                                        value={bidAmount}
                                        min="0.01"
                                        max={product.bid_increment}
                                        step="0.01"
                                        onChange={e => setBidAmount(e.target.value)}
                                        disabled={isAuctionEnded} // <-- disabled if auction ended
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                                    />

                                    <p className="text-gray-500 text-sm mt-1">
                                        Maximum allowed bid: ${product.bid_increment}
                                    </p>


                                    <button
                                        onClick={placeBid}
                                        disabled={isAuctionEnded} // <-- disabled if auction ended
                                        className={`w-full py-3 font-semibold rounded-lg ${
                                            isAuctionEnded ? "bg-gray-400 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600 text-white"
                                        }`}
                                    >
                                        Place Bid
                                    </button>
                                </>
                            )}{/* Permanent winner display */}
                            {isAuctionEnded && product.winner_name && (
                                <div
                                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-center text-gray-700 mt-2">
                                    Winner: {product.winner_name}, Price:
                                    ${product.winner_final_price ?? product.current_bid}
                                </div>
                            )}


                            {error && <p className="text-red-500 mt-2">{error}</p>}

                            {/* Bid history */}
                            <div className="mt-4">
                                <h3 className="font-semibold text-gray-700">Bid History</h3>
                                <ul className="max-h-32 overflow-y-auto">
                                    {product.bids.map((b, idx) => (
                                        <li key={idx} className="text-gray-600">
                                            {b.user}: ${b.amount} (Total : ${b.total})
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description & Details */}
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
                        </div>
                        <div className="flex justify-between">
                            <p className="text-md text-gray-500">Condition:</p>
                            <p className="text-gray-700">{product.condition}</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="text-md text-gray-500">Brand:</p>
                            <p className="text-gray-700">KPS</p>
                        </div>
                    </div>

                    <div className="p-6 space-y-4 lg:w-1/2">
                        <div className="flex justify-center">
                            <ShieldCheck size={39} className="text-green-500"/>
                            <div className="flex flex-col mb-6">
                                <h1 className="text-2xl font-bold">Verified and Secure</h1>
                                <p className="text-sm">AuctionHub Money Back Guarantee</p>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold">Payment & Delivery</h2>
                        <div className="flex justify-between">
                            <p className="text-md text-gray-500">Shipping:</p>
                            <p className="text-gray-700">Available</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="text-md text-gray-500">Delivery:</p>
                            <p className="text-gray-700">{product.shipping_terms}</p>
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
