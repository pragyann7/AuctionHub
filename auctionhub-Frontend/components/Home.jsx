import { useContext } from "react";
import Navbar from './Navbar';
import AuthContext from '../context/AuthContext';
import { Loader } from "./Loading";
import Footer from "./Footer";

function Home() {
    const { user, isAuthenticated, loading } = useContext(AuthContext);

    if (loading) return <Loader text={"Wait Bro"} />



    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <div className="flex-grow flex items-center justify-center">
                {isAuthenticated && user ? (
                    <h1 className='text-black text-7xl text-center'>
                        This is Home, {user.username}!
                    </h1>
                ) : (
                    <h1 className='text-black text-7xl text-center'>Guest Page</h1>
                )}
            </div>

            <Footer />
        </div>
    )
}

export default Home;
