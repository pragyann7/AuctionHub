import React, { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SkeletonImage from "./SkeletonImage"; // from previous step

export default function ProductImagesSlider({ images, name }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollRef = useRef(null);

    const handleScroll = () => {
        if (!scrollRef.current) return;
        const scrollLeft = scrollRef.current.scrollLeft;
        const width = scrollRef.current.clientWidth;
        const idx = Math.round(scrollLeft / width);
        setActiveIndex(idx);
    };

    const prevDesktopImage = () =>
        setActiveIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));

    const nextDesktopImage = () =>
        setActiveIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));

    return (
        <div className="lg:col-span-7 w-full lg:bg-white rounded-xl lg:shadow-lg lg:p-4">
            {/* Desktop */}
            <div className="hidden lg:block relative">
                {/* fixed-height container */}
                <div className="relative w-full h-[500px] bg-gray-50 flex items-center justify-center rounded-xl">
                    <SkeletonImage
                        src={images[activeIndex]}
                        alt={name}
                        className="w-full h-full object-contain rounded-xl"
                    />
                </div>

                {/* prev / next buttons */}
                <button
                    onClick={prevDesktopImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 cursor-pointer"
                >
                    <ChevronLeft size={24} />
                </button>

                <button
                    onClick={nextDesktopImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 cursor-pointer"
                >
                    <ChevronRight size={24} />
                </button>

                {/* thumbnails */}
                <div className="flex mt-4 space-x-2">
                    {images.map((img, idx) => (
                        <div
                            key={idx}
                            className={`w-20 h-20 rounded-lg overflow-hidden cursor-pointer ${idx === activeIndex
                                ? "ring-2 ring-orange-500"
                                : "hover:ring-1 hover:ring-orange-500"
                                }`}
                            onClick={() => setActiveIndex(idx)}
                        >
                            <SkeletonImage
                                src={img}
                                alt={`Thumbnail ${idx + 1}`}
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile */}
            <div
                className="lg:hidden flex overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide w-full"
                ref={scrollRef}
                onScroll={handleScroll}
            >
                {images.map((img, idx) => (
                    <div key={idx} className="flex-shrink-0 w-full snap-center">
                        {/* same fixed-height container */}
                        <div className="h-[300px] bg-gray-50 flex items-center justify-center">
                            <SkeletonImage
                                src={img}
                                alt={`Slide ${idx + 1}`}
                                className="w-full object-contain"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* indicators */}
            <div className="lg:hidden flex justify-center space-x-2">
                {images.map((_, idx) => (
                    <span
                        key={idx}
                        className={`w-2 h-2 rounded-full ${idx === activeIndex ? "bg-orange-500" : "bg-gray-300"
                            }`}
                    ></span>
                ))}
            </div>
        </div>
    );
}
