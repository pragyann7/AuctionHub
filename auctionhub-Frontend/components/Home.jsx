import { useContext } from "react";
import Navbar from './Navbar';
import AuthContext from '../context/AuthContext';
import { Loader } from "./Loading";

function Home() {
    const { user, isAuthenticated, loading } = useContext(AuthContext);

    if (loading) return <Loader text={"Wait Bro"} />



    return (
        <>
            <Navbar />
            <div className='w-full'>
                {isAuthenticated && user ? (
                    <h1 className='text-black text-7xl flex justify-center mt-50'>
                        This is Home, {user.username}!
                    </h1>
                ) : (
                    <h1 className='text-black text-7xl flex justify-center mt-50'>Guest Page</h1>
                )}
            </div>
        </>
    )
}

export default Home;
