import React, { useState, useEffect } from "react";
import img1 from "../Resources/img/james-zwadlo-hpZh7Pvs9mk-unsplash.jpg"
import img2 from "../Resources/img/clem-onojeghuo-pTeZKi29EYE-unsplash.jpg"
import img3 from "../Resources/img/erwan-hesry-Q34YB7yjAxA-unsplash.jpg"

const slides = [
    {
        image: img1,
        title: "Welcome to AuctionHub",
    },
    {
        image: img2,
        title: "Bid on amazing products",
    },
    {
        image: img3,
        title: "Sell to thousands of buyers",
    },
];

const AutoCarouselStatic = ({ interval = 3000 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentIndex((prev) =>
                prev === slides.length - 1 ? 0 : prev + 1
            );
        }, interval);

        return () => clearInterval(slideInterval);
    }, [interval]);

    return (
        <div className="relative w-full h-64 md:h-96 overflow-hidden shadow-lg">

            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ease-in-out ${index === currentIndex ? "opacity-100" : "opacity-0"
                        }`}
                >
                    <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <h2 className="text-white text-2xl md:text-4xl font-bold">
                            {slide.title}
                        </h2>
                    </div>
                </div>
            ))}


            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`h-2 w-2 rounded-full transition-all ${currentIndex === index ? "bg-white w-4" : "bg-white/50"
                            }`}
                    ></button>
                ))}
            </div>
        </div>
    );
};

export default AutoCarouselStatic;
