import { useContext } from "react";
import AuthContext from '../context/AuthContext';
import { Loader } from "./Loading";
import HomeContent from "../notUsedComponent/HomeContent";
import ProductCard from "./ProductCard";
import AuctionTabs from "./AuctionTabs";
import products from "../Resources/products.json";
import { ChevronsDown } from "lucide-react";

function Home() {
    const { user, isAuthenticated, loading } = useContext(AuthContext);


    if (loading) return <Loader text={"Wait Bro"} />



    return (
        // <div className="container mx-auto px-4 py-8">
        //     <AuctionTabs auctions={products} />
        // </div>
        <div className="flex flex-col min-h-screen">

            <div>
                {isAuthenticated && user ? (
                    <>
                        {/* <h1 className="text-black text-4xl font-bold text-center mb-8">
                            Welcome back, {user.username}!
                        </h1> */}
                        {/* Product Grid */}
                        {/* <label htmlFor="auctionLive" className="text-3xl font-bold">Live Auction</label> */}
                        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                            {products.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div> */}

                        <div className="flex flex-col items-center justify-center min-h-170 md:min-h-210 relative">
                            {/* Your centered content */}
                            <div className="text-center">
                                <h2 className="text-3xl md:text-7xl font-semibold font-playfair text-gray-800 tracking-wide">
                                    <span className="block text-[#1A2238]">Bid.</span>
                                    <span className="block text-[#B68973]">Belong.</span>
                                    <span className="block text-[#7D5A50]">Become.</span>
                                </h2>
                                <p className="mt-4 text-gray-500 text-sm md:text-base italic">
                                    The finest things in life aren’t bought — they’re won.
                                </p>
                            </div>

                            {/* Scroll down button */}
                            <div
                                className="absolute bottom-9 flex items-center justify-center w-12 h-12 animate-bounce text-gray-700 opacity-50 transition"
                            >
                                <ChevronsDown />
                            </div>
                        </div>



                        <div className="flex items-center justify-center gap-4 mt-3 mb-8">
                            <hr className="flex-1 border-gray-300" />
                            <h2 className="text-4xl font-bold">Auctions</h2>
                            <hr className="flex-1 border-gray-300" />
                        </div>



                        <div className="container mx-auto px-4 py-8">
                            <AuctionTabs auctions={products} />
                        </div>
                    </>
                ) : (
                    <>
                        {/* <h1 className="text-black text-4xl font-bold text-center mb-8">
                            Guest Page
                        </h1> */}
                        {/* Product Grid for Guests */}
                        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div> */}

                        <div className="flex flex-col items-center justify-center min-h-170 md:min-h-210 relative">
                            {/* Your centered content */}
                            <div className="text-center">
                                <h2 className="text-3xl md:text-7xl font-semibold font-playfair text-gray-800 tracking-wide">
                                    <span className="block text-[#1A2238]">Bid.</span>
                                    <span className="block text-[#B68973]">Belong.</span>
                                    <span className="block text-[#7D5A50]">Become.</span>
                                </h2>
                                <p className="mt-4 text-gray-500 text-sm md:text-base italic">
                                    The finest things in life aren’t bought — they’re won.
                                </p>
                            </div>

                            {/* Scroll down button */}
                            <div
                                className="absolute bottom-9 flex items-center justify-center w-12 h-12 animate-bounce text-gray-700 opacity-50 transition"
                            >
                                <ChevronsDown />
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-4 mb-6">
                            <hr className="flex-1 border-gray-300" />
                            <h2 className="text-3xl font-bold">Auctions</h2>
                            <hr className="flex-1 border-gray-300" />
                        </div>



                        <div className="container mx-auto px-4 py-8">
                            <AuctionTabs auctions={products} />
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Home;
