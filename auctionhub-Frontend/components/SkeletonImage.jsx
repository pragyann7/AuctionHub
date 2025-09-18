import React, { useState } from "react";

export default function SkeletonImage({ src, alt, className }) {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className="relative w-full h-full">
            {/* shimmer placeholder */}
            {!loaded && (
                <div className="absolute inset-0 animate-pulse bg-gray-200 rounded-xl" />
            )}

            <img
                src={src}
                alt={alt}
                className={`${className} ${loaded ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
                onLoad={() => setLoaded(true)}
            />
        </div>
    );
}
