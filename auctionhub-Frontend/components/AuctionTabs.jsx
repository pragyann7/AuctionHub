import { useState } from "react";
import RealProductCard from "../components/RealProductCard";

export default function AuctionTabs({ auctions }) {
    const [tab, setTab] = useState("live");

    const tabs = [
        { key: "live", label: "Live" },
        { key: "upcoming", label: "Upcoming" },
        { key: "closed", label: "Closed" },
        { key: "featured", label: "Featured" },
    ];

    const now = new Date();

    const filteredAuctions = auctions.filter((a) => {
        const start = new Date(a.auction_start_datetime);
        const end = new Date(a.auction_end_datetime);

        switch (tab) {
            case "live":
                return start <= now && now <= end;
            case "upcoming":
                return now < start;
            case "closed":
                return now > end;
            case "featured":
                return a.is_featured === true;
            default:
                return false;
        }
    });

    return (
        <div>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAuctions.length > 0 ? (
                    filteredAuctions.map((a) => (
                        <RealProductCard key={a.id} product={a} />
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500">
                        No {tab} auctions found.
                    </p>
                )}
            </div>
        </div>
    );
}
