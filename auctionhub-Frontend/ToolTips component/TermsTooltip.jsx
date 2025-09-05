import { useState } from "react";
import { CircleAlert } from "lucide-react";

function TermsTooltip() {
    const [show, setShow] = useState(false);

    return (
        <div className="flex items-center gap-2 mb-4 relative">
            <h2 className="text-lg font-semibold">Terms & Conditions</h2>
            <span
                className="text-gray-400 cursor-pointer relative"
                onClick={() => setShow(!show)}
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
            >
                <CircleAlert size={20} strokeWidth={1.25} />

                {/* Tooltip */}
                <div
                    className={`absolute z-50 p-3 bg-gray-800 text-white text-xs rounded-md shadow-lg transition-opacity duration-200
            ${show ? "opacity-100" : "opacity-0 pointer-events-none"}
            w-72 md:w-80
            md:left-full md:top-1/2 md:transform md:-translate-y-1/2 md:ml-2
            left-1/2 -translate-x-1/2 top-full mt-2
          `}
                >
                    <p className="font-semibold mb-2">Examples for each field:</p>
                    <ul className="list-disc list-inside space-y-1 max-h-60 overflow-y-auto">
                        <li><strong>Return Policy:</strong> How many days? Who pays shipping?</li>
                        <li><strong>Auction Terms:</strong> Mention binding bids, no cancellations.</li>
                        <li><strong>Payment Terms:</strong> Accepted methods + deadline.</li>
                        <li><strong>Shipping Terms:</strong> Courier, handling time, delays.</li>
                        <li><strong>Warranty:</strong> Duration & coverage details.</li>
                    </ul>
                </div>
            </span>
        </div>
    );
}

export default TermsTooltip;
