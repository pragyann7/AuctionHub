import { useContext } from "react";
import AuthContext from '../context/AuthContext';
import { Loader } from "./Loading";
import HomeContent from "../notUsedComponent/HomeContent";
import ProductCard from "./ProductCard";
import AuctionTabs from "./AuctionTabs";
import products from "../Resources/products.json";
import { ChevronsDown } from "lucide-react";
import bgMov from "../src/assets/justicewillserve0001-0190.mp4";

function Home() {
    const { user, isAuthenticated, loading } = useContext(AuthContext);

    const stats = [
        { id: 1, name: 'Active auctions every 24 hours', value: '7,500+' },
        { id: 2, name: 'Total items sold', value: '1.2 million+' },
        { id: 3, name: 'New bidders annually', value: '45,000+' },
    ]


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

                        {/* plain moto landingpage */}
                        {/* <div className="flex flex-col items-center justify-center min-h-170 md:min-h-210 relative">
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
                            <div
                                className="absolute bottom-9 flex items-center justify-center w-12 h-12 animate-bounce text-gray-700 opacity-50 hover:bg-gray-200 transition"
                            >
                                <ChevronsDown />
                            </div>
                        </div> */}


                        <div className="relative w-full h-screen overflow-hidden">
                            <div className="hidden md:block absolute inset-0 w-full h-full">
                                <video
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover"
                                >
                                    <source src={bgMov} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>

                            <div className="flex flex-col items-center justify-center min-h-170 md:min-h-210 relative md:hidden">
                                <div className="text-center">
                                    <h2 className="text-3xl font-semibold font-playfair text-gray-800 tracking-wide">
                                        <span className="block text-[#1A2238]">Bid.</span>
                                        <span className="block text-[#B68973]">Belong.</span>
                                        <span className="block text-[#7D5A50]">Become.</span>
                                    </h2>
                                    <p className="mt-4 text-gray-500 text-sm italic">
                                        The finest things in life aren’t bought — they’re won.
                                    </p>
                                </div>
                                <div className="absolute bottom-9 flex items-center justify-center w-12 h-12 animate-bounce text-gray-700 opacity-50 hover:bg-gray-200 transition">
                                    <ChevronsDown />
                                </div>
                            </div>

                            <div className="hidden md:flex absolute bottom-9 left-1/2 transform -translate-x-1/2">
                                <ChevronsDown className="w-12 h-12 animate-bounce text-white opacity-70 hover:opacity-100 transition" />
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

                            <div
                                className="absolute bottom-9 flex items-center justify-center w-12 h-12 animate-bounce text-gray-700 opacity-50 transition"
                            >
                                <ChevronsDown />
                            </div>
                        </div>

                        <div className="bg-gray-900 py-24 sm:py-32">
                            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                                <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
                                    {stats.map((stat) => (
                                        <div key={stat.id} className="mx-auto flex max-w-xs flex-col gap-y-4">
                                            <dt className="text-base/7 text-gray-400">{stat.name}</dt>
                                            <dd className="order-first text-3xl font-semibold tracking-tight text-white sm:text-5xl">{stat.value}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-4 mb-6 mt-19">
                            <hr className="flex-1 border-gray-300" />
                            <h2 className="text-3xl font-bold text-black">Auctions</h2>
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
