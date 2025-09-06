import { useState } from "react";
import ProductCard from "./ProductCard";

export default function AuctionTabs({ auctions }) {
    const [tab, setTab] = useState("live");

    const tabs = [
        { key: "live", label: "Live" },
        { key: "upcoming", label: "Upcoming" },
        { key: "closed", label: "Closed" },
    ];

    return (
        <div>
            {/* Tabs */}
            {/* <label className=" text-7xl font-bold mb-2">Auction</label> */}
            <div className="flex justify-center gap-6 mb-6">
                {tabs.map((t) => (
                    <button
                        key={t.key}
                        className={`pb-2 px-4 cursor-pointer transition ${tab === t.key
                            ? "border-b-2 border-orange-500 font-bold text-orange-600"
                            : "text-gray-600 hover:text-black"
                            }`}
                        onClick={() => setTab(t.key)}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Auction Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {auctions
                    .filter((a) => a.status === tab)
                    .map((a) => (
                        <ProductCard key={a.id} product={a} />
                    ))}
            </div>
        </div>
    );
}
