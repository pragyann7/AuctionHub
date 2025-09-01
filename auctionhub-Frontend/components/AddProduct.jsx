import React, { useState } from "react";
import { AiFillProduct } from "react-icons/ai";
import { ArrowRight } from "lucide-react";

const AddProduct = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        // Step 1 - General
        name: "",
        description: "",
        category: "",
        // Step 2 - Pricing
        startingPrice: "",
        buyNowPrice: "",
        bidIncrement: "",
        // Step 3 - Shipping
        weight: "",
        dimensions: "",
        shippingOptions: "",
        // Step 4 - Terms
        returnPolicy: "",
        auctionTerms: "",
    });

    const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Submitted:", formData);
        // Call API to submit product
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
            <div className="flex items-center gap-2">
                <AiFillProduct className="text-5xl" />
                <h2 className="text-2xl font-medium">Add Product</h2>
            </div>
            <p className="mb-9 text-[15px] font-extralight">Add a new product for auction.</p>

            {/* Step Indicator */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 mb-6">
                {[
                    { num: 1, label: "General" },
                    { num: 2, label: "Pricing" },
                    { num: 3, label: "Shipping" },
                    { num: 4, label: "Terms" },
                ].map(({ num, label }) => (
                    <div
                        key={num}
                        className="flex flex-col items-center gap-1 sm:flex-row sm:items-center"
                    >
                        {/* Circle */}
                        <div
                            className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-light text-[19px]
          ${step >= num ? "bg-orange-500" : "bg-gray-300"}`}
                        >
                            {num}
                        </div>

                        {/* Label */}
                        <span
                            className={`mt-1 sm:mt-0 sm:ml-2 text-sm font-medium ${step === num ? "text-black" : "text-gray-600"
                                }`}
                        >
                            {label}
                        </span>

                        {/* Arrow (hidden on small screens) */}
                        {num !== 4 && (
                            <ArrowRight
                                size={20}
                                strokeWidth={0.5}
                                className="hidden md:inline ml-2"
                                style={{ transform: "scaleX(1.5)" }}
                            />
                        )}
                    </div>
                ))}
            </div>


            <div className="border-1 p-6 rounded-[18px]">
                <form onSubmit={handleSubmit}>
                    {/* Step 1: General */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <input
                                type="text"
                                name="name"
                                placeholder="Product Name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                            />
                            <textarea
                                name="description"
                                placeholder="Description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                            />
                            <input
                                type="text"
                                name="category"
                                placeholder="Category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                            />
                        </div>
                    )}

                    {/* Step 2: Pricing */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <input
                                type="number"
                                name="startingPrice"
                                placeholder="Starting Price"
                                value={formData.startingPrice}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                            />
                            <input
                                type="number"
                                name="buyNowPrice"
                                placeholder="Buy Now Price"
                                value={formData.buyNowPrice}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                            />
                            <input
                                type="number"
                                name="bidIncrement"
                                placeholder="Bid Increment"
                                value={formData.bidIncrement}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                            />
                        </div>
                    )}

                    {/* Step 3: Shipping */}
                    {step === 3 && (
                        <div className="space-y-4">
                            <input
                                type="text"
                                name="weight"
                                placeholder="Weight"
                                value={formData.weight}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                            />
                            <input
                                type="text"
                                name="dimensions"
                                placeholder="Dimensions"
                                value={formData.dimensions}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                            />
                            <input
                                type="text"
                                name="shippingOptions"
                                placeholder="Shipping Options"
                                value={formData.shippingOptions}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                            />
                        </div>
                    )}

                    {/* Step 4: Terms */}
                    {step === 4 && (
                        <div className="space-y-4">
                            <textarea
                                name="returnPolicy"
                                placeholder="Return Policy"
                                value={formData.returnPolicy}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                            />
                            <textarea
                                name="auctionTerms"
                                placeholder="Auction Terms"
                                value={formData.auctionTerms}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                            />
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-6">
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={prevStep}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                            >
                                Back
                            </button>
                        )}
                        {step < 4 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="ml-auto px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="ml-auto px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                            >
                                Submit
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
