import React, { useState } from "react";
import { AiFillProduct } from "react-icons/ai";
import { ArrowRight, ImageUp, Eye, Package } from "lucide-react";
import ImageUploadLabel from "../ToolTips component/ImageUploadTT";
import SouthAsiaData from "../Resources/southAsiaData.json";
import courierOption from "../Resources/courierOption.json";


const AddProduct = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        // Step 1 - General
        name: "",
        description: "",
        category: "",
        condition: "",
        // Step 2 - Pricing
        startingPrice: "",
        buyNowPrice: "",
        bidIncrement: "",
        // Step 3 - Shipping
        shippingCost: "",
        shippingOptions: "",
        shippingCountry: "",
        shippingCity: "",
        shippingLocation: "",
        shippingEstimte: "",
        shippingHandling: "",
        courierOption: "",
        pickupPoint: "",
        // Step 4 - Terms
        returnPolicy: "",
        auctionTerms: "",
    });

    const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

    const handleCountryChange = (e) => {
        const countryCode = e.target.value;
        setFormData({
            ...formData,
            shippingCountry: countryCode,
            shippingCity: "", // reset district
            shippingLocation: "" // reset location
        });
    };

    const handleDistrictChange = (e) => {
        const districtCode = e.target.value;
        setFormData({
            ...formData,
            shippingCity: districtCode,
            shippingLocation: "" // reset location
        });
    };



    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Submitted:", formData);
        // Call API to submit product
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10 mb-10">
            <div className="flex items-center gap-2">
                <AiFillProduct className="text-5xl" />
                <h2 className="text-2xl font-medium" id="top">Add Product</h2>
            </div>
            <p className="mb-9 text-[15px] font-extralight">Add a new product for auction.</p>


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

                        <div
                            className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-light text-[19px]
          ${step >= num ? "bg-orange-500" : "bg-gray-300"}`}
                        >
                            {num}
                        </div>


                        <span
                            className={`mt-1 sm:mt-0 sm:ml-2 text-sm font-medium ${step === num ? "text-black" : "text-gray-600"
                                }`}
                        >
                            {label}
                        </span>


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


            <div className="border-0 p-6 rounded-[18px] flex justify-center">
                <form onSubmit={handleSubmit}>

                    {step === 1 && (
                        <div className="space-y-4">
                            {/* <div className=""> */}
                            <div className="flex flex-col">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Product Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full border px-3 py-3 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                                />
                                <span className="text-[10px] mt-1">Give your product a name.</span>
                            </div>

                            <div className="flex flex-col">
                                <textarea
                                    name="description"
                                    placeholder="Description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full border px-3 pb-7 mt-4 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                                />
                                <span className="text-[10px] mt-1">Give your product a description.</span>

                            </div>

                            <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-29 max-w-2xl mx-auto">
                                <div className="flex flex-col w-full md:w-auto mt-4 md:mb-4">
                                    <span>Category</span>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full md:w-48 border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                                    >
                                        <option value="">Select</option>
                                        <option value="electronics">Electronics</option>
                                        <option value="vehicles">Vehicles</option>
                                        <option value="art">Art & Collectibles</option>
                                        <option value="fashion">Fashion</option>
                                        <option value="sports">Sports & Outdoors</option>
                                    </select>
                                </div>

                                <div className="flex flex-col w-full md:w-auto">
                                    <span>Condition</span>
                                    <select
                                        name="condition"
                                        value={formData.condition}
                                        onChange={handleChange}
                                        className="w-full md:w-48 border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                                    >
                                        <option value="">Select</option>
                                        <option value="new">New</option>
                                        <option value="like-new">Like new</option>
                                        <option value="used">Used</option>
                                        <option value="refurbished">Refurbished</option>
                                    </select>
                                </div>
                            </div>
                            <div className="max-w-2xl mx-auto my-6">
                                <ImageUploadLabel />

                                <div className="flex flex-col md:min-h-50 items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-orange-500 transition relative">
                                    <div className="flex flex-col items-center">
                                        <ImageUp size={40} />
                                        <p className="text-gray-500 text-sm text-center">
                                            Drag & drop images here or click to select
                                        </p>
                                    </div>

                                    <input type="file" multiple accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                </div>

                                <span className="text-[10px] mt-1">Add images to your product.</span>


                                <div className="flex flex-col mt-4">
                                    <span className="flex items-center font-medium text-[14px] gap-x-0.5">
                                        Preview
                                        <Eye size={16} strokeWidth={1.25} />
                                    </span>
                                    <div className="mt-1 grid grid-cols-3 sm:grid-cols-4 gap-4">
                                        <div className="w-full h-32 bg-gray-100 rounded-md"></div>
                                        <div className="w-full h-32 bg-gray-100 rounded-md"></div>
                                        <div className="w-full h-32 bg-gray-100 rounded-md"></div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}

                    {/* Step 2: Pricing */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <div>
                                <span>Starting Price</span>
                                <input
                                    type="number"
                                    name="startingPrice"
                                    placeholder="$"
                                    value={formData.startingPrice}
                                    onChange={handleChange}
                                    className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                                />
                                <span className="text-[10px] mt-1">Give your product a starting bid.</span>

                            </div>
                            <div>
                                <span>Buy Now Price</span>

                                <input
                                    type="number"
                                    name="buyNowPrice"
                                    placeholder="$"
                                    value={formData.buyNowPrice}
                                    onChange={handleChange}
                                    className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                                />
                                <span className="text-[10px] mt-1">Minimum: 30% more than starting bid.</span>

                            </div>
                            <div>
                                <span>Bid Increment</span>

                                <input
                                    type="number"
                                    name="bidIncrement"
                                    placeholder="$"
                                    value={formData.bidIncrement}
                                    onChange={handleChange}
                                    className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                                />
                                <span className="text-[10px] mt-1">Minimum increment required for each new bid.</span>

                            </div>

                            <div className="border-1 border-gray-400 rounded-2xl mb-0 p-5 pb-9 flex flex-col md:flex-row justify-center items-center gap-4 md:gap-29 max-w-2xl mx-auto">
                                {/* Auction Duration */}
                                <div className="flex flex-col w-full md:w-auto">
                                    <label className="mb-1 font-medium">Auction Duration</label>
                                    <select
                                        name="auctionDuration"
                                        value={formData.auctionDuration}
                                        onChange={handleChange}
                                        className="w-full md:w-48 border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                                    >
                                        <option value="">Select</option>
                                        <option value="3day">3 day</option>
                                        <option value="4day">4 day</option>
                                        <option value="5day">5 day</option>
                                        <option value="7day">7 day</option>
                                    </select>
                                </div>

                                {/* Auction Start Date & Time */}
                                <div className="flex flex-col w-full md:w-auto">
                                    <label className="mb-1 font-medium">Auction Start Date & Time</label>
                                    <input
                                        type="datetime-local"
                                        name="auctionStart"
                                        value={formData.auctionStart}
                                        onChange={handleChange}
                                        className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col mt-2 mb-12">

                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="relist"
                                        className="w-4 h-4 accent-orange-500 cursor-pointer"
                                    />
                                    <span className="font-medium select-none">Auto relist</span>
                                </label>

                                <span className="ml-6 text-xs text-gray-500">
                                    Automatically relist this item up to 8 times if it doesn’t sell.
                                </span>
                            </div>



                        </div>
                    )}



                    {/* Step 3: Shipping */}
                    {step === 3 && (
                        <div>
                            <div className="flex justify-center mb-5">
                                {/* <Ship size={100} strokeWidth={0.75} /> */}
                                <Package size={100} strokeWidth={0.75} />
                            </div>
                            <div className="space-y-4">
                                <div className="flex flex-col md:flex-row md:gap-50">
                                    <div className="flex flex-col">
                                        <label>Shipping Options</label>
                                        <select
                                            name="shippingOptions"
                                            value={formData.shippingOptions}
                                            onChange={handleChange}
                                            className="w-full md:w-48 border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                                        >
                                            <option value="">Select</option>
                                            <option value="free">Free Ship</option>
                                            <option value="paid">Paid Ship</option>
                                            <option value="pickup">Pick up</option>
                                        </select>
                                    </div>
                                    <label className="text-2xl mt-7 md:mt-3">Shipping Location</label>
                                </div>
                                <div className="flex flex-col md:flex-row md:gap-45">
                                    <div className="flex flex-col">
                                        <label>Shipping Cost</label>
                                        <input
                                            type="number"
                                            name="shippingCost"
                                            placeholder="Shipping Cost"
                                            value={
                                                formData.shippingOptions === "free" || formData.shippingOptions === "pickup" ? "" : formData.shippingCost
                                            }
                                            onChange={handleChange}
                                            disabled={formData.shippingOptions === "free" || formData.shippingOptions === "pickup"}
                                            className={`w-full mb-4 md:mb-0 border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 ${formData.shippingOptions === "free" || formData.shippingOptions === "pickup" ? "bg-gray-100 border-0 cursor-not-allowed" : ""}`}
                                        />

                                    </div>
                                    <div className="flex flex-col">
                                        <label>Country</label>
                                        <select
                                            name="shippingCountry"
                                            value={formData.shippingCountry}
                                            onChange={handleCountryChange}
                                            className="w-full md:w-48 border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                                        >
                                            <option value="">Select Country</option>
                                            {SouthAsiaData.map((c) => (
                                                <option key={c.code} value={c.code}>
                                                    {c.name}
                                                </option>
                                            ))}
                                        </select>

                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row md:gap-53">
                                    <div className="flex flex-col">
                                        <label>Handling Time</label>
                                        <select
                                            name="shippingHandling"
                                            value={formData.shippingHandling}
                                            onChange={handleChange}
                                            className="w-full md:w-48 border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                                        >
                                            <option value="">Select</option>
                                            <option value="3day">3 day</option>
                                            <option value="4day">4 day</option>
                                            <option value="5day">5 day</option>
                                            <option value="7day">7 day</option>
                                        </select>

                                    </div>

                                    <div className="flex flex-col">
                                        <label>District</label>
                                        <select
                                            name="shippingCity"
                                            value={formData.shippingCity}
                                            onChange={handleDistrictChange}
                                            className="w-full md:w-48 border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                                        >
                                            <option value="">Select District</option>
                                            {SouthAsiaData.find((c) => c.code === formData.shippingCountry)?.districts.map(
                                                (d) => (
                                                    <option key={d.code} value={d.code}>
                                                        {d.name}
                                                    </option>
                                                )
                                            )}
                                        </select>

                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row md:gap-53">
                                    <div className="flex flex-col">
                                        <label>Estimated Delivery Time</label>
                                        <select
                                            name="shippingEstimte"
                                            value={formData.shippingEstimte}
                                            onChange={handleChange}
                                            className="w-full md:w-48 border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                                        >
                                            <option value="">Select</option>
                                            <option value="3day">3 day</option>
                                            <option value="4day">4 day</option>
                                            <option value="5day">5 day</option>
                                            <option value="7day">7 day</option>
                                        </select>
                                    </div>

                                    <div className="flex flex-col">
                                        <label>Delivery Location</label>
                                        <select
                                            name="shippingLocation"
                                            value={formData.shippingLocation}
                                            onChange={handleChange}
                                            className="w-full md:w-48 border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                                        >
                                            <option value="">Select Location</option>
                                            {SouthAsiaData.find((c) => c.code === formData.shippingCountry)
                                                ?.districts.find((d) => d.code === formData.shippingCity)
                                                ?.locations.map((loc, i) => (
                                                    <option key={i} value={loc}>
                                                        {loc}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row md:gap-53">
                                    <div className="flex flex-col">
                                        <label>Courier Option</label>
                                        <select
                                            name="courierOption"
                                            value={formData.courierOption}
                                            onChange={handleChange}
                                            className="w-full md:w-48 border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                                        >
                                            <option value="">Select</option>
                                            {courierOption.map((c) => (
                                                <option key={c.code} value={c.code}>
                                                    {c.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex flex-col mb-12">
                                        <label>PickUp Point</label>
                                        <select
                                            name="pickupPoint"
                                            value={formData.pickupPoint}
                                            onChange={handleChange}
                                            className="w-full md:w-48 border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                                        >
                                            <option value="">Select</option>
                                            <option value="home">Home</option>
                                            <option value="office">Office</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
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
                            <textarea
                                name="paymentTerms"
                                placeholder="Payment Terms"
                                value={formData.paymentTerms}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                            />
                            <textarea
                                name="shippingTerms"
                                placeholder="Shipping Terms"
                                value={formData.shippingTerms}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                            />
                            <div className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    id="warrantyCheckbox"
                                    checked={formData.hasWarranty}
                                    onChange={(e) =>
                                        setFormData({ ...formData, hasWarranty: e.target.checked })
                                    }
                                    className="cursor-pointer"
                                />
                                <label htmlFor="warrantyCheckbox" className="ml-1 cursor-pointer">
                                    Warranty / Guarantee
                                </label>
                            </div>

                            <textarea
                                name="warrantyTerms"
                                placeholder="Specify term here"
                                value={formData.warrantyTerms}
                                onChange={handleChange}
                                disabled={!formData.hasWarranty}
                                className={`w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500${!formData.hasWarranty ? "bg-gray-100 border-0 cursor-not-allowed" : ""}`}
                            ></textarea>

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
