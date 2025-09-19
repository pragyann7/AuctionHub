import { useState, useEffect } from "react";
import { Search, Filter, Grid, List, Eye, Heart, X } from "lucide-react";
// import products from "../Resources/products.json";
import ProductCard from "../notUsedComponent/ProductCard";
import ProductList from "./ProductList";
import RealProductCard from "./RealProductCard";
import axiosInstance from "../API/axiosInstance";


export default function Browse() {
    const [viewMode, setViewMode] = useState("grid");
    const [showSidebar, setShowSidebar] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axiosInstance.get("/AFauctions/");
                setProducts(res.data);
            } catch (err) {
                console.error("Error fetching products:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        if (showSidebar) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [showSidebar]);

    return (
        <div className="flex w-full">

            <aside className="hidden md:block w-64 h-screen sticky top-0 border-r border-gray-500/20 px-4 py-6 overflow-y-auto">
                <SidebarContent />
            </aside>



            {showSidebar && (
                <div className="fixed inset-0 bg-transparent bg-opacity-10 z-51 md:hidden">
                    <div className="absolute top-0 left-0 w-64 h-full bg-white shadow-lg p-4 overflow-y-auto z-50">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-semibold">Filters</h2>
                            <X
                                size={20}
                                className="cursor-pointer"
                                onClick={() => setShowSidebar(false)}
                            />
                        </div>
                        <SidebarContent />
                    </div>
                </div>
            )}


            <main className="flex-1 p-4 md:p-6 overflow-y-auto">

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
                            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-orange-500 focus:ring focus:ring-orange-500 shadow-sm placeholder-gray-400 text-sm transition"
                        />

                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>

                    <div className="hidden md:flex items-center gap-2 mr-4">
                        <Grid
                            size={20}
                            className={`cursor-pointer ${viewMode === "grid" ? "text-orange-500" : "text-gray-400"
                                }`}
                            onClick={() => setViewMode("grid")}
                        />
                        <List
                            size={20}
                            className={`cursor-pointer ${viewMode === "list" ? "text-orange-500" : "text-gray-400"
                                }`}
                            onClick={() => setViewMode("list")}
                        />
                    </div>
                </div>


                {loading ? (
                    <p className="text-center mt-10">Loading products…</p>
                ) : products.length === 0 ? (
                    <p className="text-center mt-10 text-gray-500">
                        No products available.
                    </p>
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
            </main>
        </div>
    );
}

function SidebarContent() {
    return (
        <>
            <h2 className="font-semibold mb-4">Keywords</h2>
            <div className="flex flex-wrap gap-2 mb-4">
                {["Car", "SSD", "Laptop"].map((tag) => (
                    <span
                        key={tag}
                        className="px-2 py-1 text-sm bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
                    >
                        {tag}
                    </span>
                ))}
            </div>
            <button className="text-red-500 text-sm mb-6">Clear all</button>

            <div className="mb-6">
                <h3 className="font-medium mb-2">Category</h3>
                {[
                    "Electronics",
                    "Vehicles",
                    "Art & Collectibles",
                    "Fashion",
                    "Sports & Outdoors",
                ].map((cat) => (
                    <label
                        key={cat}
                        className="flex items-center space-x-2 text-sm mb-1"
                    >
                        <input type="checkbox" className="accent-orange-500" />
                        <span>{cat}</span>
                    </label>
                ))}
                <button className="text-red-500 text-sm mt-2">Clear all</button>
            </div>

            <div className="mb-6">
                <h3 className="font-medium mb-2">Price range</h3>
                <input type="range" min="0" max="9999" className="w-full" />
                <p className="text-xs mt-1">$0 - 9999</p>
            </div>

            <div className="mb-6">
                <h3 className="font-medium mb-2">Condition</h3>
                {["New", "Used", "Good"].map((cond) => (
                    <label
                        key={cond}
                        className="flex items-center space-x-2 text-sm mb-1"
                    >
                        <input type="checkbox" className="accent-orange-500" />
                        <span>{cond}</span>
                    </label>
                ))}
            </div>

            <div className="mb-6">
                <h3 className="font-medium mb-2">Tags</h3>
                {["New", "Used", "Good"].map((tag) => (
                    <label
                        key={tag}
                        className="flex items-center space-x-2 text-sm mb-1"
                    >
                        <input type="checkbox" className="accent-orange-500" />
                        <span>{tag}</span>
                    </label>
                ))}
            </div>
        </>
    );
}
