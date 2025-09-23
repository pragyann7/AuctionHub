import { useState, useEffect, useCallback } from "react";
import { Search, Filter, Grid, List, X, ChevronsUp } from "lucide-react";
import RealProductCard from "./RealProductCard";
import ProductList from "./ProductList";
import axiosInstance from "../API/axiosInstance";
import debounce from "lodash.debounce";

export default function Browse() {
    const [viewMode, setViewMode] = useState("grid");
    const [showSidebar, setShowSidebar] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [skeletonCount, setSkeletonCount] = useState(9);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedConditions, setSelectedConditions] = useState([]);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(9999);

    const categories = ["Electronics", "Vehicles", "Art & Collectibles", "Fashion", "Sports & Outdoors"];
    const conditions = ["New", "Used", "Refurbished"];

    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 500) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);



    useEffect(() => {
        const updateSkeletonCount = () => {
            if (window.innerWidth < 768) setSkeletonCount(2);
            else setSkeletonCount(9);
        };

        updateSkeletonCount();
        window.addEventListener("resize", updateSkeletonCount);
        return () => window.removeEventListener("resize", updateSkeletonCount);
    }, []);


    // Build query string for API
    const buildQueryParams = () => {
        const params = new URLSearchParams();
        if (searchQuery) params.append("search", searchQuery);
        if (selectedCategories.length) params.append("category", selectedCategories.join(","));
        if (selectedConditions.length) params.append("condition", selectedConditions.join(","));
        params.append("min_price", minPrice);
        params.append("max_price", maxPrice);
        return params.toString();
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const query = buildQueryParams();
            const res = await axiosInstance.get(`/AFauctions/?${query}`);
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const debouncedFetch = useCallback(debounce(fetchProducts, 500), [
        searchQuery,
        selectedCategories,
        selectedConditions,
        minPrice,
        maxPrice,
    ]);

    useEffect(() => {
        debouncedFetch();
        return debouncedFetch.cancel;
    }, [searchQuery, selectedCategories, selectedConditions, minPrice, maxPrice, debouncedFetch]);

    useEffect(() => {
        document.body.style.overflow = showSidebar ? "hidden" : "auto";
        return () => (document.body.style.overflow = "auto");
    }, [showSidebar]);

    return (
        <div className="flex w-full">
            {/* Sidebar */}
            <aside className="hidden md:block w-64 h-screen sticky top-0 border-r border-gray-500/20 px-4 py-6 overflow-y-auto">
                <FiltersSidebar
                    categories={categories}
                    conditions={conditions}
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                    selectedConditions={selectedConditions}
                    setSelectedConditions={setSelectedConditions}
                    minPrice={minPrice}
                    setMinPrice={setMinPrice}
                    maxPrice={maxPrice}
                    setMaxPrice={setMaxPrice}
                />
            </aside>

            {/* Mobile sidebar */}
            {showSidebar && (
                <div className="fixed inset-0 bg-white/30 backdrop-blur-[4px] z-50 md:hidden">
                    <div className="absolute top-0 left-0 w-64 h-full bg-white shadow-lg p-4 overflow-y-auto z-50">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-semibold">Filters</h2>
                            <X size={20} className="cursor-pointer" onClick={() => setShowSidebar(false)} />
                        </div>
                        <FiltersSidebar
                            categories={categories}
                            conditions={conditions}
                            selectedCategories={selectedCategories}
                            setSelectedCategories={setSelectedCategories}
                            selectedConditions={selectedConditions}
                            setSelectedConditions={setSelectedConditions}
                            minPrice={minPrice}
                            setMinPrice={setMinPrice}
                            maxPrice={maxPrice}
                            setMaxPrice={setMaxPrice}
                        />
                    </div>
                </div>
            )}

            {/* Main */}
            <main className="flex-1 p-4 md:p-6 overflow-y-auto">
                {/* Search & view toggle */}
                <div className="flex justify-between items-center mb-6">
                    <button
                        className="flex items-center gap-1 border px-3 py-2 rounded-md text-sm hover:bg-gray-50 md:hidden"
                        onClick={() => setShowSidebar(true)}
                    >
                        <Filter size={16} /> Filters
                    </button>

                    <div className="relative ml-2 md:ml-0 w-full md:w-1/3">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-8 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-orange-500 focus:ring focus:ring-orange-500 shadow-sm placeholder-gray-400 text-sm transition"
                        />

                        {/* Search icon */}
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

                        {/* Clear button */}
                        {searchQuery && (
                            <button
                                className="absolute right-4 top-1/2 cursor-pointer -translate-y-1/2 text-red-400 hover:text-red-600"
                                onClick={() => setSearchQuery("")}
                            >
                                clear
                            </button>
                        )}
                    </div>


                    <div className="hidden md:flex items-center gap-2 mr-4">
                        <Grid
                            size={20}
                            className={`cursor-pointer ${viewMode === "grid" ? "text-orange-500" : "text-gray-400"}`}
                            onClick={() => setViewMode("grid")}
                        />
                        <List
                            size={20}
                            className={`cursor-pointer ${viewMode === "list" ? "text-orange-500" : "text-gray-400"}`}
                            onClick={() => setViewMode("list")}
                        />
                    </div>
                </div>

                {/* Products */}
                {loading ? (
                    viewMode === "grid" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(skeletonCount)].map((_, idx) => (
                                <ProductSkeleton key={idx} viewMode="grid" />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {[...Array(skeletonCount)].map((_, idx) => (
                                <ProductSkeleton key={idx} viewMode="list" />
                            ))}
                        </div>
                    )
                ) : products.length === 0 ? (
                    <p className="text-center mt-10 text-gray-500">No products found.</p>
                ) : viewMode === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <RealProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {products.map((product) => (
                            <ProductList key={product.id} product={product} />
                        ))}
                    </div>
                )}
                {showScrollTop && (
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        className="fixed bottom-6 right-6 p-3 rounded-full bg-orange-500/70 text-white shadow-lg hover:bg-orange-600 cursor-pointer transition"
                    >
                        <ChevronsUp className="cursor-pointer" />
                    </button>
                )}


            </main>
        </div>
    );
}

// Filters Sidebar Component
function FiltersSidebar({
    categories,
    conditions,
    selectedCategories,
    setSelectedCategories,
    selectedConditions,
    setSelectedConditions,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
}) {
    const toggleCategory = (cat) =>
        setSelectedCategories((prev) =>
            prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
        );

    const toggleCondition = (cond) =>
        setSelectedConditions((prev) =>
            prev.includes(cond) ? prev.filter((c) => c !== cond) : [...prev, cond]
        );

    return (
        <div>
            <h2 className="font-semibold mb-2">Categories</h2>
            {categories.map((cat) => (
                <label key={cat} className="flex items-center space-x-2 text-sm mb-1">
                    <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => toggleCategory(cat)}
                        className="accent-orange-500"
                    />
                    <span>{cat}</span>
                </label>
            ))}

            <h2 className="font-semibold mt-4 mb-2">Condition</h2>
            {conditions.map((cond) => (
                <label key={cond} className="flex items-center space-x-2 text-sm mb-1">
                    <input
                        type="checkbox"
                        checked={selectedConditions.includes(cond)}
                        onChange={() => toggleCondition(cond)}
                        className="accent-orange-500"
                    />
                    <span>{cond}</span>
                </label>
            ))}

            <h2 className="font-semibold mt-4 mb-2">Price Range</h2>
            <div className="flex gap-2 items-center">
                <input
                    type="number"
                    min="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    className="w-1/2 border border-gray-400 rounded px-2 py-1 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"

                />
                <input
                    type="number"
                    min="0"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-1/2 border border-gray-400 rounded px-2 py-1 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
            </div>
            <p className="text-xs mt-1">${minPrice} - ${maxPrice}</p>
        </div>
    );
}

function ProductSkeleton({ viewMode = "grid" }) {
    if (viewMode === "grid") {
        return (
            <div className="rounded-lg p-4 animate-pulse flex flex-col gap-2">
                <div className="bg-gray-300 h-40 w-full rounded"></div>
                <div className="bg-gray-300 h-4 w-3/4 rounded"></div>
                <div className="bg-gray-300 h-4 w-1/2 rounded"></div>
            </div>
        );
    } else {
        return (
            <div className="rounded-lg p-4 flex gap-4 animate-pulse">
                <div className="bg-gray-300 h-24 w-24 rounded"></div>
                <div className="flex-1 flex flex-col gap-2">
                    <div className="bg-gray-300 h-4 w-3/4 rounded"></div>
                    <div className="bg-gray-300 h-4 w-1/2 rounded"></div>
                    <div className="bg-gray-300 h-4 w-1/4 rounded"></div>
                </div>
            </div>
        );
    }
}
