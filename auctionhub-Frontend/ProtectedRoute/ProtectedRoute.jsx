import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useContext(AuthContext);

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

    return isAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
