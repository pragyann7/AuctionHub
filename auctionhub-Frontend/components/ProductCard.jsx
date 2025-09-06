import { Heart } from "lucide-react";

export default function ProductCard({ product }) {
    return (
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
                    <p className="text-lg font-bold">${product.currentBid}</p>
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
                <button className="flex items-center cursor-pointer gap-1 text-gray-600 hover:text-orange-500 transition text-sm">
                    <Heart size={16} /> Watchlist
                </button>
            </div>
        </div >
    );
}
