import { Heart, Eye } from "lucide-react";

export default function ProductCardList({ product }) {
    return (
        <div className="bg-white rounded-xl shadow hover:shadow-md transition p-4 flex flex-col md:flex-row gap-4">
            {/* Product Image */}
            <div className="relative w-full md:w-48 h-48 flex-shrink-0">
                <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover rounded-lg"
                />
                {/* Condition Badge */}
                <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    {product.condition}
                </span>
            </div>

            {/* Product Details */}
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="text-lg font-semibold mb-1">{product.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">{product.description}</p>

                    {/* Current Bid + Timer */}
                    <div className="flex justify-between items-center mb-2 md:mb-4">
                        <div>
                            <p className="text-xs text-gray-500">Current Bid</p>
                            <p className="text-2xl font-medium">${product.currentBid}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Ends in</p>
                            <p className="text-2xl font-medium text-orange-600">{product.timeLeft}</p>
                        </div>
                    </div>

                    {/* Optional Stats */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                        <span className="flex items-center gap-1">
                            <Eye size={14} /> {product.views}
                        </span>
                        <span className="flex items-center gap-1">
                            <Heart size={14} /> {product.watchlist}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-2 ml-auto md:mt-0">
                    <button className="flex bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition  cursor-pointer">
                        Bid Now
                    </button>
                    <button className="flex items-center gap-1 text-gray-600 hover:text-orange-500 transition text-sm  cursor-pointer">
                        <Heart size={16} /> Watchlist
                    </button>
                </div>
            </div>
        </div>
    );
}
